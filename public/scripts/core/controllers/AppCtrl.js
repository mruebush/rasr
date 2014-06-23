app.controller('AppCtrl', function($scope, $location) {

});

app.config(function ($stateProvider, $locationProvider, $httpProvider, $urlRouterProvider) {
    // Intercept 401s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      // if($location.path() === '/play') {
      //   if(window.game) {
      //     window.game.paused = false;
      //   }
      // } else {
      //   if(window.game) {
      //     window.game.paused = true;
      //   }
      // }

      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });  
});
