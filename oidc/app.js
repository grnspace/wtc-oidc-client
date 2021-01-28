(function () {
  function b64DecodeUnicode(str) {
    return decodeURIComponent(
      atob(str).replace(/(.)/g, function (m, p) {
        var code = p.charCodeAt(0).toString(16).toUpperCase();
        if (code.length < 2) {
          code = '0' + code;
        }
        return '%' + code;
      })
    );
  }

  function base64UrlDecode(str) {
    var output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw 'Illegal base64url string!';
    }

    try {
      return b64DecodeUnicode(output);
    } catch (err) {
      return atob(output);
    }
  }

  function InvalidTokenError(message) {
    this.message = message;
  }

  InvalidTokenError.prototype = new Error();
  InvalidTokenError.prototype.name = 'InvalidTokenError';

  function jwtDecode(token, options) {
    if (typeof token !== 'string') {
      throw new InvalidTokenError('Invalid token specified');
    }

    options = options || {};
    var pos = options.header === true ? 0 : 1;
    try {
      return JSON.parse(base64UrlDecode(token.split('.')[pos]));
    } catch (e) {
      throw new InvalidTokenError('Invalid token specified: ' + e.message);
    }
  }

  var params = new Map(
    window.location.search
      .slice(1)
      .split('&')
      .map((str) => str.split('='))
  );

  var code = params.get('code');
  if (code) {
    var signInEl = document.getElementsByClassName('wtc-signin')[0];
    var formData = new FormData();
    formData.append('code', code);
    formData.append('redirect_uri', signInEl.dataset.redirectUri);
    formData.append('grant_type', 'authorization_code');
    formData.append('client_id', signInEl.dataset.clientId);
    formData.append(
      'code_verifier',
      'U8GF5fVgvvXjWKJM3A8MtQlzoBY2_.jR.IBrW67Mc5hWLHTr7SN2SfnCuEGq0jffH0hMTCt8PB.CLco~H0qcJEno5AUgOGRuxdKpj1tQakBFt3kw3bM55ZMKh4tdH7uw'
    );

    var host =
      signInEl.dataset.host || 'https://app.wellnesstogether.grnspace.co/';
    if (host[host.length - 1] !== '/') host += '/';
    fetch(host + 'oauth2/token', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => jwtDecode(data.id_token))
      .then((idToken) => {
        var resultEl = document.getElementById('id-token-result');
        resultEl.textContent = JSON.stringify(idToken, null, 2);
        resultEl.style.display = '';
        hljs.highlightBlock(resultEl);
      })
      .catch((err) => {
        var resultEl = document.getElementById('id-token-result');
        resultEl.textContent = err.message;
        resultEl.style.display = '';
      });
  }
})();
