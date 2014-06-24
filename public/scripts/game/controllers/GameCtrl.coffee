'use strict'

app.controller 'GameCtrl', ['$scope', 'User', 'Auth', ($scope, User, Auth) ->
  $scope.currentUser = window.userData

  $scope.chats = []

  $scope.sendChat = ->
    $scope.chats.unshift(
      user: $scope.currentUser.name
      message: $scope.chatToSend
    )
    $scope.chatToSend = ''
    do $scope.chats.pop while $scope.chats.length > 100

]
