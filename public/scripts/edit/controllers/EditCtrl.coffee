app.controller('EditCtrl', ['Editor', '$rootScope', (Editor, $rootScope) ->

  $rootScope.Editor = Editor
  Editor = $rootScope.Editor
  Editor.$ = $
  $(document).ready ->
    
    # var mapId = location.pathname.split("/")[2];
    # $("#load").click();
    mapId = location.pathname.split("/")[2]
    $.ajax
      url: "/screen/" + mapId
      success: (data) ->
        Editor.initialize data
        load data
        setTimeout (->
          Editor.Import.process JSON.stringify(data), "json"
          return
        ), 2000
        return

    return

  load = (data) ->
    cached = {}
    cached.upScreen = data.upScreen  if data.upScreen
    cached.rightScreen = data.rightScreen  if data.rightScreen
    cached.downScreen = data.downScreen  if data.downScreen
    cached.leftScreen = data.leftScreen  if data.leftScreen
    cached._id = data._id
    cached.orientation = data.orientation
    cached.tileheight = data.tileheight
    cached.tilewidth = data.tilewidth
    cached.version = data.version
    cached.width = data.width
    cached.height = data.height
    Editor.cached = cached
    return

  return

])