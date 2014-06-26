(function() {
  "use strict";
  "use strict";
  app.factory("Session", function($resource, SERVER_URL, LOGIN, SIGNUP) {
    return {
      login: function() {
        return $resource("" + SERVER_URL + LOGIN);
      },
      signup: function() {
        return $resource("" + SERVER_URL + SIGNUP);
      }
    };
  });

}).call(this);
