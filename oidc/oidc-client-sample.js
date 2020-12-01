// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

///////////////////////////////
// UI event handlers
///////////////////////////////
document.getElementById('signin').addEventListener('click', signin, false);
document
  .getElementById('processSignin')
  .addEventListener('click', processSigninResponse, false);

///////////////////////////////
// OidcClient config
///////////////////////////////
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;

var staging = 'https://health-canada-test.grnspace.co/oauth2';
var prod = 'https://ca.portal.gs/oauth2';

var settings = {
  authority: 'https://health-canada-test.grnspace.co/oauth2',
  client_id: 'health-canada-demo-resource-pkce',
  redirect_uri: 'https://grnspace.github.io/wtc-oidc-client/oidc/',
  post_logout_redirect_uri: 'https://grnspace.github.io/wtc-oidc-client/oidc/',
  response_type: 'code',
  scope: 'openid email',

  filterProtocolClaims: true,
  loadUserInfo: true,
};
var client = new Oidc.OidcClient(settings);

///////////////////////////////
// functions for UI elements
///////////////////////////////
function signin() {
  client
    .createSigninRequest({ state: { bar: 15 } })
    .then(function (req) {
      log('signin request', req, "<a href='" + req.url + "'>go signin</a>");
      window.location = req.url;
    })
    .catch(function (err) {
      log(err);
    });
}

var signinResponse;
function processSigninResponse() {
  client
    .processSigninResponse()
    .then(function (response) {
      signinResponse = response;
      log('signin response', signinResponse);
    })
    .catch(function (err) {
      log(err);
    });
}

if (window.location.href.indexOf('#') >= 0) {
  processSigninResponse();
} else if (window.location.href.indexOf('?') >= 0) {
  processSignoutResponse();
}
