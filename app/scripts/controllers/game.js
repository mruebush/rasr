'use strict'

angular.module('komApp')
  .controller('GameCtrl', function($scope, User, Auth) {
    $scope.currentUser = window.userData;
  })