define ->
  Utils = {}
  Editor = undefined
  
  # ======================== 
  
  # ====== INITIALIZE ====== 
  
  # ======================== 
  Utils.initialize = ->
    Editor = require("editor")
    return

  
  # ============================ 
  
  # ====== MAKE SELECTION ====== 
  
  # ============================ 
  Utils.makeSelection = (e, container) ->
    tileset = Editor.activeTileset
    tw = tileset.tilewidth
    th = tileset.tileheight
    sx = undefined
    sy = undefined
    $container = Editor.$(container)
    offset = $container.offset()
    
    # Current x position relative to the tileset area
    x = Math.floor(((e.pageX - offset.left) + $container.scrollTop()) / tw) * tw
    y = Math.floor(((e.pageY - offset.top) + $container.scrollLeft()) / th) * th
    $selection = $container.find(".selection")

    
    # Create and append selection div
    if e.type is "mousedown"
      $container.append "<div class='selection'></div>"  unless $selection.length
      $selection.css
        left: x
        top: y
        width: tw
        height: th

      delete Editor.selection

      Editor.tmp_selection = [
        [
          x
          y
        ]
        new Array(2)
      ]
    else if e.type is "mousemove"
      
      # Resize selection div in the correct direction
      if Editor.mousedown
        sx = Editor.tmp_selection[0][0]
        sy = Editor.tmp_selection[0][1]
        w = Math.abs((x - sx) + tw)
        h = Math.abs((y - sy) + th)
        
        # Selection goes right
        if sx <= x
          $selection.css
            left: sx
            width: w

        
        # Selection goes left
        else
          $selection.css
            left: x
            width: w + tw * 2

        
        # Selection goes down
        if sy <= y
          $selection.css
            top: sy
            height: h

        
        # Selection goes up
        else
          $selection.css
            top: y
            height: h + th * 2

      
      # Hover selection
      else
        $container.append "<div class='selection'></div>"  unless $selection.length
        $container.find(".selection").css
          left: x
          top: y
          width: tw
          height: th

    else if e.type is "mouseup" and Editor.tmp_selection
      s = Editor.tmp_selection
      id = Editor.$("select[name=tileset_select] option:selected").index()
      ex = undefined
      ey = undefined
      s[1][0] = x
      s[1][1] = y
      
      # Normalize selection, so that the start coordinates
      # are smaller than the end coordinates
      sx = (if s[0][0] < s[1][0] then s[0][0] else s[1][0])
      sy = (if s[0][1] < s[1][1] then s[0][1] else s[1][1])
      ex = (if s[0][0] > s[1][0] then s[0][0] else s[1][0])
      ey = (if s[0][1] > s[1][1] then s[0][1] else s[1][1])
      Editor.selection = [
        [
          sx / tw
          sy / th
        ]
        [
          ex / tw
          ey / th
        ]
      ]
    return

  Utils

