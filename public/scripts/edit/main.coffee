require.config
  baseUrl: "scripts/edit"
  shim:
    "jquery-ui":
      exports: "$"
      deps: ["jquery"]

    "jquery.mousewheel": ["jquery"]
    "jquery.jscrollpane": ["jquery"]
    "jquery.draggable": ["jquery"]
    underscore:
      exports: "_"

  paths:
    jquery: "libs/jquery"
    "jquery.mousewheel": "plugins/jquery.mousewheel"
    "jquery.jscrollpane": "plugins/jquery.jscrollpane"
    "jquery.draggable": "plugins/jquery.draggable"
    "jquery-ui": "libs/jquery-ui"
    events: "../game/utils/events"
    editor: "modules/editor"
    underscore: "libs/underscore"
    text: "plugins/text"
    templates: "templates"

require [
  "jquery-ui"
  "editor"
], ($, Editor) ->
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

