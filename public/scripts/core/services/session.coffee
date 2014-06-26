"use strict"

"use strict"
app.factory "Session", ($resource, SERVER_URL, LOGIN, SIGNUP) ->
  return {
    login: ->
      $resource "#{SERVER_URL}#{LOGIN}",

    signup: ->
      $resource "#{SERVER_URL}#{SIGNUP}",
  }
