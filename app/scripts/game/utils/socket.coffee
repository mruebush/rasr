define(['events','player'], (events, Player) ->
  return (rootUrl, game, players) ->
    socket = io.connect()
    
    # game.user = game.user
    mapId = game.mapId

    game.on 'join', (data) ->
      console.log "#{data.user} joined the map ON #{data.x},#{data.y} !"
      player = new Player(game, Phaser, 
        x: data.x
        y: data.y
      )
      player.user = data.user
      do player.preload
      player.create()
      players[player.user] = player

    game.on 'shoot', (data) ->
      console.log "Someone shooting stuff"
      hero.renderMissiles data.x, data.y, data.angle, data.num

    game.on 'move', (data) ->
      console.log "Someone moving"
      players[data.user].move data 

    game.on 'player leave', (user) ->
      console.log "#{user} left the screen"
      players[user].sprite.kill()
      delete players[user]

    game.on 'changeMap', (direction) ->
      console.log "Leave #{game.mapId}"
      game.leave game.mapId, game.user
      game.map.reload(direction)

    game.on 'others', (data) ->
      for other, index in data.others
        console.log "#{other.user} joined the map on #{other.x},#{other.y}"
        game.trigger 'join',
          user: other.user
          x: other.x
          y: other.y

    game.shoot = (user, mapId, x, y, angle, num) ->
      socket.emit 'shoot',
        user: user
        mapId: mapId
        x: x
        y: y
        angle: angle
        num: num
    
    game.logout = (x, y) ->
      socket.emit 'logout',
        user: user
        mapId: game.mapId
        x: x
        y: y

    game.join = (data) ->

      x = data.x
      y = data.y
      console.log "#{game.user} joining #{game.mapId}"
      socket.emit 'join',
        user: game.user
        mapId: game.mapId
        x: x
        y: y

      _joinListener game.mapId, game.user


    game.leave = () ->
      socket.emit 'leave', 
        user: game.user
        mapId: game.mapId


    game.message = (message) ->
      socket.emit 'message',
        user: game.user
        message: message
        room: game.mapId

    game.move = (data) ->
      socket.emit 'move',
        dir: data.dir
        user: game.user
        room: game.mapId
        x: data.x
        y: data.y

    _shootListener = (user) ->
      socket.on 'shoot', (data) ->
        if data.user != game.user
          game.trigger 'shoot', data

    _leaveListener = (mapId, user) ->
      socket.on 'leave', (data) ->

        if data.user != game.user
          game.trigger 'player leave', data.user
  

    _joinListener = (user) ->
      socket.on mapId, (data) ->
        if data.user != game.user
          game.trigger('join', data)
        else 
          game.trigger('others', data)
  
    _moveListener = (user) ->
      socket.on 'move', (data) ->
        if data.user != game.user
          game.trigger('move', data)
  

    _leaveListener mapId, game.user
    _moveListener game.user
    _shootListener game.user

    # actions = events(actions)
    # window.actions = actions
    # actions
  )