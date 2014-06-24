'use strict'

app.controller 'GameCtrl', ['$scope', 'User', 'Auth', 'Hero', 'Enemy', 'Player', 'Events', 'Socket',
 ($scope, User, Auth, Hero, Enemy, Player, Events, Socket) ->
  $scope.currentUser = window.userData

  $scope.chats = []

  $scope.sendChat = ->
    $scope.chats.unshift(
      user: $scope.currentUser.name
      message: $scope.chatToSend
    )
    $scope.chatToSend = ''
    do $scope.chats.pop while $scope.chats.length > 100


  app = Events({})
  window.game = game = null
  hero = null
  map = null
  players = events({})
  mapId = null
  initialMap = null
  upScreen = null
  rightScreen = null
  downScreen = null
  leftScreen = null
  png = null
  rootUrl = ''
  user = window.userData.name
  initPos = {}
  explosions = null
  
  # MAKE INITIAL AJAX CALL FOR PLAYER INFO
  initialize = ->
    $.ajax({
      url: "/api/player/me"
    }).done (playerInfo) ->
      mapId = playerInfo.mapId
      initPos.x = playerInfo.x
      initPos.y = playerInfo.y

      png = playerInfo.png || 'roshan'
      $('#map-id').attr('href', '/edit/' + mapId);
      url = "/screen/#{mapId}"
      $.ajax({
        url: url
      }).done (mapData) ->
        initialMap = mapData
        # $('.creatables')
        game = new Phaser.Game(800, 600, Phaser.AUTO, "game-canvas",
          preload: preload
          create: create
          update: update
        )
        game.rootUrl = rootUrl
        game.enemies = []
        game = Events(game)
        game.realWidth = 20 * 64
        game.realHeight = 12 * 64


  preload = ->

    game.load.atlasXML "enemy", "images/enemy.png", "images/enemy.xml"
    hero = Events(Hero(game, Phaser, {
      exp: 150
      health: 100
      mana: 100
      str: 10
      dex: 10
      int: 10
      luk: 10
      x: initPos.x
      y: initPos.y
      png: png
    }, $))
    # window.hero = hero
    map = Events(Map(game, Phaser, mapId, $))
    game.user = user
    game.map = map
    Socket rootUrl, game, players, $, Phaser
    game.load.spritesheet 'kaboom', 'images/explosion.png', 64, 64, 23
    hero.preload()
    map.preload(null, initialMap)

    app.trigger 'create'
    app.isLoaded = true

    window.game = game
    game.hero = hero

  create = ->
    map.create()
    hero.create()
    game.hero = hero
    createExplosions()
    render()

    map.on 'finishLoad', =>
      hero.arrows.destroy()
      hero.createArrows()
      createExplosions()
      app.isLoaded = true
      render()



    console.log "Joining #{game.mapId} on #{hero.sprite.x},#{hero.sprite.y}"

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

  render = ->
    game.layerRendering = game.add.group()
    game.layerRendering.add(map.layers[0])
    game.layerRendering.add(map.layers[1])
    game.layerRendering.add(map.layers[2])
    game.layerRendering.add(hero.sprite)
    game.layerRendering.add(hero.arrows)
    game.layerRendering.add(explosions)
    game.layerRendering.add(map.layers[3])
    hero.sprite.bringToTop();

  update = ->
    if app.isLoaded
      map.update()
      hero.update()
      for enemy in game.enemies
        if enemy.alive
          hero.sprite.facing = hero.facing
          game.physics.arcade.collide(hero.sprite, enemy.sprite, hurtHero, null, hero)
          game.physics.arcade.collide(hero.arrows, hero.sprite, arrowHurt, null, hero)
          # game.physics.arcade.collide(hero.arrows, player.sprite, arrowHurt, null, player)
          game.physics.arcade.collide(hero.arrows, enemy.sprite, arrowHurt, null, enemy)

          enemy.update()
      for player of players
        if player.update then do player.update

  hurtHero = (heroSprite, enemySprite) ->
    @damage()

  arrowHurt = (sprite, arrow) ->
    explosion.call(@)
    @damage()
    arrow.kill()

  createExplosions = ->
    explosions = game.add.group()

    for i in [0...10]
      explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false)
      explosionAnimation.anchor.setTo(0.5, 0.5)
      explosionAnimation.animations.add('kaboom')

  explosion = ->
    explosionAnimation = explosions.getFirstExists(false)
    explosionAnimation.reset(@sprite.x, @sprite.y)
    explosionAnimation.play('kaboom', 30, false, true)

  do initialize


]
