(function() {
  "use strict";
  app.factory("Player", function($resource, SERVER_URL) {
    return $resource("" + SERVER_URL + "/api/player");
  });

}).call(this);
