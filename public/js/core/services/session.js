(function() {
  "use strict";
  app.factory("Session", function($resource) {
    return $resource("/api/session/");
  });

}).call(this);
