app.factory('Canvas', ['Editor', (Editor) -> 
  Canvas = {}
  Editor = undefined
  Canvas.cursor = []
  Canvas.cursor.last = {}
  
  # ======================== 
  
  # ====== INITIALIZE ====== 
  
  # ======================== 
  Canvas.initialize = ->
    Editor = require("editor")
    Editor.$("#canvas").draggable
      mouseButton: 1
      cursor: "move"
      start: ->
        unless Editor.keystatus.spacebar
          Editor.$("body").css "cursor", ""
          false

    @reposition()
    Editor.$("#canvas").fadeIn()
    Editor.$(window).on "resize", @reposition
    return

  
  # ==================== 
  
  # ====== EVENTS ====== 
  
  # ==================== 
  
  # Selection movement
  Canvas.events = "mousedown|mousemove|mouseup #canvas": (e) ->
    return  unless Editor.activeTileset
    if e.which is 3
      Editor.Tilesets.resetSelection()
      return
    tileset = Editor.activeTileset
    tw = tileset.tilewidth
    th = tileset.tileheight
    offset = Editor.$("#canvas").offset()
    x = Math.floor((e.pageX - offset.left) / tw)
    y = Math.floor((e.pageY - offset.top) / th)
    Canvas.cursor[0] = x
    Canvas.cursor[1] = y
    Editor.$("#canvas").find(".selection").css
      top: y * th
      left: x * tw

    unless Editor.keystatus.spacebar
      if Editor.selection and ((e.type is "mousedown" and e.which is 1) or Editor.mousedown)
        if Editor.tool is "draw"
          
          # Prevent redrawing of previous drawn tiles.
          # Start x, Start x, End x, End y
          sx = Editor.selection[0][0]
          sy = Editor.selection[0][1]
          ex = Editor.selection[1][0]
          ey = Editor.selection[1][1]
          
          # Length for iterated x and y variables
          lx = ex - sx
          ly = ey - sy
          
          # Iterate through selected tiles check to see if they have been previously drawn.
          y = 0
          while y <= ly
            x = 0
            while x <= lx
              return  if [
                Canvas.cursor[0] + x
                Canvas.cursor[1] + y
              ] of Canvas.cursor.last
              x++
            y++
          Canvas.draw()
        else Canvas.fill()  if Editor.tool is "fill" and e.type is "mousedown"
      else Canvas.makeSelection e  unless Editor.selection
      
      #On mouseup with selection clear last draw cache.
      Canvas.cursor.last = {}  if Editor.selection and not Editor.mousedown
    return

  
  # ================== 
  
  # ====== DRAW ====== 
  
  # ================== 
  Canvas.draw = ->
    tileset = Editor.activeTileset
    layer = Editor.Layers.getActive()
    
    # Cursor position
    cx = @cursor[0]
    cy = @cursor[1]
    
    # Tilsize
    tw = tileset.tilewidth
    th = tileset.tileheight
    
    # Start x, Start x, End x, End y
    sx = Editor.selection[0][0]
    sy = Editor.selection[0][1]
    ex = Editor.selection[1][0]
    ey = Editor.selection[1][1]
    
    # Length for iterated x and y variables
    lx = ex - sx
    ly = ey - sy
    
    # Background position
    bgpos = Editor.$("#canvas").find(".selection").css("background-position").split(" ")
    bgx = parseInt(bgpos[0], 10)
    bgy = parseInt(bgpos[1], 10)
    pos_x = undefined
    pos_y = undefined
    coords = undefined
    $div = undefined
    x = undefined
    y = undefined
    query = undefined
    cxp = undefined
    cyp = undefined
    $tile = undefined
    top = undefined
    left = undefined
    
    # Tile position on the canvas
    
    # Misc
    
    # TODO optimize this:
    # Checks if the current tileset differs
    # from the one used on the current layer
    unless Editor.$(layer.elem).attr("data-tileset")
      Editor.$(layer.elem).addClass "ts_" + tileset.id
      Editor.$(layer.elem).attr "data-tileset", tileset.name
    else unless Editor.$(layer.elem).attr("data-tileset") is tileset.name
      Editor.$("#canvas .warning").html("Cannot use different tilesets on one layer, please clear the layer first.").show().delay(2000).fadeOut 1000  unless Editor.$("#canvas .warning:visible").length
      return
    if Editor.selection.custom
      cxp = cx * tw
      cyp = cy * th
      Editor.$("#canvas").find(".selection").find("div").each ->
        top = parseInt(Editor.$(this).css("top"), 10)
        left = parseInt(Editor.$(this).css("left"), 10)
        $tile = Editor.$(this).clone()
        $tile.css
          top: top + cyp
          left: left + cxp

        coords = ((left + cxp) / tw) + "." + ((top + cyp) / th)
        query = Editor.$(layer.elem).find("div[data-coords='" + coords + "']")
        if query.length
          Editor.$(query).attr "style", $tile.attr("style")
        else
          $tile.attr "data-coords", coords
          Editor.$(layer.elem).append $tile
        return

    else
      
      # Iterate through selected tiles
      y = 0
      while y <= ly
        x = 0
        while x <= lx
          pos_x = cx + x
          pos_y = cy + y
          Canvas.cursor.last[[
            pos_x
            pos_y
          ]] = true
          coords = pos_x + "." + pos_y
          query = Editor.$(layer.elem).find("div[data-coords='" + coords + "']")
          
          # Update existing tile or create a new one and position it
          $div = (if query.length then query else Editor.$("<div>").css(
            position: "absolute"
            left: pos_x * tw
            top: pos_y * th
          ).attr("data-coords", coords))
          
          # Set/update the tileset information
          $div.attr "data-coords-tileset", (Math.abs(bgx / tw) + x) + "." + (Math.abs(bgy / th) + y)
          $div.css "background-position", (bgx - (x * tw)) + "px" + " " + (bgy - (y * th)) + "px"
          
          # Append the tile if it didn't on that coordinate
          Editor.$(layer.elem).append $div  unless query.length
          x++
        y++
    return

  
  # ================== 
  
  # ====== FILL ====== 
  
  # ================== 
  
  # TODO throw this in a webworker
  Canvas.fill = (e) ->
    tileset = Editor.activeTileset
    layer = Editor.Layers.getActive()
    
    # Cursor position
    cx = @cursor[0]
    cy = @cursor[1]
    
    # Tilsize
    tw = tileset.tilewidth
    th = tileset.tileheight
    
    # Start x, Start x, End x, End y
    sx = Editor.selection[0][0]
    sy = Editor.selection[0][1]
    ex = Editor.selection[1][0]
    ey = Editor.selection[1][1]
    
    # Field size in tiles
    fx = Editor.$("#canvas").width() / tw
    fy = Editor.$("#canvas").height() / th
    bgpos = Editor.$("#canvas").find(".selection").css("background-position").split(" ")
    bgx = parseInt(bgpos[0], 10)
    bgy = parseInt(bgpos[1], 10)
    query = Editor.$(layer.elem).find("div[data-coords='" + cx + "." + cy + "']")
    search_bgpos = (if query.length then query.attr("data-coords-tileset") else null)
    replace_bgpos = Math.abs(bgx / tw) + "." + Math.abs(bgy / th)
    documentFragment = document.createDocumentFragment()
    closedList = []
    fill_recursive = (ox, oy) ->
      coords = [
        [ # top
          ox
          oy - 1
        ]
        [ # bottom
          ox
          oy + 1
        ]
        [ # left
          ox - 1
          oy
        ]
        [ # right
          ox + 1
          oy
        ]
      ]
      $elem = undefined
      x = undefined
      y = undefined
      coords.forEach (arr) ->
        x = arr[0]
        y = arr[1]

        return  if x < 0 or x >= fx or y < 0 or y >= fy
        return  unless closedList.indexOf(x + "." + y) is -1
        $elem = Editor.$(layer.elem).find("div[data-coords='" + arr[0] + "." + arr[1] + "']")
        if (not $elem.length and not search_bgpos) or $elem.attr("data-coords-tileset") is search_bgpos
          unless $elem.length
            $elem = Editor.$("<div>").css(
              position: "absolute"
              left: x * tw
              top: y * th
            ).attr("data-coords", x + "." + y)
            documentFragment.appendChild $elem[0]
          $elem.css "background-position", bgx + "px" + " " + bgy + "px"
          $elem.attr "data-coords-tileset", replace_bgpos
          closedList.push x + "." + y
          fill_recursive x, y
        return

      return

    
    # TODO unify this
    unless Editor.$(layer.elem).attr("data-tileset")
      Editor.$(layer.elem).addClass "ts_" + tileset.id
      Editor.$(layer.elem).attr "data-tileset", tileset.name
    else unless Editor.$(layer.elem).attr("data-tileset") is tileset.name
      Editor.$("#canvas .warning").html("Cannot use different tilesets on one layer, please clear the layer first.").show().delay(2000).fadeOut 1000  unless Editor.$("#canvas .warning:visible").length
      return
    
    # Start the recursive search
    fill_recursive cx, cy
    Editor.$(layer.elem).append documentFragment
    return

  
  # ============================ 
  
  # ====== MAKE SELECTION ====== 
  
  # ============================ 
  Canvas.makeSelection = (e) ->
    tileset = undefined
    tw = undefined
    th = undefined
    ex = undefined
    ey = undefined
    $selection = undefined
    layer = undefined
    top = undefined
    left = undefined
    $tile = undefined
    Editor.Utils.makeSelection e, "#canvas"
    if e.type is "mousedown"
      Editor.$("#canvas").find(".selection").css "background-color", "rgba(0, 0, 0, 0.3)"
    else if e.type is "mouseup"
      tileset = Editor.activeTileset
      tw = tileset.tilewidth
      th = tileset.tileheight
      sx = Editor.selection[0][0] * tw
      sy = Editor.selection[0][1] * th
      ex = Editor.selection[1][0] * tw
      ey = Editor.selection[1][1] * th
      $selection = Editor.$("#canvas").find(".selection")
      layer = Editor.Layers.getActive()
      
      # Find all elements that are in range of
      # the selection and append a copy of them
      Editor.$(layer.elem).find("div").each ->
        top = parseInt(Editor.$(this).css("top"), 10)
        left = parseInt(Editor.$(this).css("left"), 10)
        if left >= sx and left <= ex and top >= sy and top <= ey
          $tile = Editor.$(this).clone()
          $tile.css
            top: top - sy
            left: left - sx

          $selection.append $tile
        return

      $selection.css "background-color", "transparent"
      $selection.addClass Editor.$(layer.elem).attr("class").replace("layer", "nobg")
      Editor.selection.custom = true
    return

  
  # ======================== 
  
  # ====== REPOSITION ====== 
  
  # ======================== 
  Canvas.reposition = (e) ->
    extra = (if Editor.$("#toolbar").width() + Editor.$("#canvas").width() < Editor.$(window).width() then Editor.$("#toolbar").width() / 2 else 0)
    left = (Editor.$(window).width() / 2) - (Editor.$("#canvas").width() / 2) + extra
    top = (Editor.$(window).height() / 2) - (Editor.$("#canvas").height() / 2)
    Editor.$("#canvas").css
      top: top
      left: left

    return

  
  # ========================= 
  
  # ====== UPDATE GRID ====== 
  
  # ========================= 
  
  # Creates a base64 image with two borders
  # resulting in a grid when used as a repeated background
  Canvas.updateGrid = ->
    buffer = document.createElement("canvas")
    bfr = buffer.getContext("2d")
    tileset = Editor.activeTileset
    tw = tileset.tilewidth
    th = tileset.tileheight
    buffer.width = tw
    buffer.height = th
    bfr.fillStyle = "rgba(0, 0, 0, 0.1)"
    bfr.fillRect 0, th - 1, tw, 1
    bfr.fillRect tw - 1, 0, 1, th
    Editor.$("#canvas").css "backgroundImage", "url(" + buffer.toDataURL() + ")"
    Editor.$("#canvas").find(".selection").css
      width: tw
      height: th

    return

  return Canvas

])