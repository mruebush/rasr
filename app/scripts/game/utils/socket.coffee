define(['events','player','enemy','messages'], (events, Player, Enemy, messages) ->
  return (rootUrl, game, players, $, Phaser) ->
    socket = io.connect()
    window.socket = socket

    mapId = game.mapId

    game.on 'derender enemy', (data) ->
      console.log "time to derender", data

      console.log game.enemies
      for creature in game.enemies
        if creature.serverId is data.enemy
          creature.alive = false
          console.log creature
          do creature.sprite.kill

    game.on 'move enemies', (data) ->
      nums = data.nums
      for enemy,i in game.enemies
        enemy.setDirection nums[i]
        do enemy.clearDirection

    game.on 'enterMap', () ->

      game.enemyData = game.mapData.enemies || []

      enemies = []
      enemyPositions = {}

      for enemyId of game.enemyData
          enemies.push 
            id: enemyId
            count: game.enemyData[enemyId].count
          enemyPositions[enemyId] = game.enemyData[enemyId].positions

      game.enemyPositions = enemyPositions

      game.join
        mapId: game.mapId
        x: game.hero.sprite.x
        y: game.hero.sprite.y
        enemies: enemies
        positions: enemyPositions

    game.on 'shoot', (data) ->
      game.hero.renderMissiles data.x, data.y, data.angle, data.num

    game.on 'move', (data) ->
      players[data.user].move data 

    game.on 'player leave', (user) ->
      players[user].sprite.kill()
      delete players[user]


    game.on 'changeMap', (direction) ->
      game.leave game.mapId, game.user

    game.on 'player joined', (data) ->
      player = new Player(game, Phaser,
        x: data.x
        y: data.y
      )
      player.user = data.user
      do player.preload
      do player.create
      players[player.user] = player

    game.on 'i joined', (data) ->
      for other in data.others
        player = new Player(game, Phaser,
          x: other.x
          y: other.y
        )
        player.user = other.user
        do player.preload
        do player.create
        players[player.user] = player

      for enemy in game.enemies
        do enemy.derender

      data.enemies = data.enemies || []
      game.enemies = []

      for enemyType of data.enemies
        type = data.enemies[enemyType]
        num = 0
        for i,creature of type
          console.log type[creature]
          enemy = new Enemy game, Phaser,
            rank: 1
            health: creature.health
            dmg: 1
            png: creature.png
            speed: creature.speed
            x: +creature.position[0]
            y: +creature.position[1]
            id: num
            dbId: creature._id

          do enemy.create
          game.enemies.push enemy
          num++

    game.killEnemy = (enemy) ->
      console.log "enemy dies", enemy
      socket.emit 'enemyDies', 
        enemy: enemy.serverId
        mapId: game.mapId
        _id: enemy.dbId
        # user: game.user

    _derenderEnemyListener = () ->
      socket.on 'derenderEnemy', (data) ->
        console.log 'time to derender', data.enemy
        game.trigger 'derender enemy', data

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
        user: game.user
        mapId: game.mapId
        x: x
        y: y

    game.join = (data) ->

      x = data.x
      y = data.y
      enemies = data.enemies
      positions = data.positions


      socket.emit 'join',
        user: game.user
        mapId: game.mapId
        x: x
        y: y
        enemies: enemies
        positions: positions

      _joinListener game.user


    game.leave = () ->
      socket.emit 'leave', 
        user: game.user
        mapId: game.mapId


    game.message = (message) ->
      socket.emit 'message',
        user: game.user
        message: message
        # room: game.mapId

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
        console.log data
        if data.user != game.user
          game.trigger('player joined', data)
        else
          game.trigger('i joined', data)

  
    _moveListener = (user) ->
      socket.on 'move', (data) ->
        if data.user != game.user
          game.trigger('move', data)



    # Initialize message module
    messages(game, socket, $)

    _enemyListener = () ->
      socket.on 'move enemies', (data) ->
        game.trigger 'move enemies', data

    _leaveListener mapId, game.user
    _moveListener game.user
    _shootListener game.user
    do _enemyListener
    do _derenderEnemyListener

    # actions = events(actions)
    # window.actions = actions
    # actions
  )