#/*global require*/
'use strict'

require.config
  shim: 
    'socketio':
      exports: 'io'
    'phaser':
      exports: 'Phaser'
  paths:
    jquery: '../../bower_components/jquery/dist/jquery'
    backbone: '../../bower_components/backbone/backbone'
    underscore: '../../bower_components/underscore/underscore'
    socketio: '../../bower_components/socket.io-client/socket.io'
    phaser: '../../bower_components/phaser/phaser'
    hero: 'entity/hero'
    enemy: 'entity/enemy'
    map: 'map/map'
    events: 'utils/events'
    socket: 'utils/socket'
    player: 'entity/player'
    messages: 'utils/messages'

require [
  'hero'
  'map'
  'enemy'
  'events'
  'socket'
  'phaser'
  'player'
  'jquery'
], (Hero, Map, Enemy, events, socket, Phaser, Player, $) ->
  app = events({})
  window.game = game = null
  hero = null
  map = null
  # game.enemies = []
  players = {}
  mapId = null
  initialMap = null
  upScreen = null
  rightScreen = null
  downScreen = null
  leftScreen = null
  png = null
  rootUrl = ''
  # rootUrl = 'http://localhost:9000'
  user = window.userData.name
  init = {}
  explosions = null
  # actions = {}

  preload = ->

    game.load.atlasXML "enemy", "images/enemy.png", "images/enemy.xml"
    hero = events new Hero(game, Phaser, 
      health: 100
      mana: 100
      # str: 10
      # dex: 10
      # int: 10
      # luk: 10
      x: init.pos.x
      y: init.pos.y
      png: init.png
      speed: init.speed
    , $)
    map = events new Map(game, Phaser, mapId, $)
    game.user = user
    game.map = map
    socket rootUrl, game, players, $, Phaser
    game.load.spritesheet 'kaboom', 'images/explosion.png', 64, 64, 23
    do hero.preload
    map.preload null, initialMap

    app.trigger 'create'
    app.isLoaded = true

    window.game = game
    game.hero = hero

  create = ->
    map.create()
    hero.create()
    game.hero = hero
    createExplosions()
    map.on 'finishLoad', =>
      hero.arrows.destroy()
      hero.createArrows()
      createExplosions()
      app.isLoaded = true
      game.layerRendering = game.add.group()
      game.layerRendering.add(map.layers[0])
      game.layerRendering.add(map.layers[1])
      game.layerRendering.add(map.layers[2])
      game.layerRendering.add(hero.sprite)
      game.layerRendering.add(hero.arrows)
      game.layerRendering.add(explosions)
      game.layerRendering.add(map.layers[3])

    game.layerRendering = game.add.group()
    game.layerRendering.add(map.layers[0])
    game.layerRendering.add(map.layers[1])
    game.layerRendering.add(map.layers[2])
    game.layerRendering.add(hero.sprite)
    game.layerRendering.add(hero.arrows)
    game.layerRendering.add(explosions)
    game.layerRendering.add(map.layers[3])

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

    game.trigger 'login'

  update = ->
    if app.isLoaded
      map.update()
      hero.update()
      for enemy in game.enemies
        if enemy.alive
          hero.sprite.facing = hero.facing
          game.physics.arcade.collide(hero.sprite, enemy.sprite, hurtHero, null, hero)
          game.physics.arcade.collide(hero.arrows, hero.sprite, arrowHurt, null, hero)
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
    if explosionAnimation
      explosionAnimation.reset(@sprite.x, @sprite.y)
      explosionAnimation.play('kaboom', 30, false, true)

  # MAKE INITIAL AJAX CALL FOR PLAYER INFO
  $.ajax({
    url: "#{rootUrl}/player/me"
  }).done (playerInfo) ->
    mapId = playerInfo.mapId

    init.pos = {}

    init.pos.x = playerInfo.x
    init.pos.y = playerInfo.y

    init.xp = playerInfo.xp
    init.speed = playerInfo.speed
    # init.

    png = playerInfo.png || 'roshan'
    $('#map-id').attr('href', '/edit/' + mapId);
    url = "#{rootUrl}/screen/#{mapId}"
    $.ajax({
      url: url
    }).done (mapData) ->
      initialMap = mapData
    
      $('.creatables')

      game = new Phaser.Game(800, 600, Phaser.AUTO, "game-canvas",
        preload: preload
        create: create
        update: update
      )
      game.rootUrl = rootUrl
      game.enemies = []
      game = events(game)
      game.realWidth = 20 * 64
      game.realHeight = 12 * 64


