define(['socketio'], (io) ->
  return (rootUrl) ->
    socket = io.connect(rootUrl)
    actions = {}

    actions.join = (mapId, thisUser) ->
      socket.emit 'join', mapId
      _joinListener mapId, thisUser 

    actions.leave = (mapId, thisUser) ->
      socket.emit 'leave', 
        user: thisUser
        mapId: mapId

    actions.message = (message, mapId, thisUser) ->
      socket.emit 'message',
        user: thisUser
        message: message
        room: mapId

    actions.move = (x, y, mapId, thisUser) ->
      socket.emit 'move',
        x: x
        y: y
        user: thisUser
        mapId: mapId

    _leaveListener = (mapId, user) ->
      socket.on 'leave', (mapId, user, thisUser) ->
        

    # _leaveListener = (mapId, user) ->
    #   socket.on 'leave', (data) ->
    #     if data.user is not user
    #       console.log 

    _joinListener = (mapId, thisUser) ->
      socket.on mapId, (data) ->
        if data.user is not thisUser
          console.log data.message

    _moveListener = (x, y, mapId, user) ->



    actions
  )