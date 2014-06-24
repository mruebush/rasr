(function() {
  "use strict";
  app.factory("MapAPI", function($resource, SERVER_URL) {
    return {
      getMap: function(mapId) {
        return $resource("" + SERVER_URL + "/api/screen/:mapId", {
          mapId: mapId
        });
      },
      moveMap: function(direction, mapId) {
        return $resource("" + SERVER_URL + "/api/screen/move/:direction/:mapId", {
          direction: direction,
          mapId: mapId
        });
      },
      makeMap: function(direction, mapId) {
        return $resource("" + SERVER_URL + "/api/screen/make/:direction/:mapId", {
          direction: direction,
          mapId: mapId
        });
      }
    };
  });

}).call(this);
