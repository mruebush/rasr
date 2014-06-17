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

      # console.log "#{thisUser} emitted leave from #{mapId}"

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
      # console.log "Register #{user} for leave events on #{mapId}"
      socket.on 'leave', (data) ->
        # console.log "Leave triggered by #{data.user}, current user is #{user}"
        if data.user != user
          actions.trigger 'player leave', data.user
          # console.log "#{data.user} just left the map"

    _joinListener = (mapId, thisUser) ->
      # console.log "Register #{thisUser} for join events on #{mapId}"
      socket.on mapId, (data) ->
        if data.user != thisUser
          actions.trigger('join', data)
        else 
          actions.trigger('others', data)
          # console.log "#{data.user} just joined the map"


    _moveListener = (user) ->
      socket.on 'move', (data) ->
        if data.user != user
          actions.trigger('move', data)
          # console.log "#{data.user} just moved to the #{data.dir}"


    actions = events(actions)
    window.actions = actions
    actions
  )