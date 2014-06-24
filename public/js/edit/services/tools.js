(function() {
  app.factory('Tools', [
    '$rootScope', function($rootScope) {
      var Editor, Tools;
      Tools = {};
      Editor = void 0;
      Tools.initialize = function() {
        Editor = $rootScope.Editor;
      };
      Tools.events = {
        "click *[data-tool]": function(e) {
          Tools.select(e);
        }
      };
      Tools.select = function(e) {
        var $target;
        $target = Editor.$(e.currentTarget);
        Editor.$("#tools").find("span").removeClass("active");
        $target.addClass("active");
        Editor.tool = $target.attr("data-tool");
      };
      return Tools;
    }
  ]);

}).call(this);
