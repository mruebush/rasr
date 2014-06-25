(function() {
  "use strict";
  app.factory("MapAPI", function($resource, SERVER_URL, GET_SCREEN, MOVE_SCREEN, MAKE_SCREEN) {
    return {
      getMap: function() {
        return $resource("" + SERVER_URL + GET_SCREEN + "/:mapId", {
          mapId: this.mapId
        });
      },
      moveMap: function() {
        return $resource("" + SERVER_URL + MOVE_SCREEN + "/:direction/:mapId", {
          direction: this.direction,
          mapId: this.mapId
        });
      },
      makeMap: function() {
        return $resource("" + SERVER_URL + MAKE_SCREEN + "/:direction/:mapId", {
          direction: this.direction,
          mapId: this.mapId
        });
      }
    };
  });

}).call(this);
