define(['events'], (events) ->
  return (rootUrl) ->
    socket = io.connect()
    actions = {}

    actions.shoot = (user, mapId, x, y, angle, num) ->
      socket.emit 'shoot',
        user: user
        mapId: mapId
        x: x
        y: y
        angle: angle
        num: num
    
    actions.logout = (mapId, user, x, y) ->
      socket.emit 'logout',
        user: user
        mapId: mapId
        x: x
        y: y

    actions.join = (mapId, user, initPos) ->
      # map = mapId
      socket.emit 'join',
        user: user
        mapId: mapId
        x: initPos.x
        y: initPos.y

      _joinListener mapId, user
      _leaveListener mapId, user
      _moveListener user
      _shootListener user

    _shootListener = (user) ->
      socket.on 'shoot', (data) ->
        if data.user != user
          actions.trigger 'shoot', data


    actions.leave = (mapId, user) ->
      socket.emit 'leave', 
        user: user
        mapId: mapId


    actions.message = (message, mapId, user) ->
      socket.emit 'message',
        user: user
        message: message
        room: mapId

    actions.move = (dir, user, mapId, x, y) ->
      socket.emit 'move',
        dir: dir
        user: user
        room: mapId
        x: x
        y: y

    _leaveListener = (mapId, user) ->
      socket.on 'leave', (data) ->

        if data.user != user
          actions.trigger 'player leave', data.user
  

    _joinListener = (mapId, user) ->
      socket.on mapId, (data) ->
        if data.user != user
          actions.trigger('join', data)
        else 
          actions.trigger('others', data)
  


    _moveListener = (user) ->
      socket.on 'move', (data) ->
        if data.user != user
          actions.trigger('move', data)
  


    actions = events(actions)
    window.actions = actions
    actions
  )