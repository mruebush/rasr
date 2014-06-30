app.config ($stateProvider, $locationProvider, $httpProvider, $urlRouterProvider) ->
  $urlRouterProvider.otherwise "/404"
  $locationProvider.html5Mode true
  $stateProvider.state("home",
    url: "/"
    templateUrl: "/js/core/templates/home.tpl.html"
    controller: "AppCtrl"
  ).state("404",
    url: "/404"
    templateUrl: "/js/core/templates/404.tpl.html"
    controller: "404Ctrl"
  ).state("login",
    url: "/login"
    templateUrl: "/js/core/templates/login.tpl.html"
    controller: "LoginCtrl"
  ).state("signup",
    url: "/signup"
    templateUrl: "/js/core/templates/signup.tpl.html"
    controller: "SignupCtrl"
  ).state "settings",
    url: "/settings"
    templateUrl: "/js/core/templates/settings.tpl.html"
    controller: "SettingsCtrl"
    authenticate: true
