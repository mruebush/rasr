(function() {
  define(function() {
    var Editor, Tools;
    Tools = {};
    Editor = void 0;
    Tools.initialize = function() {
      Editor = require("editor");
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
  });

}).call(this);
