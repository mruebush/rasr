(function() {
  "use strict";
  app.factory("Session", function($resource, SERVER_URL, GET_JWT) {
    return $resource("" + SERVER_URL + GET_JWT);
  });

}).call(this);
