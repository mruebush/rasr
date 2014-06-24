app.factory('Layers', ['Editor', (Editor) ->
  Layers = {}
  Editor = undefined
  
  # ======================== 
  
  # ====== INITIALIZE ====== 
  
  # ======================== 
  Layers.initialize = ->
    # Editor = require("editor")
    
    # Make layers sortable
    Editor.$("#layerlist").sortable
      axis: "y"
      mouseButton: 1
      appendTo: document.body
      update: @sortByIndex
      containment: "#layers > div"

    
    # Add predefined layers
    @add "background"
    @add "world"
    return

  
  # ==================== 
  
  # ====== EVENTS ====== 
  
  # ==================== 
  Layers.events =
    "click #layer-clear": (e) ->
      Layers.clear e
      return

    "click #layer-rename": (e) ->
      Layers.rename e
      return

    "click #layer-remove": (e) ->
      Layers.remove e
      return

    "click #layers-add": (e) ->
      Layers.add()
      return

    
    # Layer UI functionality
    "click #layerlist li": (e) ->
      Editor.$("#layerlist li").removeClass "active"
      Editor.$(e.currentTarget).addClass "active"
      return

    "click #layerlist li span:first-child": (e) ->
      Layers.toggleVisibility e
      return

    "click #layerlist li span:last-child": (e) ->
      Layers.openContextmenu e
      return

    mousedown: (e) ->
      $("body #contextmenu").remove()  if $("body #contextmenu").length  unless $(e.target).parent().attr("id") is "contextmenu"
      return

  
  # ================= 
  
  # ====== ADD ====== 
  
  # ================= 
  Layers.add = (name) ->
    id = 0
    ids = []
    if $("#layerlist li").length
      Editor.$("#layerlist li").each ->
        ids.push +@getAttribute("data-id")
        return

      id++  until ids.indexOf(id) is -1
    name = window.prompt("Layer name: (a-z, A-Z, _, -)")  unless name
    if not name or not name.match(/^[a-zA-Z_-][a-zA-Z0-9_-]{2,}$/)
      alert "Name invalid or too short!"  if name
      return
    Editor.$("#layerlist li").removeClass "active"
    Editor.$("#layerlist").append "<li class='active' data-id='" + id + "'><span class='fa fa-eye'></span> " + name + "<span class='fa fa-cog'></span></li>"
    Editor.$("#layerlist").sortable "refresh"
    
    # Create and append an associated layer div inside the canvas
    Editor.$("#tiles").append "<div class='layer' data-name='" + name + "' data-id='" + id + "'></div>"
    Layers.sortByIndex()
    return

  
  # ==================== 
  
  # ====== REMOVE ====== 
  
  # ==================== 
  Layers.remove = ->
    name = $(Layers.contextTarget).text().trim()
    id = $(Layers.contextTarget).attr("data-id")
    if confirm("Remove \"" + name + "\" ?")
      
      # TODO make this possible?
      if $("#layerlist li").length is 1
        alert "Cannot remove last layer!"
        return
      Editor.$(Layers.contextTarget).remove()
      Editor.$("#contextmenu").remove()
      Editor.$(".layer[data-id=" + id + "]").remove()
    return

  
  # =================== 
  
  # ====== CLEAR ====== 
  
  # =================== 
  Layers.clear = (e) ->
    name = $(Layers.contextTarget).text().trim()
    id = $(Layers.contextTarget).attr("data-id")
    if confirm("Remove all tiles from \"" + name + "\" ?")
      Editor.$(".layer[data-id=" + id + "]").html("").attr
        "data-tileset": ""
        class: "layer"

      Editor.$("#contextmenu").remove()
    return

  
  # ==================== 
  
  # ====== RENAME ====== 
  
  # ==================== 
  Layers.rename = (e) ->
    name = $(Layers.contextTarget).text().trim()
    id = $(Layers.contextTarget).attr("data-id")
    newName = prompt("Enter new name for \"" + name + "\":")
    if not newName or newName.length < 3
      alert "Name too short!"  if newName
      return
    
    # Rename associated div too
    Editor.$(".layer[data-id=" + id + "]").attr "data-name", newName
    
    # Create and append a new layer element to the toolbar
    Editor.$(Layers.contextTarget).html "<span class='fa fa-eye'></span> " + newName + "<span class='fa fa-cog'></span>"
    Editor.$("#contextmenu").remove()
    return

  
  # ======================== 
  
  # ====== GET ACTIVE ====== 
  
  # ======================== 
  Layers.getActive = ->
    id = $("#layerlist li.active").attr("data-id")
    id: $("#layerlist li.active").attr("data-id")
    elem: $(".layer[data-id=" + id + "]")[0]

  
  # =========================== 
  
  # ====== SORT BY INDEX ====== 
  
  # =========================== 
  
  # TODO Switch z-index while sorting
  Layers.sortByIndex = (e, ui) ->
    Editor.$("#layerlist li").each (i) ->
      id = $(this).attr("data-id")
      Editor.$(".layer[data-id=" + id + "]").css "z-index", i
      return

    return

  
  # =============================== 
  
  # ====== TOGGLE VISIBILITY ====== 
  
  # =============================== 
  Layers.toggleVisibility = (e) ->
    visible = $(e.currentTarget).hasClass("fa fa-eye")
    className = (if visible then "fa fa-eye-slash" else "fa fa-eye")
    id = $(e.currentTarget).parent().attr("data-id")
    Editor.$(e.currentTarget).attr "class", "icon " + className
    Editor.$(".layer[data-id=" + id + "]").toggle not visible
    return

  
  # ============================== 
  
  # ====== OPEN CONTEXTMENU ====== 
  
  # ============================== 
  Layers.openContextmenu = (e) ->
    Layers.contextTarget = $(e.currentTarget).parent()
    Editor.$.get "/partials/edit/cm_layer.html", (data) ->
      Editor.$("body").append data
      Editor.$("#contextmenu").css "left", e.pageX
      Editor.$("#contextmenu").css "top", e.pageY
      return

    return

  return Layers

])