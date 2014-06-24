(function() {
  app.controller("AppCtrl", function($scope, $location) {});

  app.config(function($stateProvider, $locationProvider, $httpProvider, $urlRouterProvider) {
    $httpProvider.interceptors.push([
      "$q", "$location", function($q, $location) {
        return {
          responseError: function(response) {
            if (response.status === 401) {
              $location.path("/login");
              return $q.reject(response);
            } else {
              return $q.reject(response);
            }
          }
        };
      }
    ]);
  }).run(function($rootScope, $location, Auth) {
    $rootScope.$on("$stateChangeStart", function(event, next) {
      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path("/login");
      }
    });
  });

}).call(this);
