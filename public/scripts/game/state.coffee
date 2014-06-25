app.config ($stateProvider) ->
  $stateProvider.state "game",
    url: "/game"
    templateUrl: "/js/game/templates/game.tpl.html"
    controller: "GameCtrl"
    authenticate: false

