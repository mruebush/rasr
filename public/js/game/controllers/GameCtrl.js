(function() {
  'use strict';
  app.controller('GameCtrl', [
    '$scope', 'User', 'Auth', function($scope, User, Auth) {
      $scope.currentUser = window.userData;
      $scope.chats = [];
      return $scope.sendChat = function() {
        var _results;
        $scope.chats.unshift({
          user: $scope.currentUser.name,
          message: $scope.chatToSend
        });
        $scope.chatToSend = '';
        _results = [];
        while ($scope.chats.length > 100) {
          _results.push($scope.chats.pop());
        }
        return _results;
      };
    }
  ]);

}).call(this);
