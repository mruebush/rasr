app.factory('Export', ['$rootScope', ($rootScope) ->
  Export = {}
  Editor = $rootScope
  
  # ======================== 
  
  # ====== INITIALIZE ====== 
  
  # ======================== 
  Export.initialize = ->
    # Editor = require("editor")
    return

  
  # ==================== 
  
  # ====== EVENTS ====== 
  
  # ==================== 
  Export.events = "click #export": (e) ->
    Export.process e
    return

  
  # ===================== 
  
  # ====== PROCESS ====== 
  
  # ===================== 
  
  # TODO comment this
  Export.process = ->
    type = "JSON"
    include_base64 = Editor.$("select[name=include_base64]").val() is "yes"
    format_output = Editor.$("select[name=format_output]").val() is "yes"
    tileset = Editor.activeTileset
    anchor = document.createElement("a")
    w = 20
    h = 12
    tilesYCount = Math.round(tileset.height / tileset.tileheight)
    tilesXCount = Math.round(tileset.width / tileset.tilewidth)
    output = undefined
    layer = undefined
    coords = undefined
    y = undefined
    x = undefined
    query = undefined
    elem = undefined
    data = undefined
    anchor.download = "map." + type.toLowerCase()
    if type is "JSON"
      output = {}
      output.layers = []
      Editor.$(".layer").each ->
        layer =
          name: Editor.$(this).attr("data-name")
          tileset: Editor.$(this).attr("data-tileset")
          data: []
          x: 0
          y: 0
          height: h
          width: w
          visible: true
          type: "tilelayer"
          opacity: 1

        y = 0
        while y < h
          x = 0
          while x < w
            query = Editor.$(this).find("div[data-coords='" + x + "." + y + "']")
            coords = (if query.length then parseFloat(query.attr("data-coords-tileset"), 10) else -1)
            coords = coords.toString().split(".")
            temp = coords
            coords.push "0"  if coords.length is 1
            coords = (tilesXCount) * (parseInt(coords[1], 10)) + parseInt(coords[0], 10) + 1
            console.log "type: ", typeof coords
            layer.data.push coords
            x++
          y++
        output.layers.push layer
        return

      output.tilesets = []
      gid = 1
      for tileset of Editor.Tilesets.collection
        tileset = Editor.Tilesets.collection[tileset]
        image = tileset.image.split("/")
        tileset.image = image[image.length - 1]
        output.tilesets.push
          name: tileset.name
          image: tileset.image
          imagewidth: tileset.width
          imageheight: tileset.height
          tilewidth: tileset.tilewidth
          tileheight: tileset.tileheight
          margin: tileset.margin or 0
          spacing: tileset.spacing or 0
          firstgid: gid++

      output.canvas =
        width: window.parseInt(Editor.$("#canvas").css("width"), 10)
        height: window.parseInt(Editor.$("#canvas").css("height"), 10)

      _.extend output, Editor.cached
      output = JSON.stringify(output)
      anchor.href = "data:application/json;charset=UTF-8;," + encodeURIComponent(output)
    console.log "posting"
    $.ajax
      url: "/save/" + Editor.cached._id
      data:
        map: output

      dataType: "json"
      type: "PUT"
      success: ->
        location.href = location.origin + "/play"
        return

      error: (err) ->
        location.href = location.origin + "/play"
        return

    return

  return Export

])