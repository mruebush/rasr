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
    fx: 'entity/fx/fx'

require [
  'hero'
  'map'
  'enemy'
  'events'
  'socket'
  'phaser'
], (Hero, Map, Enemy, events, socket, Phaser) ->
  app = events({})
  game = null
  hero = null
  map = null
  enemies = []
  mapId = null
  initialMap = null
  upScreen = null
  rightScreen = null
  downScreen = null
  leftScreen = null
  rootUrl = 'http://g4m3.azurewebsites.net'
  user = 'test'

  preload = ->
    hero = events(new Hero(game, Phaser, {
      exp: 150
      health: 100
      mana: 100
      str: 10
      dex: 10
      int: 10
      luk: 10
      }))
    map = events(new Map(game, Phaser, mapId))
    game.physics.arcade.checkCollision.up = false
    game.physics.arcade.checkCollision.right = false
    game.physics.arcade.checkCollision.down = false
    game.physics.arcade.checkCollision.left = false
    map.on('borderChange', (border, exists) ->
      game.physics.arcade.checkCollision[border.split('Screen')[0]] = !exists
    )
    # tell hero that he can move over non-blocked borders
    hero.preload(null, initialMap)
    map.preload()
    app.trigger 'create'
    app.isLoaded = true
    createEnemies(4)

  create = ->
    map.create()
    hero.create()
    map.on('finishLoad', ->
      hero.sprite.bringToTop()
      for enemy in enemies
        enemy.sprite.bringToTop()
      app.isLoaded = true
    )
    hero.on('changeMap', (direction) ->
      app.isLoaded = false
      map.reload(direction, hero)
      createEnemies(4)
    )
    for enemy, index in enemies
      enemy.create()

  update = ->
    if app.isLoaded
      map.update()
      hero.update()
      for enemy in enemies
        if enemy.alive
          game.physics.arcade.collide(hero.sprite, enemy.sprite, collisionHandler, null, enemy)
          enemy.update()

  collisionHandler = (heroSprite, enemySprite) ->
    # kill enemy
    console.log('kill enemy', @)
    @damage()

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
  $.ajax({
    url: "#{rootUrl}/player/#{user}"
  }).done((playerInfo) ->
    mapId = playerInfo.mapId
    actions = socket rootUrl
    actions.join mapId, user
    game = new Phaser.Game(800, 600, Phaser.AUTO, "",
      preload: preload
      create: create
      update: update
    )
  )

