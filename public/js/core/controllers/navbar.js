(function() {
  app.controller("NavbarCtrl", function($scope, $location, Auth) {
    $scope.menu = [
      {
        title: "Home",
        link: "/"
      }, {
        title: "Play",
        link: "/play"
      }
    ];
    $scope.logout = function() {
      Auth.logout().then(function() {
        $location.path("/login");
      });
    };
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });

}).call(this);
