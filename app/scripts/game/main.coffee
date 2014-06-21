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

require [
  'hero'
  'map'
  'enemy'
  'events'
  'socket'
  'phaser'
  'player'
], (Hero, Map, Enemy, events, socket, Phaser, Player) ->
  app = events({})
  window.game = game = null
  hero = null
  map = null
  # game.enemies = []
  players = events({})
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
  console.log(user);
  # user = prompt 'Fullen Sie das user bitte !'
  initPos = {}
  # actions = {}

  preload = ->
    load = new Enemy 10, game, Phaser,
      rank: 1
      health: 10
      dmg: 1
      png: 'leviathan.png'
      speed: 200

    do load.preload
    
    hero = events(new Hero(game, Phaser, {
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
      }))
    map = events(new Map(game, Phaser, mapId))
    game.user = user
    game.map = map
    socket rootUrl, game, players

    game.load.spritesheet "enemy", "images/leviathan.png", 96, 96
    
    console.log initialMap
    hero.preload()

    map.preload(null, initialMap)

    app.trigger 'create'
    app.isLoaded = true

    window.game = game
    game.hero = hero

  create = ->
    map.create()
    hero.create()
    @game.hero = hero;
    map.on 'finishLoad', =>
      hero.arrows.destroy()
      hero.createArrows()
      app.isLoaded = true
      @game.layerRendering = @game.add.group()
      @game.layerRendering.add(map.layers[0])
      @game.layerRendering.add(map.layers[1])
      @game.layerRendering.add(map.layers[2])
      @game.layerRendering.add(hero.sprite)
      @game.layerRendering.add(hero.arrows)
      @game.layerRendering.add(map.layers[3])

    @game.layerRendering = @game.add.group()
    @game.layerRendering.add(map.layers[0])
    @game.layerRendering.add(map.layers[1])
    @game.layerRendering.add(map.layers[2])
    @game.layerRendering.add(hero.sprite)
    @game.layerRendering.add(hero.arrows)
    @game.layerRendering.add(map.layers[3])

    console.log "Joining #{@game.mapId} on #{hero.sprite.x},#{hero.sprite.y}"

    enemies = []
    enemyPositions = {}

    for enemyId of initialMap.enemies
      enemies.push 
        id: enemyId
        count: initialMap.enemies[enemyId].count
      enemyPositions[enemyId] = initialMap.enemies[enemyId].positions

    game.enemyPositions = enemyPositions
    # console.log enemyPositions


    @game.camera.follow(hero.sprite);

    @game.join   
      x: hero.sprite.x
      y: hero.sprite.y
      enemies: enemies
      positions: enemyPositions
      


  update = ->
    if app.isLoaded
      map.update()
      hero.update()
      for enemy in game.enemies
        if enemy.alive
          game.physics.arcade.collide(hero.sprite, enemy.sprite, hurtHero, null, hero)
          game.physics.arcade.collide(hero.arrows, enemy.sprite, arrowEnemy, null, enemy)
          enemy.update()
      for player of players
        if player.update then do player.update
      # map.on 'finishLoad', ->
      #   if @game.changingScreen
      #     @game.layerRendering = @game.add.group()
      #     @game.layerRendering.add(map.layers[0])
      #     @game.layerRendering.add(map.layers[1])
      #     @game.layerRendering.add(map.layers[2])
      #     @game.layerRendering.add(hero.sprite)
      #     @game.layerRendering.add(hero.arrows)
      #     @game.layerRendering.add(map.layers[3])
      #     @game.changingScreen = false

  hurtHero = (enemySprite, heroSprite) ->
    @damage()

  arrowEnemy = (enemySprite, arrow) ->
    # kill enemy
    @damage()
    arrow.kill()

  # MAKE INITIAL AJAX CALL FOR PLAYER INFO
  console.log "Making request for #{user}"
  $.ajax({
    url: "#{rootUrl}/player/me"
  }).done (playerInfo) ->
    console.log(playerInfo, 'playerInfo')
    mapId = playerInfo.mapId

    initPos.x = playerInfo.x
    initPos.y = playerInfo.y

    png = playerInfo.png || 'roshan'
    $('#map-id').attr('href', '/edit/' + mapId);
    url = "#{rootUrl}/screen/#{mapId}"
    console.log(url)
    $.ajax({
      url: url
    }).done (mapData) ->
      initialMap = mapData
    
      $('.creatables')

      game = new Phaser.Game(800, 600, Phaser.AUTO, "game-container",
        preload: preload
        create: create
        update: update
      )
      game.rootUrl = rootUrl
      game.enemies = []
      game = events(game)
      game.realWidth = 20 * 64
      game.realHeight = 12 * 64

