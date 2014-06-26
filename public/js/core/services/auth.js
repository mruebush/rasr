(function() {
  var Auth;

  app.factory("Auth", Auth = function($location, $rootScope, Session, User, $window) {
    if ($window.localStorage.currentUser) {
      $window.userData = Object.freeze({
        name: $window.localStorage.currentUser
      });
      $rootScope.userData = {
        name: $window.localStorage.currentUser
      };
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
        return Session.login().save({
          name: user.name,
          email: user.email,
          password: user.password
        }, function(user) {
          console.log("troll", user);
          $window.localStorage.token = user.token;
          $window.localStorage.currentUser = user.name;
          $window.userData = Object.freeze({
            name: user.name
          });
          return cb();
        }, function(err) {
          delete $window.localStorage.token;
          delete $window.localStorage.currentUser;
          delete $window.userData;
          return cb(err);
        }).$promise;
      },
      logout: function(cb) {
        if (cb == null) {
          cb = angular.noop;
        }
        delete $window.localStorage.token;
        delete $window.localStorage.currentUser;
        delete $window.userData;
        return cb().$promise;
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
        return Session.signup().save(user, function(user) {
          $window.localStorage.token = user.token;
          $window.localStorage.currentUser = user.name;
          $window.userData = Object.freeze({
            name: user.name
          });
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
      Gets name of authenticated user
      */

      currentUser: function() {
        return $window.localStorage.currentUser;
      },
      /*
      Simple check to see if a user is logged in
      return {Boolean}
      */

      isLoggedIn: function() {
        var user;
        user = $window.localStorage.currentUser;
        return !!user;
      }
    };
  });

}).call(this);
