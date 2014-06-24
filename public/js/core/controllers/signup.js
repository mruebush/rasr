(function() {
  "use strict";
  app.controller("SignupCtrl", function($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};
    console.log("submit stuff");
    return $scope.register = function(form) {
      $scope.submitted = true;
      if (form.$valid) {
        return Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        }).then(function() {
          $.ajax({
            method: "POST",
            url: "/makeuser",
            data: {
              user: $scope.user.name
            }
          });
          return $location.path("/");
        })["catch"](function() {
          var err;
          err = err.data;
          $scope.errors = {};
          return angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            return $scope.errors[field] = error.message;
          });
        });
      }
    };
  });

}).call(this);
