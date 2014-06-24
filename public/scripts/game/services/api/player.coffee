"use strict"
app.factory "PlayerAPI", ($resource, SERVER_URL) ->
  $resource "#{SERVER_URL}/api/player/me"

