"use strict"
window.app = app = angular.module("komApp", [
  "ngCookies"
  "ngResource"
  "ngSanitize"
  "ui.router"
])
app.constant "SERVER_URL", "http://localhost:3000"
app.constant "GET_SCREEN", "/api/screen" # api/screen/:screenId
app.constant "MOVE_SCREEN", "/api/screen/move" # api/screen/move/:direction/:currentScreenId
app.constant "MAKE_SCREEN", "/api/screen/make" # api/screen/move/:direction/:currentScreenId
app.constant "GET_JWT", "/auth" #/auth

app.factory 'authInterceptor', ($rootScope, $q, $locationProvider, $window) ->
  return {
    request: (config) ->
      config.headers ||= {};
      if $window.localStorage.token 
        config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
      return config;
    ,
    response: (response) ->
      # handles the case where the user is not authenticated
      $location.path '/login' if response.status is 401
      return response || $q.when response
  }


app.config ($httpProvider) ->
  $httpProvider.interceptors.push 'authInterceptor'