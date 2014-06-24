
app.config ($stateProvider) ->
  $stateProvider.state "edit",
    url: "/edit/:screenId"
    templateUrl: "/js/edit/templates/edit.tpl.html"
    controller: "EditCtrl"
    authenticate: false

  return

