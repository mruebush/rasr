"use strict"
app.factory "Session", ($resource, SERVER_URL, GET_JWT) ->
  $resource "#{SERVER_URL}#{GET_JWT}"
