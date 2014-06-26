app.factory('Import', ['$rootScope', ($rootScope) ->
  Import = {}
  Tilesets = undefined
  Editor = undefined
  
  # ======================== 
  # ====== INITIALIZE ====== 
  # ======================== 
  Import.initialize = ->
    Editor = $rootScope.Editor
    # Editor = require("editor")
    return

  
  # ==================== 
  # ====== EVENTS ====== 
  # ==================== 
  Import.events =
    "change input[name=file_import]": (e) ->
      Import.cacheFile e
      return

    "click #import": (e) ->
      return alert("No file selected")  unless Import.tmp
      type = Import.tmp.name.split(".").pop().toLowerCase()
      reader = new FileReader()
      if window.FileReader
        reader.readAsText Import.tmp
        reader.onload = (e) ->
          Import.process e.target.result, type
          return
      else
        Import.process Import.tmp, type
      return

  getDefaultTileset = (data) ->
    data.tilesets[0].name

  
  # ===================== 
  # ====== PROCESS ====== 
  # ===================== 
  Import.process = (data, type) ->
    if type is "json"
      data = JSON.parse(data)
    else
      json =
        tilesets: []
        layers: []
        canvas: {}

      Editor.$(data).find("tileset").each (i) ->
        json.tilesets.push
          name: $(this).attr("name")
          image: $(this).attr("image")
          imagewidth: $(this).attr("imagewidth")
          imageheight: $(this).attr("imageheight")
          tilewidth: $(this).attr("tilewidth")
          tileheight: $(this).attr("tilewidth")

        return

      Editor.$(data).find("layer").each (i) ->
        json.layers.push
          name: $(this).attr("name")
          tileset: $(this).attr("tileset")
          data: $(this).html().split(",")

        return

      json.canvas =
        width: Editor.$(data).find("canvas").attr("width")
        height: Editor.$(data).find("canvas").attr("height")

      data = json
    Editor.$("#layerlist li, #tilesets option, .layer").remove()
    error = false
    data.tilesets.forEach (tileset) ->
      id = tileset.name.replace(/[^a-zA-Z]/g, "_")
      hasSrc = tileset.image.indexOf("data:image") is 0
      if not hasSrc and not Editor.$("#tileset_" + id).length
        alert "Error: the source for the tileset \"" + tileset.image + "\" " + "is not currently present and is not included in your map file either. " + "Importing will be aborted."
        error = true
        false
      else if hasSrc and not Editor.$("#tileset_" + id).length
        Editor.Tilesets.add tileset
      else Editor.$("#tilesets select").append "<option>" + tileset.name + "</option>"  if Editor.$("#tileset_" + id).length
      return

    return  if error
    Editor.Tilesets.set data.tilesets[0].name
    data.layers.forEach (layer) ->
      Editor.Layers.add layer.name
      layer.tileset = getDefaultTileset(data)  unless layer.tileset
      
      # data.layers
      tilesetId = undefined
      data.tilesets.forEach (v, i) ->
        
        if v.name is layer.tileset
          tilesetId = i
          false

      tileset = data.tilesets[tilesetId]
      unless data.canvas
        data.canvas =
          width: 1280
          height: 768

      w = Math.round(data.canvas.width / tileset.tilewidth)
      tw = tileset.tilewidth
      th = tileset.tileheight
      tilesWidthCount = data.tilesets[tilesetId]
      tilesYCount = Math.round(tileset.imageheight / tileset.tileheight)
      tilesXCount = Math.round(tileset.imagewidth / tileset.tilewidth)
      className = "ts_" + tileset.name.replace(/[^a-zA-Z]/g, "_")
      Editor.$(".layer[data-name=" + layer.name + "]").addClass className
      Editor.$(".layer[data-name=" + layer.name + "]").attr "data-tileset", tileset.name
      console.log('layers rendering: ', layer.data.length)

      layer.data.forEach (coords, i) ->
        return true  if coords is -1 or coords is 0
        temp = coords
        coords = (Math.max(0, coords % tilesXCount - 1)) + "." + Math.floor(coords / tilesXCount)
        # coords = coords.toString()
        coords += ".0"  if coords.length is 1
        x = i % w
        y = ~~(i / w)

        bgpos = coords.split(".")
        $div = Editor.$("<div>").css(
          position: "absolute"
          left: x * tw
          top: y * th
        ).attr("data-coords", x + "." + y)
        # if coords is '0.2'
        $div.attr "data-coords-tileset", coords
        $div.css "background-position", (-(bgpos[0] * tw)) + "px" + " " + (-(bgpos[1] * th)) + "px"
        Editor.$(".layer." + className + "[data-name='#{layer.name}']").append $div
        return


      return

    
    # Editor.$("#dialog").dialog("close");
    delete Import.tmp

    return

  Import.cacheFile = (e) ->
    unless window.FileReader
      e.preventDefault()
      Import.tmp = prompt("Your browser doesn't support local file upload.\nPlease insert an image URL below:", "")
    else if e.type is "change"
      Import.tmp = e.target.files[0]
      Editor.$("#dialog input[name=file_overlay]").val Import.tmp.name
    return

  return Import

 ])