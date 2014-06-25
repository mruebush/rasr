(function() {
  app.controller('EditCtrl', [
    'Editor', '$rootScope', '$http', '$stateParams', 'SERVER_URL', 'GET_SCREEN', function(Editor, $rootScope, $http, $stateParams, SERVER_URL, GET_SCREEN) {
      var load;
      $rootScope.Editor = Editor;
      Editor = $rootScope.Editor;
      Editor.$ = $;
      $(document).ready(function() {
        var url;
        url = "" + SERVER_URL + GET_SCREEN + "/" + $stateParams.screenId;
        $http({
          method: 'GET',
          url: url
        }).success(function(data, status, headers, config) {
          Editor.initialize(data);
          load(data);
          return $rootScope.$on('editorReady', function() {
            return Editor.Import.process(JSON.stringify(data), "json");
          });
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
