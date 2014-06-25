(function() {
  app.controller("LoginCtrl", function($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};
    $scope.login = function(form) {
      $scope.submitted = true;
      if (form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        }).then(function() {
          return $location.path("/");
        })["catch"](function(err) {
          err = err.data;
          console.log(err);
          return $scope.errors.other = err.message;
        });
      }
    };
  });

}).call(this);
