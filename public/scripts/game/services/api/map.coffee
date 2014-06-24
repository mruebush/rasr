"use strict"
app.factory "MapAPI", ($resource, SERVER_URL) ->
  return {
    getMap: (mapId) ->
      return $resource "#{SERVER_URL}/api/screen/:mapId",
        mapId: mapId

    moveMap: (direction, mapId) ->
      return $resource "#{SERVER_URL}/api/screen/move/:direction/:mapId",
        direction: direction
        mapId: mapId

    makeMap: (direction, mapId) ->
      return $resource "#{SERVER_URL}/api/screen/make/:direction/:mapId",
        direction: direction
        mapId: mapId
  }

