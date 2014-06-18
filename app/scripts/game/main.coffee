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
    # arrows: 'entity/arrows'
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
  game = null
  hero = null
  map = null
  enemies = []
  players = events({})
  mapId = null
  initialMap = null
  upScreen = null
  rightScreen = null
  downScreen = null
  leftScreen = null
  png = null
  rootUrl = 'http://g4m3.azurewebsites.net'
  # user = 'test'
  user = prompt 'Fullen Sie das user bitte !'
  initPos = {}
  # actions = {}


  preload = ->
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
    # window.hero = hero
    map = events(new Map(game, Phaser, mapId))
    game.physics.arcade.checkCollision.up = false
    game.physics.arcade.checkCollision.right = false
    game.physics.arcade.checkCollision.down = false
    game.physics.arcade.checkCollision.left = false
    map.on('borderChange', (border, exists) ->
      game.physics.arcade.checkCollision[border.split('Screen')[0]] = !exists
    )
    game.user = user
    game.map = map
    socket rootUrl, game, players
    
    # tell hero that he can move over non-blocked borders
    hero.preload(null, initialMap)
    # hero.set 'mapId', mapId
    # hero.mapId = mapId
    map.preload()
    app.trigger 'create'
    app.isLoaded = true
    createEnemies(4)

    window.game = game

  create = ->
    map.create()
    hero.create()

    map.on 'finishLoad', ->
      hero.sprite.bringToTop()
      hero.arrows.forEach (arrow) ->
        arrow.bringToTop()
      for enemy in enemies
        enemy.sprite.bringToTop()
      app.isLoaded = true
    
    for enemy, index in enemies
      enemy.create()


  update = ->
    if app.isLoaded
      map.update()
      hero.update()
      for enemy in enemies
        if enemy.alive
          # game.physics.arcade.collide(hero.sprite, enemy.sprite, collisionHandler, null, enemy)
          game.physics.arcade.collide(hero.arrows, enemy.sprite, collisionHandler, null, enemy)
          enemy.update()
      for player of players
        if player.update then do player.update

  collisionHandler = (enemySprite, arrow) ->
    # kill enemy
    console.log('kill enemy', @)
    @damage()
    arrow.kill()


  createEnemies = (num) ->
    # for enemy in enemies
    #   enemy.damage()
    enemies = []
    for i in [0...num]
      enemy = new Enemy(i, game, Phaser, {
        rank: 1
        health: 10
        dmg: 1
      })
      enemy.preload()
      enemy.create()
      enemies.push enemy

  # MAKE INITIAL AJAX CALL FOR PLAYER INFO
  console.log "Making request for #{user}"
  $.ajax({
    url: "#{rootUrl}/player/#{user}"
  }).done (playerInfo) ->
    console.log playerInfo
    mapId = playerInfo.mapId
    initPos.x = playerInfo.x
    initPos.y = playerInfo.y
    # actions = socket rootUrl, 
    png = playerInfo.png
    url = "#{rootUrl}/screen/#{mapId}"
    $.ajax({
      url: url
    }).done (mapData) ->
      initialMap = mapData
      # debugger
      game = new Phaser.Game(800, 600, Phaser.AUTO, "",
        preload: preload
        create: create
        update: update
      )
      game = events(game)

