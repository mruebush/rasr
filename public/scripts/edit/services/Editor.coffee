app.factory('Editor', ['Utils', 'Menubar', 'Tools', 'Canvas', 'Tilesets', 'Layers', 'Export', 'Import', (Utils, Menubar, Tools, Canvas, Tilesets, Layers, Export, Import) ->

  # events = require("events")
  Editor = {}
  args = arguments
  argNames = [
    "Utils"
    "Menubar"
    "Tools"
    "Canvas"
    "Tilesets"
    "Layers"
    "Export"
    "Import"
  ]
  Editor.tool = "draw"
  Editor.keystatus = {}
  Editor.mousedown = false
  Editor.selection = null
  
  # ======================== 
  
  # ====== INITIALIZE ====== 
  
  # ======================== 
  Editor.initialize = (data) ->
    
    # Initialize sub modules
    argNames.forEach (v, i) ->
      Editor[v] = args[i]
      Editor[v].initialize data  if typeof Editor[v].initialize is "function"
      return

    
    # Register module events
    Editor.registerEvents()
    
    # Menubar interaction
    $("#menubar > li").on "click mouseover", (e) ->
      return  if e.type is "mouseover" and not $("#menubar > li.open").length
      $("#menubar > li").removeClass "open"
      $(e.currentTarget).addClass "open"
      return

    $("body").on "mousedown", (e) ->
      $("#menubar > li").removeClass "open"  unless $("#menubar").find(e.target).length
      return

    
    # Make toolbar resizable
    $("#toolbar").resizable
      minWidth: 250
      mouseButton: 1
      handles: "e"
      alsoResize: "#tileset, #tileset .jspPane, #tileset .jspContainer, #tileset .jspHorizontalBar *"
      stop: ->
        $("#tileset").jScrollPane()
        return

    
    # Global mouse status
    $(document).on "mousedown mouseup", (e) ->
      Editor.mousedown = e.type is "mousedown" and e.which is 1
      return

    
    # Global input status
    $(document).on "keydown keyup", (e) ->
      c = e.keyCode
      down = e.type is "keydown"
      Editor.keystatus.altKey = down  if e.altKey
      Editor.keystatus.ctrlKey = down  if e.ctrlKey
      Editor.keystatus.shiftKey = down  if e.shiftKey
      Editor.keystatus.spacebar = down  if c is 32
      return

    
    # Disable selection
    $("#tileset, #canvas_wrapper").disableSelection()
    
    # Hide the loading screen
    $("#loading_screen").delay(1000).fadeOut()
    return

  
  # ============================= 
  
  # ====== REGISTER EVENTS ====== 
  
  # ============================= 
  Editor.registerEvents = ->
    
    # Register module events
    pair = undefined
    type = undefined
    selector = undefined
    argNames.forEach (v) ->
      if Editor[v].events
        for evt of Editor[v].events
          pair = evt.split(" ")
          type = pair.shift().replace(/\|/g, " ")
          selector = pair.join(" ")
          $("body").on type, selector, Editor[v].events[evt]
      return

    return

  return Editor

])
