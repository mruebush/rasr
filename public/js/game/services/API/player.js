(function() {
  "use strict";
  app.factory("PlayerAPI", function($resource, SERVER_URL) {
    return $resource("" + SERVER_URL + "/api/player/me");
  });

}).call(this);
