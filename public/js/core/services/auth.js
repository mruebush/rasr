(function() {
  var Auth;

  app.factory("Auth", Auth = function($location, $rootScope, Session, User, $window) {
    $rootScope.currentUser = $cookieStore.get("user") || null;
    if ($rootScope.currentUser) {
      window.userData = Object.freeze({
        name: $rootScope.currentUser.name
      });
    }
    return {
      /*
      Authenticate user
      param  {Object}   user     - login info
      param  {Function} callback - optional
      return {Promise}
      */

      login: function(user, cb) {
        if (cb == null) {
          cb = angular.noop;
        }
        return Session.save({
          name: user.name,
          email: user.email,
          password: user.password
        }, function(user) {
          console.log("troll", user);
          $window.localStorage.token = user.token;
          window.userData = Object.freeze(user);
          return cb();
        }, function(err) {
          delete $window.localStorage.token;
          return cb(err);
        }).$promise;
      },
      /*
      Unauthenticate user
      
      param  {Function} callback - optional
      return {Promise}
      */

      logout: function(cb) {
        if (cb == null) {
          cb = angular.noop;
        }
        return Session["delete"](function() {
          $rootScope.currentUser = null;
          return cb();
        }, function(err) {
          return cb(err);
        }).$promise;
      },
      /*
      Create a new user
      
      param  {Object}   user     - user info
      param  {Function} callback - optional
      return {Promise}
      */

      createUser: function(user, cb) {
        if (cb == null) {
          cb = angular.noop;
        }
        return User.save(user, function(user) {
          $rootScope.currentUser = user;
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },
      /*
      Change password
      
      param  {String}   oldPassword
      param  {String}   newPassword
      param  {Function} callback    - optional
      return {Promise}
      */

      changePassword: function(oldPassword, newPassword, cb) {
        if (cb == null) {
          cb = angular.noop;
        }
        return User.update({
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },
      /*
      Gets all available info on authenticated user
      return {Object} user
      */

      currentUser: function() {
        return User.get();
      },
      /*
      Simple check to see if a user is logged in
      return {Boolean}
      */

      isLoggedIn: function() {
        var user;
        user = $rootScope.currentUser;
        return !!user;
      }
    };
  });

}).call(this);
