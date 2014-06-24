(function() {
  app.controller('EditCtrl', [
    'Editor', '$rootScope', function(Editor, $rootScope) {
      var load;
      $rootScope.Editor = Editor;
      Editor = $rootScope.Editor;
      Editor.$ = $;
      $(document).ready(function() {
        var mapId;
        mapId = location.pathname.split("/")[2];
        $.ajax({
          url: "/screen/" + mapId,
          success: function(data) {
            Editor.initialize(data);
            load(data);
            setTimeout((function() {
              Editor.Import.process(JSON.stringify(data), "json");
            }), 2000);
          }
        });
      });
      load = function(data) {
        var cached;
        cached = {};
        if (data.upScreen) {
          cached.upScreen = data.upScreen;
        }
        if (data.rightScreen) {
          cached.rightScreen = data.rightScreen;
        }
        if (data.downScreen) {
          cached.downScreen = data.downScreen;
        }
        if (data.leftScreen) {
          cached.leftScreen = data.leftScreen;
        }
        cached._id = data._id;
        cached.orientation = data.orientation;
        cached.tileheight = data.tileheight;
        cached.tilewidth = data.tilewidth;
        cached.version = data.version;
        cached.width = data.width;
        cached.height = data.height;
        Editor.cached = cached;
      };
    }
  ]);

}).call(this);
