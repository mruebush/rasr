app.controller "NavbarCtrl", ($scope, $location, Auth) ->
  $scope.menu = [
    {
      title: "Home"
      link: "/"
    }
    {
      title: "Play"
      link: "/play"
    }
  ]
  $scope.logout = ->
    Auth.logout().then ->
      $location.path "/login"
      return

    return

  $scope.isActive = (route) ->
    route is $location.path()

  return

