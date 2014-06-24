(function() {
  app.config(function($stateProvider) {
    $stateProvider.state("edit", {
      url: "/edit",
      templateUrl: "/js/edit/templates/edit.tpl.html",
      controller: "EditCtrl",
      authenticate: false
    });
  });

}).call(this);
