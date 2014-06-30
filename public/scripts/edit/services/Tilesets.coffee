app.factory('Tilesets', ['TilesetView', '$rootScope', (TilesetView, $rootScope) ->
  Tilesets = {}
  Tilesets.collection = {}
  Editor = undefined
  count = undefined 
  newSet = []
  tilesetCount = 0
  
  # ======================== 
  
  # ====== INITIALIZE ====== 
  
  # ======================== 
  Tilesets.initialize = (data) ->
    # Editor = require("editor")
    count = 0
    Editor = $rootScope.Editor
    @view = TilesetView.initialize()
    tilesetCount = data.tilesets.length
    for key of data.tilesets
      tileset = data.tilesets[key]
      Editor.Tilesets.add
        image: "/assets/tilemaps/tiles/" + tileset.image
        name: tileset.name
        tilewidth: tileset.tilewidth
        tileheight: tileset.tileheight
        margin: tileset.margin
        spacing: tileset.spacing

    return

  
  # ================= 
  
  # ====== SET ====== 
  
  # ================= 
  Tilesets.set = (name) ->
    tileset = Tilesets.collection[name]
    Editor.activeTileset = tileset
    Editor.$("#tileset_container").css(
      width: tileset.width
      height: tileset.height
    ).attr "class", "ts_" + tileset.id
    Editor.$("#tilesets select").val name
    Editor.$("#tilesets .loading").remove()
    @resetSelection()
    return

  
  # ================= 
  # ====== ADD ====== 
  # ================= 
  Tilesets.add = (data) ->
    @total += 1
    img = new Image()
    bfr = document.createElement("canvas").getContext("2d")
    name = data.name or data.image.match(/(?:.+)\/([^\/]+)/)[1]
    style = document.createElement("style")
    id = name.replace(/[^a-zA-Z]/g, "_")
    css = undefined
    img.src = data.image
    img.addEventListener "load", (->
      bfr.canvas.width = data.width = @width
      bfr.canvas.height = data.height = @height
      
      # Process tileset
      data.base64 = Tilesets.setAlpha(this, data.alpha)  if data.alpha
      data.base64 = Tilesets.slice(this, data)  if data.margin
      if not data.alpha and not data.margin
        bfr.drawImage this, 0, 0
        data.base64 = bfr.canvas.toDataURL()
      data.id = id
      data.name = name
      Tilesets.collection[name] = data
      Tilesets.set name
      
      # Add a global css class so tiles can use
      # it in conjunction with background-position
      Editor.$(style).attr "id", "tileset_" + id
      Editor.$(style).attr "class", "tileset"
      css = ".ts_" + id + ", .ts_" + id + " > div {\n"
      css += "\twidth: " + data.tilewidth + "px;\n"
      css += "\theight: " + data.tileheight + "px;\n"
      css += "\tbackground-image: url('" + data.base64 + "');\n"
      css += "}"
      Editor.$(style).append css
      Editor.$("head").append style
      
      # Update select element
      Editor.$("#tilesets select").append "<option>" + name + "</option>"
      Editor.$("#tilesets select").val name
      
      # Update custom scrollbars and grid
      Editor.$("#tileset").jScrollPane()
      Editor.Canvas.updateGrid()
      count++
      if (count is tilesetCount)
        $rootScope.$broadcast('editorReady')
      return
    ), false
    return

  
  # ======================= 
  
  # ====== SET ALPHA ====== 
  
  # ======================= 
  
  # Filters specified color and makes it transparent
  Tilesets.setAlpha = (img, alpha) ->
    bfr = document.createElement("canvas").getContext("2d")
    imgData = undefined
    red = undefined
    i = undefined
    l = undefined
    bfr.canvas.width = img.width
    bfr.canvas.height = img.height
    bfr.drawImage img, 0, 0
    imgData = bfr.getImageData(0, 0, img.width, img.height)
    tolerance = 10
    i = 0
    l = imgData.data.length

    while i < l
      red = (if i % 4 is 0 then true else false)
      imgData.data[i + 3] = 0  if imgData.data[i] >= alpha[0] - tolerance and imgData.data[i] <= alpha[0] + tolerance and imgData.data[i + 1] >= alpha[1] - tolerance and imgData.data[i + 1] <= alpha[1] + tolerance and imgData.data[i + 2] >= alpha[2] - tolerance and imgData.data[i + 2] <= alpha[2] + tolerance  if red
      i++
    bfr.clearRect 0, 0, img.width, img.height
    bfr.putImageData imgData, 0, 0
    bfr.canvas.toDataURL()

  
  # =================== 
  
  # ====== SLICE ====== 
  
  # =================== 
  
  # Slices the tileset according to tile size and margin
  Tilesets.slice = (img, data) ->
    bfr = document.createElement("canvas").getContext("2d")
    tw = data.tilewidth
    th = data.tileheight
    imgData = undefined
    red = undefined
    x = undefined
    y = undefined
    xl = undefined
    yl = undefined
    m = data.margin
    bfr.canvas.width = img.width - (img.width / tw) * data.margin
    bfr.canvas.height = img.height - (img.height / th) * data.margin
    y = 0
    ly = Math.floor(bfr.canvas.height / th)

    while y < ly
      x = 0
      lx = Math.floor(bfr.canvas.width / tw)

      while x < lx
        bfr.drawImage img, (x * (tw + m)) + m, (y * (th + m)) + m, tw, th, x * tw, y * th, tw, th
        x++
      y++
    bfr.canvas.toDataURL()

  
  # ============================= 
  
  # ====== RESET SELECTION ====== 
  
  # ============================= 
  Tilesets.resetSelection = ->
    Editor.$("#canvas .selection").remove()
    Editor.$("#tileset .selection").remove()
    delete Editor.selection

    return

  
  # ======================== 
  
  # ====== GET ACTIVE ====== 
  
  # ======================== 
  Tilesets.getActive = ->
    Tilesets.collection[Editor.$("#tilesets select option:selected").val()]

  return Tilesets

 ])