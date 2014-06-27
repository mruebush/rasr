app.directive('scrollGlue', ->
  return {
    require: ['?ngModel']
    restrict: 'A'
    link: (scope, element, attrs, ctrls) ->
      el = element[0]
      ngModel = ctrls[0]
      console.log(scope.chats, el, ngModel)

      scrollToBottom = ->
        el.scrollTop = el.scrollHeight

      shouldActivateAutoScroll = ->
        el.scrollTop + el.clientHeight + 1 >= el.scrollHeight

      scope.$watch "chats.length", ->
        if ngModel.$viewValue
          scrollToBottom() 

      element.bind 'scroll', ->
        activate = shouldActivateAutoScroll()
        if activate isnt ngModel.$viewValue
          scope.$apply(ngModel.$setViewValue.bind(ngModel, activate)) 
  }
)

app.directive('onFocusDisableHero', ->
  return {
    restrict: 'A',
    link: (scope, element, attrs) ->
      element.bind 'focus', ->
        scope.game.input.keyboard.disabled = true
      element.bind 'blur', ->
        scope.game.input.keyboard.disabled = false
  }
)