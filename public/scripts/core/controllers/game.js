'use strict'

angular.module('komApp')
  .controller('GameCtrl', function($scope, User, Auth) {
    $scope.currentUser = window.userData;

    $scope.chats = [];

    $scope.sendChat = function() {
      $scope.chats.unshift({user: $scope.currentUser.name, message: $scope.chatToSend});
      $scope.chatToSend = '';
      while ($scope.chats.length > 100) {
        $scope.chats.pop();
      }
    }
  });