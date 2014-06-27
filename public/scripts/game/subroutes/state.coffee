app.config ($stateProvider) ->
  $stateProvider.state "game.stats",
    url: "/stats"
    templateUrl: "/js/game/subroutes/templates/stats.tpl.html"
    controller: "StatsCtrl"
    authenticate: false

