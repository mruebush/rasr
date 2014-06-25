"use strict"
app.factory "Session", ($resource, SERVER_URL, GET_SESSION) ->
  $resource "#{SERVER_URL}#{GET_SESSION}"
