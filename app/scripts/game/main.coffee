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
  actions = {}


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
    window.hero = hero
    map = events(new Map(game, Phaser, mapId))
    hero.actions = actions
    hero.user = user
    # tell hero that he can move over non-blocked borders
    hero.preload()
    hero.set 'mapId', mapId
    map.preload(null, initialMap)
    app.trigger 'create'
    app.isLoaded = true
    createEnemies(4)

    players.on 'player leave', (user) ->
      console.log "#{user} left the screen"
      players[user].sprite.kill()
      delete players[user]

    players.on 'join', (data) ->
      player = new Player(game, Phaser, 
        x: data.x
        y: data.y
      )
      player.user = data.user
      do player.preload
      player = events(player)
      player.on 'move', (data) ->
        player.move(data)
      players.trigger 'create', player

    hero.actions.on 'others', (data) ->
      for other, index in data.others
        console.log "#{other.user} joined the map on #{other.x},#{other.y}"
        players.trigger 'join',
          user: other.user
          x: other.x
          y: other.y

  create = ->
    map.create()
    hero.create()

    hero.actions.on 'shoot', (data) ->
      hero.renderMissiles data.x, data.y, data.angle, data.num 

    hero.actions.on 'player leave', (user) ->
      players.trigger 'player leave', user

    hero.on 'changeMap', (direction) ->
      # app.isLoaded = flse
      console.log "Leave #{hero.mapId}"
      # hero.moveEnabled = false
      hero.actions.leave hero.mapId, user
      console.log 'Left map'
      map.reload(direction, hero)
      createEnemies(4)
    
    players.on 'create', (player) ->
      player.create()
      players[player.user] = player
    

    hero.actions.on 'join', (data) ->
      console.log "#{data.user} joined the map ON #{data.x},#{data.y} !"
      players.trigger('join', data)

    
    hero.actions.on 'move', (data) ->
      players[data.user].trigger('move', data) 
    
    map.on 'finishLoad', ->
      hero.sprite.bringToTop()
      hero.arrows.forEach (arrow) ->
        arrow.bringToTop()
      for enemy in enemies
        enemy.sprite.bringToTop()
      app.isLoaded = true
    
    for enemy, index in enemies
      enemy.create()

    hero.actions.join mapId, user, initPos

  update = ->
    if app.isLoaded
      map.update()
      hero.update()
      for enemy in enemies
        if enemy.alive
          game.physics.arcade.collide(hero.sprite, enemy.sprite, hurtHero, null, hero)
          game.physics.arcade.collide(hero.arrows, enemy.sprite, arrowEnemy, null, enemy)
          enemy.update()
      for player of players
        if player.update then do player.update

  hurtHero = (enemySprite, heroSprite) ->
    @damage()

  arrowEnemy = (enemySprite, arrow) ->
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
  $.ajax({
    url: "#{rootUrl}/player/#{user}"
  }).done (playerInfo) ->
    mapId = playerInfo.mapId
    initPos.x = playerInfo.x
    initPos.y = playerInfo.y
    actions = socket rootUrl, events
    png = playerInfo.png || 'roshan'
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

