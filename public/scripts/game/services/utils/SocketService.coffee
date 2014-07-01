app.factory 'Socket', (Player, Enemy, Messages, SERVER_URL) ->
  return (rootUrl, game, players, Phaser, $scope) ->
    socket = io.connect(SERVER_URL, 
      'sync disconnect on unload': true
    )

    window.socket = game.socket = socket
    window.players = game.players

    mapId = game.mapId

    game.on 'login', () ->
      socket.emit 'login', game.user
      $('.top').tooltip({
        trigger: 'hover'
        })
      $('.dropdown-toggle').dropdown()

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

    game.on 'changeMap', (direction) ->
      game.leave game.mapId, game.user
      socket.removeListener game.mapId
      for key,player of game.players
        do player.sprite.kill

      game.players = {}

    _gameOverListener = () ->
      socket.on 'gameOver', (data) ->
        game.trigger 'player leave', data.user

    game.enemyMoving = (data) ->
      data.room = game.mapId
      socket.emit 'enemyMoving', data

    game.on 'addXP', (data) ->
      game.hero.addXP data

    _addXPListener = () ->
      socket.on 'addXP', (data) ->
        if data.user.username is game.user
          game.trigger 'addXP', data

    game.derenderEnemy = (data) ->
      do game.enemies[data.enemy].derender if game.enemies[data.enemy]

    _derenderEnemyListener = () ->
      socket.on 'derender enemy', (data) ->
        game.derenderEnemy data


    createEnemy = (creature) ->
      enemy = new Enemy game, Phaser,
        rank: 1
        health: creature.health
        dmg: 1
        png: creature.png
        speed: creature.speed
        x: +creature.position[0]
        y: +creature.position[1]
        id: creature.enemyId
        dbId: creature._id
        name: creature.name
        xp: creature.xp

      do enemy.create
      return enemy

    game.reviveEnemy = (data) ->
      console.log('enemy revived!');
      game.enemies[data.enemyId] = createEnemy data

    _enemyReviveListener = ->
      socket.on 'revive enemy', (data) ->
        game.reviveEnemy data


    game.damageEnemy = (enemy) ->
      socket.emit 'damageEnemy', 
        enemy: enemy.serverId
        room: game.mapId
        _id: enemy.dbId
        user: game.user
        enemyName: enemy.name
        xp: enemy.xp

    _damageEnemyListener = () ->
      socket.on 'damageEnemy', (data) ->
        game.trigger 'damageEnemy', data

    game.on 'damageEnemy', (data) ->
      if game.enemies[data.serverId]
        game.enemies[data.serverId].health--

    game.stopEnemy = (enemy) ->
      socket.emit 'stopEnemy', 
        enemy: enemy.serverId
        room: game.mapId
        _id: enemy.dbId
        x: enemy.sprite.x
        y: enemy.sprite.y

    game.shoot = (user, mapId, x, y, angle, num, dir) ->
      socket.emit 'shoot',
        user: user
        mapId: mapId
        x: x
        y: y
        angle: angle
        num: num
        dir: dir

    _shootListener = (user) ->
      socket.on 'shoot', (data) ->
        if data.user != game.user
          game.trigger 'shoot', data

    game.on 'shoot', (data) ->
      game.hero.renderMissiles data.x, data.y, data.angle, data.num
      if game.players[data.user]
        game.players[data.user].animateShoot data.dir

    
    game.logout = () ->
      socket.emit 'logout',
        user: game.user
        mapId: game.mapId
        x: game.hero.sprite.x
        y: game.hero.sprite.y

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

    _joinListener = (user) ->
      socket.on game.mapId, (data) ->
        if data.user != game.user
          playerJoined data
        else
          heroJoined data

    playerJoined = (data) ->
      player = new Player(game, Phaser,
        x: data.x
        y: data.y
      )
      player.user = data.user
      do player.preload
      do player.create
      game.players[player.user] = player

    heroJoined = (data) ->
      for other in data.others
        player = new Player(game, Phaser,
          x: other.x
          y: other.y
        )
        player.user = other.user
        do player.preload
        do player.create
        game.players[player.user] = player

      for enemy in game.enemies
        if enemy then do enemy.derender

      data.enemies = data.enemies || []
      game.enemies = []

      for enemyType of data.enemies
        type = data.enemies[enemyType]
        for index, creature of type
          creature.enemyId = index
          game.enemies[index] = createEnemy(creature)

    game.leave = () ->
      socket.emit 'leave', 
        user: game.user
        mapId: game.mapId

    _leaveListener = (mapId, user) ->
      socket.on 'leave', (data) ->

        if data.user != game.user
          game.trigger 'player leave', data.user

    game.on 'player leave', (user) ->
      if game.players[user]
        do game.players[user].sprite.kill
        delete game.players[user]
      # else
      #   do game.hero.sprite.kill

    game.message = (message) ->
      socket.emit 'message',
        user: game.user
        message: message
        # room: game.mapId

    game.on 'move', (data) ->
      if game.players[data.user]
        # console.log "#{data.user} moved to #{data.x},#{data.y}"
        game.players[data.user].move data

    game.move = (data) ->
      socket.emit 'move',
        dir: data.dir
        user: game.user
        room: game.mapId
        x: data.x
        y: data.y

    _moveListener = (user) ->
      socket.on 'move', (data) ->
        if data.user != game.user
          game.trigger('move', data)

    _messageListener = ->
      socket.on 'message', (data) ->
        game.addChat(data)


    _enemyListener = ->
      socket.on 'move enemies', (data) ->
        game.trigger 'move enemies', data

    _enemyMovingListener = ->
      socket.on 'enemyMoving', (data) ->
        game.trigger 'enemyMoving', data

    game.on 'enemyMoving', (data) ->
      enemy = game.enemies[data.serverId]
      enemy.setDirection data.dir if enemy

    game.on 'move enemies', (data) ->
      nums = data.nums

      for enemy, i in game.enemies
        if enemy and enemy.alive
          enemy.setDirection nums[i].dir
          if nums[i].passive
            do enemy.clearDirection

    _leaveListener mapId, game.user
    _moveListener game.user
    _shootListener game.user
    do _damageEnemyListener
    do _enemyListener
    do _messageListener
    do _derenderEnemyListener
    do _addXPListener
    do _enemyMovingListener
    do _gameOverListener
    do _enemyReviveListener

    # actions = events(actions)
    # window.actions = actions
    # actions
