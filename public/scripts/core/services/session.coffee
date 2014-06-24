"use strict"
app.factory "Session", ($resource, SERVER_URL) ->
  $resource "#{SERVER_URL}/api/session"

