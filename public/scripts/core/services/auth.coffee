app.factory "Auth", Auth = ($location, $rootScope, Session, User, $cookieStore) ->
  
  # Get currentUser from cookie
  $rootScope.currentUser = $cookieStore.get("user") or null
  window.userData = Object.freeze(name: $rootScope.currentUser.name)  if $rootScope.currentUser
  # $cookieStore.remove "user"
  
  ###
  Authenticate user
  param  {Object}   user     - login info
  param  {Function} callback - optional
  return {Promise}
  ###
  login: (user, cb = angular.noop) ->
    Session.save(
      email: user.email
      password: user.password
    , (user) ->
      console.log "troll", user
      $rootScope.currentUser = user
      window.userData = Object.freeze(user)
      console.log($cookieStore.get("user"), $cookieStore);
      cb()
    , (err) ->
      cb err
    ).$promise

  
  ###
  Unauthenticate user
  
  param  {Function} callback - optional
  return {Promise}
  ###
  
  logout: (cb = angular.noop) ->
  
    return Session.delete( ->
            $rootScope.currentUser = null;
            return cb();
          , (err) ->
            return cb(err);
          ).$promise;
  
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
  Gets all available info on authenticated user
  return {Object} user
  ###
  currentUser: ->
    User.get()

  
  ###
  Simple check to see if a user is logged in
  return {Boolean}
  ###
  isLoggedIn: ->
    user = $rootScope.currentUser
    !!user
