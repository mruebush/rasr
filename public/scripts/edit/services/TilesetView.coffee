app.factory('TilesetView', ['Editor', (Editor) ->
  TilesetView = {}
  TilesetView.config = filetypes: [
    "png"
    "jpg"
    "jpeg"
  ]
  TilesetView.tmp = {}
  
  # ======================== 
  
  # ====== INITIALIZE ====== 
  
  # ======================== 
  TilesetView.initialize = ->
    # Editor = require("editor")
    
    # Tileset UI functionality
    Editor.$("body").on("change", "#tilesets select", @changeTileset).on("change", "input[name=file_tileset]", @cacheFile).on("click", "#tilesets_add", @add).on "click", "#tilesets_remove", @remove
    Editor.$("#tileset_container").on "mousedown mouseup mousemove", @makeSelection
    Editor.$("#tileset_remove").on "click", @remove
    return

  
  # ================= 
  
  # ====== ADD ====== 
  
  # ================= 
  
  # Todo disallow mixing different tilesizes
  TilesetView.add = (e) ->
    data =
      tilewidth: +Editor.$("#dialog input[name=tile_width]").val()
      tileheight: +Editor.$("#dialog input[name=tile_height]").val()
      margin: +Editor.$("#dialog input[name=tile_margin]").val()
      alpha: Editor.$("#dialog input[name=tile_alpha]").val()

    hex = data.alpha.match(/^#?(([0-9a-fA-F]{3}){1,2})$/)
    type = undefined
    data = undefined
    
    # Parse HEX to rgb
    if hex and hex[1]
      hex = hex[1]
      if hex.length is 3
        data.alpha = [
          parseInt(hex[0] + hex[0], 16)
          parseInt(hex[1] + hex[1], 16)
          parseInt(hex[2] + hex[2], 16)
        ]
      else if hex.length is 6
        data.alpha = [
          parseInt(hex[0] + hex[1], 16)
          parseInt(hex[2] + hex[3], 16)
          parseInt(hex[5] + hex[6], 16)
        ]
    
    # Parse RGB
    else if data.alpha.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])(, ?|$)){3}$/)
      data.alpha = Editor._.map(data.alpha.split(","), (num) ->
        parseInt num, 10
      )
    else
      data.alpha = null
    
    # Editor.$("#loading").show();
    
    # URL or FileReader event
    unless window.FileReader
      data = TilesetView.tmp.match(/.+\/(.+)\.(.+)/)
      data.name = data[1]
      type = data[2].toLowerCase()
    else
      data.name = TilesetView.tmp.name
      type = TilesetView.tmp.type.split("/")[1]
    
    # Wrong file type
    if TilesetView.config.filetypes.indexOf(type.toLowerCase()) is -1
      alert "Wrong file type in \"" + data.name + "\"\nSupported file types: " + TilesetView.config.filetypes.join(", ")
    
    #Editor.$("#loading").hide();
    
    # Tileset does already exist
    else if Editor.$("#tilesets select option:contains(" + data.name + ")").length
      alert "File \"" + data.name + "\" does already exist."
    
    #Editor.$("#loading").hide();
    
    # Process tileset
    else
      if window.FileReader
        reader = new FileReader()
        reader.readAsDataURL TilesetView.tmp
        reader.onload = (e) ->
          TilesetView.process e, data
          return
      else
        TilesetView.process null, data
    return

  
  # ==================== 
  
  # ====== REMOVE ====== 
  
  # ==================== 
  TilesetView.remove = ->
    tileset = Editor.activeTileset
    return  unless confirm("This will remove all tiles associated with \"" + tileset.name + "\", continue?")
    Editor.$("style#tileset_" + tileset.id).remove()
    Editor.$("#tiles div.ts_" + tileset.id).remove()
    Editor.$(".layer[data-tileset='" + tileset.name + "']").removeAttr "data-tileset"
    Editor.$("#tilesets select option:selected").remove()
    delete Editor.Tilesets.collection[tileset.name]

    Editor.$("#tileset_container").css
      width: 0
      height: 0

    if Editor.$("#tilesets select option").length
      name = Editor.$("#tilesets select option:eq(0)").html()
      
      # TODO active previous tileset not the first one
      Editor.$("#tilesets select option").removeAttr "selected"
      Editor.$("#tilesets select option:eq(0)").attr "selected", true
      Editor.Tilesets.set name
    return

  
  # ============================ 
  
  # ====== CHANGE TILESET ====== 
  
  # ============================ 
  TilesetView.changeTileset = (e) ->
    name = Editor.$("#tilesets select option:selected").html()
    Editor.Tilesets.set name
    Editor.Tilesets.resetSelection()
    Editor.Canvas.updateGrid()
    return

  
  # ===================== 
  
  # ====== PROCESS ====== 
  
  # ===================== 
  
  # Form validation is done
  # task is passed to the model's add method
  TilesetView.process = (e, data) ->
    data.image = (if e then e.target.result else TilesetView.tmp)
    Editor.Tilesets.add data
    Editor.$("#dialog").dialog "close"
    return

  
  # ======================== 
  
  # ====== CACHE FILE ====== 
  
  # ======================== 
  TilesetView.cacheFile = (e) ->
    unless window.FileReader
      e.preventDefault()
      TilesetView.tmp = prompt("Your browser doesn't support local file upload.\nPlease insert an image URL below:", "")
    else if e.type is "change"
      TilesetView.tmp = e.target.files[0]
      Editor.$("#dialog input[name=tileset_file_overlay]").val TilesetView.tmp.name
    return

  
  # ============================ 
  
  # ====== MAKE SELECTION ====== 
  
  # ============================ 
  TilesetView.makeSelection = (e) ->
    return  unless Editor.$("#tilesets select option:selected").length
    tileset = undefined
    tw = undefined
    th = undefined
    ex = undefined
    ey = undefined
    Editor.Utils.makeSelection e, "#tileset_container"
    if e.type is "mouseup"
      tileset = Editor.activeTileset
      tw = tileset.tilewidth
      th = tileset.tileheight
      sx = Editor.selection[0][0] * tw
      sy = Editor.selection[0][1] * th
      ex = Editor.selection[1][0] * tw
      ey = Editor.selection[1][1] * th
      Editor.$("#canvas").append "<div class='selection'></div>"  unless Editor.$("#canvas .selection").length
      Editor.$("#canvas .selection").css(
        width: (ex - sx) + tw
        height: (ey - sy) + th
        backgroundColor: "transparent"
        backgroundPosition: (-sx) + "px " + (-sy) + "px"
      ).attr "class", "selection ts_" + tileset.id
      Editor.$("#tileset_container").find(".selection").remove()
      delete Editor.selection.custom
    return

  return TilesetView

 ])