define(['events','player','phaser'], (events, Player, Phaser) ->
  return (rootUrl, game, players) ->
    socket = io.connect()
    
    
    mapId = game.mapId

    game.on 'shoot', (data) ->
      game.hero.renderMissiles data.x, data.y, data.angle, data.num

    game.on 'move', (data) ->
      players[data.user].move data 

    game.on 'player leave', (user) ->
      console.log "#{user} left the screen"
      players[user].sprite.kill()
      delete players[user]

    game.on 'changeMap', (direction) ->
      console.log "Leave #{game.mapId}"
      game.leave game.mapId, game.user
      game.map.reload(direction)

    game.on 'player joined', (data) ->
      console.log "#{data.user} joined on #{data.x},#{data.y}"
      player = new Player(game, Phaser,
        x: data.x
        y: data.y
      )
      player.user = data.user
      do player.preload
      do player.create
      players[player.user] = player

    game.on 'i joined', (data) ->
      console.log 'render all other players'
      for other in data.others
        console.log "rendering #{other.user}"
        player = new Player(game, Phaser,
          x: other.x
          y: other.y
        )
        player.user = other.user
        do player.preload
        do player.create
        players[player.user] = player

      console.log 'render all enemies'
      console.log data.enemies

    game.shoot = (user, mapId, x, y, angle, num) ->
      console.log "#{user} shoots in #{mapId}"
      socket.emit 'shoot',
        user: user
        mapId: mapId
        x: x
        y: y
        angle: angle
        num: num
    
    game.logout = (x, y) ->
      socket.emit 'logout',
        user: game.user
        mapId: game.mapId
        x: x
        y: y

    game.join = (data) ->

      x = data.x
      y = data.y
      enemies = data.enemies

      socket.emit 'join',
        user: game.user
        mapId: game.mapId
        x: x
        y: y
        enemies: enemies

      _joinListener game.user


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
      socket.on game.mapId, (data) ->
        if data.user != game.user
          game.trigger('player joined', data)
        else
          game.trigger('i joined', data)

  
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