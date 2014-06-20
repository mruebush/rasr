'use strict';

angular.module('komApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router'
])
  .config(function ($stateProvider, $locationProvider, $httpProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('landing', {
        url: '/',
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .state('play', {
        url: '/play',
        templateUrl: 'partials/game',
        controller: 'GameCtrl',
        authenticate: true
      })
      .state('edit', {
        url: '/edit/:mapId',
        templateUrl: 'partials/edit'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl',
        authenticate: true
      });
    
    $locationProvider.html5Mode(true);
      
    // Intercept 401s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  .run(function ($rootScope, $location, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      // if($location.path() === '/play') {
      //   if(window.game) {
      //     window.game.paused = false;
      //   }
      // } else {
      //   if(window.game) {
      //     window.game.paused = true;
      //   }
      // }

      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  });