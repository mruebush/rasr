app.controller "LoginCtrl", ($scope, Auth, $location) ->
  $scope.user = {}
  $scope.errors = {}
  $scope.login = (form) ->
    $scope.submitted = true
    if form.$valid
      Auth.login(
        email: $scope.user.email
        password: $scope.user.password
      ).then( ->
        # Logged in, redirect to home
        $location.path "/"
      ).catch (err) ->
        err = err.data
        console.log(err)
        $scope.errors.other = err.message

    return

  return