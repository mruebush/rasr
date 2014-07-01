(function() {
  "use strict";
  var app;

  window.app = app = angular.module("komApp", ["ngCookies", "ngResource", "ngSanitize", "ui.router"]);

  app.constant("SERVER_URL", "http://rasr-server.azurewebsites.net");

  app.constant("SERVER_URL", "localhost:3000");

  app.constant("GET_SCREEN", "/api/screen");

  app.constant("MOVE_SCREEN", "/api/screen/move");

  app.constant("MAKE_SCREEN", "/api/screen/make");

  app.constant("GAME_SCREEN", "/game");

  app.constant("LOGIN", "/auth/login");

  app.constant("SIGNUP", "/auth/signup");

  app.constant("SAVE_TILESET", "/tileset/save");

}).call(this);
