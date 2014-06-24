"use strict"
window.app = app = angular.module("komApp", [
  "ngCookies"
  "ngResource"
  "ngSanitize"
  "ui.router"
])
app.constant "SERVER_URL", "http://localhost:8000"
