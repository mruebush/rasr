"use strict"
app.factory "Session", ($resource) ->
  $resource "/api/session/"

