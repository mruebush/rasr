(function() {
  "use strict";
  var app;

  window.app = app = angular.module("komApp", ["ngCookies", "ngResource", "ngSanitize", "ui.router"]);

  app.constant("SERVER_URL", "http://localhost:3000");

  app.constant("GET_SCREEN", "/api/screen");

  app.constant("MOVE_SCREEN", "/api/screen/move");

  app.constant("MAKE_SCREEN", "/api/screen/make");

  app.constant("GAME_SCREEN", "/game");

  app.constant("GET_JWT", "/auth");

  app.factory('authInterceptor', function($rootScope, $q, $locationProvider, $window) {
    return {
      request: function(config) {
        config.headers || (config.headers = {});
        if ($window.localStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
        }
        return config;
      },
      response: function(response) {
        if (response.status === 401) {
          $location.path('/login');
        }
        return response || $q.when(response);
      }
    };
  });

  app.config(function($httpProvider) {
    return $httpProvider.interceptors.push('authInterceptor');
  });

}).call(this);
