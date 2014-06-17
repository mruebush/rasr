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
  rootUrl = 'http:localhost:9000'
  user = "test"

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
    map = new Map(game, Phaser, mapId)
    map = events(map)
    hero.preload(null, initialMap)
    map.preload('screen', initialMap)
    app.trigger 'create'
    app.isLoaded = true
    for i in [0...14]
      enemy = new Enemy(i, game, Phaser, {
        rank: 1
        health: 10
        dmg: 1
      })
      enemies.push enemy
      enemy.preload()

  create = ->
    map.create()
    hero.create()
    hero.on('changeMap', (direction) ->
      map.reload(direction, hero)
    )
    map.on('finishLoad', ->
      hero.sprite.bringToTop()
    )
    for enemy in enemies
      enemy.create()

  update = ->
    if app.isLoaded
      map.update()
      hero.update()
      for enemy in enemies
        # if(game.physics.rectangle.intersects(hero.sprite, enemy.sprite))
          # hero.takeDmg(enemy.meta.dmg)
        game.physics.arcade.overlap(hero.sprite, enemy.sprite, hero.takeDmg, null, hero)
        # game.physics.arcade.collide(hero.sprite, enemy.sprite)
        enemy.update()

  takeDmg = ->
    console.log('taking dmg')

  collisionHandler = ->
    console.log('hit')

  $.ajax({
    url: "/player/#{user}"
    error: (err)->
      console.log "err: #{err}"
  }).done((playerInfo) ->
    console.log('got player information')
    mapId = playerInfo.mapId
    actions = socket rootUrl
    actions.join mapId, user
    url = "/screen/#{mapId}"
    $.ajax({
      url: url
    }).done((mapData) ->
      initialMap = mapData
      game = new Phaser.Game(800, 600, Phaser.AUTO, "",
        preload: preload
        create: create
        update: update
      )
    )
  )
