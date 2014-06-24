(function() {
  "use strict";
  app.factory("Session", function($resource, SERVER_URL) {
    return $resource("" + SERVER_URL + "/api/session");
  });

}).call(this);
