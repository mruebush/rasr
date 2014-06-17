define(['events'], (events) ->
  return (rootUrl) ->
    socket = io.connect()
    actions = {}
    # map

    actions.join = (mapId, thisUser, initPos) ->
      # map = mapId
      socket.emit 'join',
        user: thisUser
        mapId: mapId
        x: initPos.x
        y: initPos.y

      _joinListener mapId, thisUser
      _leaveListener mapId, thisUser
      _moveListener thisUser

    actions.leave = (mapId, thisUser) ->
      socket.emit 'leave', 
        user: thisUser
        mapId: mapId


    actions.message = (message, mapId, thisUser) ->
      socket.emit 'message',
        user: thisUser
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
  

    _joinListener = (mapId, thisUser) ->
      socket.on mapId, (data) ->
        if data.user != thisUser
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