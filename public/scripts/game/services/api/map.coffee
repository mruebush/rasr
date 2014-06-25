"use strict"
app.factory "MapAPI", ($resource, SERVER_URL, GET_SCREEN, MOVE_SCREEN, MAKE_SCREEN) ->
  return {
    getMap: ->
      $resource "#{SERVER_URL}#{GET_SCREEN}/:mapId",
        mapId: @mapId

    moveMap: ->
      $resource "#{SERVER_URL}#{MOVE_SCREEN}/:direction/:mapId",
        direction: @direction
        mapId: @mapId

    makeMap: ->
      $resource "#{SERVER_URL}#{MAKE_SCREEN}/:direction/:mapId",
        direction: @direction
        mapId: @mapId
  }

