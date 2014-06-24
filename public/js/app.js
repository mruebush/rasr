(function() {
  "use strict";
  var app;

  window.app = app = angular.module("komApp", ["ngCookies", "ngResource", "ngSanitize", "ui.router"]);

  app.constant("SERVER_URL", "http://localhost:3000");

  app.constant("GET_SCREEN", "api/screen/get");

  app.constant("SAVE_SCREEN", "api/screen/save");

  app.constant("MOVE_SCREEN", "api/screen/move");

}).call(this);
