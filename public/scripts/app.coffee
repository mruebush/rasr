"use strict"
window.app = app = angular.module("komApp", [
  "ngCookies"
  "ngResource"
  "ngSanitize"
  "ui.router"
])
app.constant "SERVER_URL", "http://rasr-server.azurewebsites.net"
# app.constant "SERVER_URL", "http://rasrapi.azurewebsites.net"
app.constant "GET_SCREEN", "/api/screen" # api/screen/:screenId
app.constant "MOVE_SCREEN", "/api/screen/move" # api/screen/move/:direction/:currentScreenId
app.constant "MAKE_SCREEN", "/api/screen/make" # api/screen/move/:direction/:currentScreenId
app.constant "GAME_SCREEN", "/game"
app.constant "LOGIN", "/auth/login" #/auth
app.constant "SIGNUP", "/auth/signup" #/auth
app.constant "SAVE_TILESET", "/tileset/save"
