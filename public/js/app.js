(function() {
  "use strict";
  var app, server;

  window.app = app = angular.module("komApp", ["ngCookies", "ngResource", "ngSanitize", "ui.router"]);

  server = location.origin.indexOf('localhost') !== -1 ? "http://localhost:3000" : "http://rasr-server.azurewebsites.net";

  app.constant("SERVER_URL", server);

  app.constant("GET_SCREEN", "/api/screen");

  app.constant("MOVE_SCREEN", "/api/screen/move");

  app.constant("MAKE_SCREEN", "/api/screen/make");

  app.constant("GAME_SCREEN", "/game");

  app.constant("LOGIN", "/auth/login");

  app.constant("SIGNUP", "/auth/signup");

  app.constant("SAVE_TILESET", "/tileset/save");

}).call(this);
