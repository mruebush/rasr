(function() {
  "use strict";
  app.factory("Session", function($resource, SERVER_URL, GET_SESSION) {
    return $resource("" + SERVER_URL + GET_SESSION);
  });

}).call(this);
