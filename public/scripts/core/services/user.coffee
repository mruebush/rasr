"use strict"
app.factory "User", ($resource, SERVER_URL) ->
  $resource "#{SERVER_URL}/api/users/:id",
    id: "@id"
  ,
    #parameters default
    update:
      method: "PUT"
      params: {}

    get:
      method: "GET"
      params:
        id: "me"