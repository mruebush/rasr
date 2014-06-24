app.factory('Menubar', ['Editor', (Editor) ->
  Menubar = {}
  
  # ======================== 
  
  # ====== INITIALIZE ====== 
  
  # ======================== 
  Menubar.initialize = ->
    # Editor = require("editor")
    return

  
  # ==================== 
  
  # ====== EVENTS ====== 
  
  # ==================== 
  Menubar.events =
    "click *[data-template]": (e) ->
      Menubar.openDialog e
      return

    "click *[data-toggle]": (e) ->
      Menubar.toggle e
      return

    "keydown|keyup #canvas_settings input": (e) ->
      Menubar.canvasSettings e
      return

    "keydown|keyup #viewport_settings input": (e) ->
      Menubar.viewportSettings e
      return

  
  # ========================= 
  
  # ====== OPEN DIALOG ====== 
  
  # ========================= 
  
  # Elements with a data-template attribute will
  # automaticly open a dialog with the correspondig template
  Menubar.openDialog = (e) ->
    template = Editor.$(e.currentTarget).attr("data-template")
    title = Editor.$(e.currentTarget).text()
    $.get "/scripts/edit/templates/" + template + ".html", (data) ->
      Editor.$("#dialog").html(data).dialog
        title: title
        modal: true
        closeText: "<span class='fa fa-times-circle'></span>"
        resizable: false
        width: "auto"

      Editor.$("#dialog").find("input[data-value]").each ->
        pair = Editor.$(this).attr("data-value").split(":")
        type = Editor.$(this).attr("type")
        value = Editor.$(pair[0]).css(pair[1])
        value = parseInt(value, 10)  if type is "number"
        value = Math.floor(value / Editor.activeTileset.tilesize[pair[1]])  if pair[2] is "tiles"
        Editor.$(this).val value
        return

      return

    return

  
  # ==================== 
  
  # ====== TOGGLE ====== 
  
  # ==================== 
  
  # Elements with a data-toggle attribute will
  # automaticly be toggled when clicked
  Menubar.toggle = (e) ->
    value = Editor.$(e.currentTarget).attr("data-toggle")
    extra = value.split(":")
    status = undefined
    elem = undefined
    
    # data-toggle="visibility:elem">
    if extra[0] is "visibility"
      status = Editor.$(extra[1]).toggle()
      Editor.$(e.currentTarget).find("span").toggleClass "fa-square-o", "fa-check-square-o"
    
    # data-toggle="class:classname:elem"dddd
    else if extra[0] is "class"
      status = Editor.$(extra[2]).toggleClass(extra[1])
      Editor.$(e.currentTarget).find("span").toggleClass "fa-square-o", "fa-check-square-o"
    else if extra[0] is "fullscreen"
      elem = Editor.$(extra[1])[0]
      unless Editor.fullscreen
        if elem.requestFullscreen
          elem.requestFullscreen()
        else if elem.mozRequestFullScreen
          elem.mozRequestFullScreen()
        else elem.webkitRequestFullscreen()  if elem.webkitRequestFullscreen
      else
        if document.cancelFullScreen
          document.cancelFullScreen()
        else if document.mozCancelFullScreen
          document.mozCancelFullScreen()
        else document.webkitCancelFullScreen()  if document.webkitCancelFullScreen
      Editor.$(e.currentTarget).find(".text").html (if Editor.fullscreen then "Fullscreen" else "Windowed")
      Editor.$(e.currentTarget).find("span:eq(0)").toggleClass "fa-compress", "fa-expand"
      Editor.fullscreen = not Editor.fullscreen
    else
      Menubar.toggleFunctions[value]()
    return

  
  # ============================= 
  
  # ====== CANVAS SETTINGS ====== 
  
  # ============================= 
  Menubar.canvasSettings = (e) ->
    name = Editor.$(e.currentTarget).attr("name")
    value = Editor.$(e.currentTarget).val()
    tileset = Editor.activeTileset
    value = (+value) * tileset.tilewidth  if name is "width"
    value = (+value) * tileset.tileheight  if name is "height"
    Editor.$("#canvas").css name, value
    Editor.Canvas.reposition()
    return

  
  # =============================== 
  
  # ====== VIEWPORT SETTINGS ====== 
  
  # =============================== 
  Menubar.viewportSettings = (e) ->
    name = Editor.$(e.currentTarget).attr("name")
    value = +Editor.$(e.currentTarget).val()
    Editor.$("#viewport").css name, value
    Editor.Canvas.reposition()
    return

  Menubar.toggleFunctions = {}
  return Menubar

 ])