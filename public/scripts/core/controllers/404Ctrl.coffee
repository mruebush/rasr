app.controller "404Ctrl", ($scope, $state) ->
  $scope.home = ->
    $state.go('home')