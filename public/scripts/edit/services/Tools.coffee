app.factory('Tools', ['$rootScope', ($rootScope) ->
  Tools = {}
  Editor = undefined
  
  # ======================== 
  
  # ====== INITIALIZE ====== 
  
  # ======================== 
  Tools.initialize = ->
    Editor = $rootScope.Editor
    return

  
  # ==================== 
  
  # ====== EVENTS ====== 
  
  # ==================== 
  Tools.events = "click *[data-tool]": (e) ->
    Tools.select e
    return

  
  # ==================== 
  
  # ====== SELECT ====== 
  
  # ==================== 
  Tools.select = (e) ->
    $target = Editor.$(e.currentTarget)
    Editor.$("#tools").find("span").removeClass "active"
    $target.addClass "active"
    Editor.tool = $target.attr("data-tool")
    return

  return Tools

 ])