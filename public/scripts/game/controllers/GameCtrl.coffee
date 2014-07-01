'use strict'

app.controller 'GameCtrl', ['$scope', '$window', '$state', '$stateParams', '$location', 'User', 'Auth', 'Map', 'Hero', 'Enemy', 'Player', 'Events', 'Socket', 'PlayerAPI', 'MapAPI', 'SERVER_URL'
 ($scope, $window, $state, $stateParams, $location, User, Auth, Map, Hero, Enemy, Player, Events, Socket, PlayerAPI, MapAPI, SERVER_URL) ->
  $scope.currentUser = $window.userData;
  $scope.chats = []
  $scope.sendChat = ->
    $scope.glued = true
    chat = 
      user: $scope.currentUser.name
      message: $scope.chatToSend
    game.message chat

  $scope.borders = 
    up: true
    right: true
    down: true
    left: true

  $scope.glued = true

  $scope.editMap = () ->
    game.logout()
    $location.path("/edit/#{game.mapId}")

  $scope.makeMap = (direction) ->
    $scope.borders[direction] = true
    map.game.physics.arcade.checkCollision[direction] = false
    MapAPI.makeMap().get({direction: direction, mapId: map.mapId})

  $scope.restart = ->
    game.hero.died = false
    $scope.gameOver = false
    game.hero.meta.health = 101
    do game.hero.damage
    game.hero.xp = Math.floor(game.hero.xp * 0.2)
    game.hero.toGo = Math.round(100*game.hero.xp / game.hero.xpToGo)
    initPos = 95
    offset = 28
    y = 13
    for i in [0...5]
      game.hearts.add(game.add.sprite(initPos + offset*i, y, 'heart'))
    game.trigger 'login'

  app = Events({})
  window.game = $scope.game = game = null
  hero = null
  map = null
  # game.players = {}
  mapId = null
  initialMap = null
  upScreen = null
  rightScreen = null
  downScreen = null
  leftScreen = null
  png = null
  rootUrl = ''
  user = $scope.currentUser.name
  explosions = null
  collisionsDebug = false
  
  # MAKE INITIAL AJAX CALL FOR PLAYER INFO
  initialize = ->
    PlayerAPI.get (playerInfo) ->
      mapId = playerInfo.mapId
      $scope.mapId = mapId

      MapAPI.getMap().get {mapId: mapId}, (mapData) ->
        initialMap = mapData
        $scope.mapId = mapData._id
        canvasWidth = $('#game-canvas').width()
        $scope.game = game = new Phaser.Game(canvasWidth, 600, Phaser.CANVAS, "game-canvas",
          preload: preload
          create: create
          update: update
          # render: render
        )
        game.players = {}
        $scope.hero = hero = Events(Hero(game, Phaser, playerInfo))
        game.rootUrl = rootUrl
        game.enemies = []
        game = Events(game)
        game.realWidth = 20 * 64
        game.realHeight = 12 * 64

  render = ->
    if collisionsDebug
      game.debug.body(hero.sprite)
      for enemy in game.enemies
        if enemy.alive
          game.debug.body(enemy.sprite)

  preload = ->
    game.load.atlasXML "enemy", "assets/enemy.png", "assets/enemy.xml"
    $scope.map = map = Events(Map(game, Phaser, mapId))
    game.user = user
    map.on 'finishLoad', ->
      hero.arrow.arrows.destroy()
      hero.createArrows()
      createExplosions()
      app.isLoaded = true
      renderMap()
    Socket SERVER_URL, game, game.players, Phaser

    game.load.spritesheet 'kaboom', 'assets/explosion.png', 64, 64, 23
    game.load.image 'lifebar', 'assets/lifebar.png'
    game.load.image 'heart', 'assets/heart.png'

    hero.preload()
    map.preload(null, initialMap)

    app.trigger 'create'
    app.isLoaded = true

    window.game = game
    game.hero = hero
    game._createCtrls = _createCtrls
    game.addChat = addChat
    game.digest = digest
    game.gameOver = gameOver

  create = ->
    game.lifebar = game.add.sprite(0, 0, 'lifebar')
    game.lifebar.fixedToCamera = true
    game.lifebar.alpha = 0.8

    game.hearts = game.add.group()
    initPos = 95
    offset = 28
    y = 13
    for i in [0...5]
      game.hearts.add(game.add.sprite(initPos + offset*i, y, 'heart'))
    game.hearts.fixedToCamera = true
    game.hearts.alpha = 0.8

    hero.create()
    game.hero = hero
    game.hero
    game.hero.attachName(user)
    
    enemies = []
    enemyPositions = {}

    for enemyId of initialMap.enemies
      enemies.push 
        id: enemyId
        count: initialMap.enemies[enemyId].count
      enemyPositions[enemyId] = initialMap.enemies[enemyId].positions

    game.enemyPositions = enemyPositions

    game.camera.follow(hero.sprite);

    game.join
      x: hero.sprite.x
      y: hero.sprite.y
      enemies: enemies
      positions: enemyPositions

    game.trigger 'login'
    game.stage.disableVisibilityChange = true

  renderMap = ->
    game.layerRendering = game.add.group()
    game.layerRendering.add(map.layers[0])
    game.layerRendering.add(map.layers[1])
    game.layerRendering.add(map.layers[2])
    game.layerRendering.add(hero.sprite)
    game.layerRendering.add(hero.arrow.arrows)
    game.layerRendering.add(explosions)
    game.layerRendering.add(map.layers[3])
    game.layerRendering.add(game.lifebar)
    game.layerRendering.add(game.hearts)
    for layer in map.layers
      if layer.name == 'collision'
        map.collisionLayer = layer 
        map.collisionLayer.debug = collisionsDebug

  update = ->
    if app.isLoaded
      map.update()
      hero.update()
      game.physics.arcade.collide(hero.sprite, map.collisionLayer)
      game.physics.arcade.collide(hero.arrow.arrows, map.collisionLayer, tileCollision)
      game.physics.arcade.collide(hero.arrow.arrows, hero.sprite, arrowHurt, null, hero)
      for enemy in game.enemies
        if enemy and enemy.alive
          game.layerRendering.addAt(enemy.sprite, 4)

          hero.sprite.facing = hero.facing
          game.physics.arcade.collide(hero.sprite, enemy.sprite, hurtHero, null, hero)
          game.physics.arcade.collide(hero.arrow.arrows, enemy.sprite, arrowHurt, null, enemy)
          game.physics.arcade.collide(enemy.sprite, map.collisionLayer)
          enemy.update()
      for player of game.players
        game.physics.arcade.collide(hero.arrow.arrows, player.sprite, arrowHurt, null, player)
        if player.update then do player.update

  hurtHero = (heroSprite, enemySprite) ->
    @damage()

  tileCollision = (arrow, tile) ->
    arrow.kill()

  arrowHurt = (sprite, arrow) ->
    explosion.call(@)
    arrow.kill()
    do @damage if @damage

  createExplosions = ->
    explosions = game.add.group()

    for i in [0...10]
      explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false)
      explosionAnimation.anchor.setTo(0.5, 0.5)
      explosionAnimation.animations.add('kaboom')

  explosion = ->
    explosionAnimation = explosions.getFirstExists(false)
    if explosionAnimation
      explosionAnimation.reset(@sprite.x, @sprite.y)
      explosionAnimation.play('kaboom', 30, false, true)

  addChat = (chat) ->
    $scope.$apply ->
      $scope.chats.push chat
      $scope.chatToSend = ''
      do $scope.chats.shift while $scope.chats.length > 100
    $('.timestamp').last().attr('data-livestamp', moment(new Date()).unix())

  _createCtrls = (data) ->
    $scope.$apply ->
      $scope.borders = 
        up: !!data.upScreen
        right: !!data.rightScreen
        down: !!data.downScreen
        left: !!data.leftScreen
      for border, value of $scope.borders
        map.game.physics.arcade.checkCollision[border] = !value
      for dir, value of $scope.borders
        if value
          $scope[dir] = "chevron-#{dir}"
        else
          $scope[dir] = "plus"

  digest = ->
    do $scope.$apply

  gameOver = ->
    socket.emit 'gameOver',
      user: game.user
      room: game.mapId
    $scope.$apply ->
      $scope.gameOver = true;


  do initialize

]
