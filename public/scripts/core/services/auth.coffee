app.factory "Auth", Auth = ($location, $rootScope, Session, User, $window) ->
  
  # Get currentUser from jwt
  if $window.localStorage.currentUser
    $window.userData = Object.freeze(
      name: $window.localStorage.currentUser
    )
    $rootScope.userData = 
      name: $window.localStorage.currentUser
  ###
  Authenticate user
  param  {Object}   user     - login info
  param  {Function} callback - optional
  return {Promise}
  ###
  login: (user, cb = angular.noop) ->
    Session.save(
      name: user.name
      email: user.email
      password: user.password
    , (user) ->
      console.log "troll", user
      $window.localStorage.token = user.token
      $window.localStorage.currentUser = user.name
      $window.userData = Object.freeze(
        name:user.name
      )
      cb()
    , (err) ->
      # Erase the token if the user fails to log in
      delete $window.localStorage.token
      delete $window.localStorage.currentUser
      cb err
    ).$promise

  # DELETE JWT
  logout: (cb = angular.noop) ->
    delete $window.localStorage.token
    delete $window.localStorage.currentUser
    return cb().$promise

  ###
  Create a new user
  
  param  {Object}   user     - user info
  param  {Function} callback - optional
  return {Promise}
  ###
  createUser: (user, cb = angular.noop) ->
    User.save(user, (user) ->
      $rootScope.currentUser = user
      cb user
    , (err) ->
      cb err
    ).$promise

  
  ###
  Change password
  
  param  {String}   oldPassword
  param  {String}   newPassword
  param  {Function} callback    - optional
  return {Promise}
  ###
  changePassword: (oldPassword, newPassword, cb = angular.noop) ->
    User.update(
      oldPassword: oldPassword
      newPassword: newPassword
    , (user) ->
      cb user
    , (err) ->
      cb err
    ).$promise

  
  ###
  Gets name of authenticated user
  ###
  currentUser: ->
    $window.localStorage.currentUser

  
  ###
  Simple check to see if a user is logged in
  return {Boolean}
  ###
  isLoggedIn: ->
    user = $window.localStorage.currentUser
    !!user
