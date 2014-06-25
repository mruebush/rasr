(function() {
  "use strict";
  app.factory("User", function($resource, SERVER_URL) {
    return $resource("" + SERVER_URL + "/api/users/:id", {
      id: "@id"
    }, {
      update: {
        method: "PUT",
        params: {}
      },
      get: {
        method: "GET",
        params: {
          id: "me"
        }
      }
    });
  });

}).call(this);
