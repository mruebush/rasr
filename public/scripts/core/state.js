app.config(function ($stateProvider, $locationProvider, $httpProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/404');
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/scripts/core/templates/home.tpl.html',
        controller: 'AppCtrl'
      })
      .state('404', {
        url: '/404',
        template: '/scripts/core/templates/404.tpl.html'
      })
      .state('login', {
        url: '/login',
        templateUrl: '/scripts/core/templates/login.tpl.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: '/scripts/core/templates/signup.tpl.html',
        controller: 'SignupCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: '/scripts/core/templates/settings.tpl.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
      // .state('play', {
      //   url: '/play',
      //   templateUrl: '/scripts/core/templates/game',
      //   controller: 'GameCtrl',
      //   authenticate: true
      // })
      // .state('edit', {
      //   url: '/edit/:mapId',
      //   templateUrl: '/scripts/core/templates/edit',
      //   authenticate: true
      // })

  });