app.service 'Enemy', ->
  Enemy = {}

  return (index, game, phaser, meta) ->
    Enemy.index = index
    Enemy.game = game
    Enemy.phaser = phaser
    Enemy.meta = meta

    Enemy.sprite = null
    Enemy.direction = null
    Enemy.speed = Enemy.meta.speed
    Enemy.margin = 50

    Enemy.x = Enemy.meta.x
    Enemy.y = Enemy.meta.y

    Enemy.health = Enemy.meta.health
    Enemy.alive = true
    Enemy.png = Enemy.meta.png
    Enemy.serverId = Enemy.meta.id

    Enemy.setDirection = (num) ->
      Enemy.direction = num

    Enemy.clearDirection = ->
      Enemy.direction = null

    Enemy.derender = ->
      do Enemy.sprite.kill

    Enemy.damage = ->
      Enemy.health--
      if Enemy.health <= 0
        Enemy.game.killEnemy
        
    return true

    Enemy.preload = ->
      Enemy.game.load.atlasXML "enemy", "images/enemy.png", "images/enemy.xml"

    Enemy.create = ->
      Enemy.sprite = Enemy.game.add.sprite(Enemy.x, Enemy.y, "enemy")
      Enemy.game.physics.enable(Enemy.sprite, Enemy.phaser.Physics.ARCADE)
      Enemy.sprite.body.immovable = true
      Enemy.sprite.body.collideWorldBounds = true
      Enemy.sprite.anchor.setTo(.3, .5)
      Enemy.sprite.body.bounce.set(1)
      Enemy.sprite.body.width = 100
      Enemy.sprite.body.height = 100
      Enemy.sprite.animations.add("down", Phaser.Animation.generateFrameNames('enemy_move_down', 0, 10, '.png', 4), 30, false)
      Enemy.sprite.animations.add("left", Phaser.Animation.generateFrameNames('enemy_move_left', 0, 10, '.png', 4), 30, false)
      Enemy.sprite.animations.add("right", Phaser.Animation.generateFrameNames('enemy_move_right', 0, 10, '.png', 4), 30, false)
      Enemy.sprite.animations.add("up", Phaser.Animation.generateFrameNames('enemy_move_up', 0, 10, '.png', 4), 30, false)

    Enemy.update = ->
      Enemy.sprite.body.velocity.x = 0
      Enemy.sprite.body.velocity.y = 0

      if Enemy.direction is 0 and Enemy.sprite.y > Enemy.margin
        Enemy.sprite.body.velocity.y = -Enemy.speed 
        Enemy.sprite.animations.play 'up', 5, false
      else if Enemy.direction is 1 and Enemy.sprite.y < Enemy.game.realHeight - Enemy.margin
        Enemy.sprite.body.velocity.y = Enemy.speed
        Enemy.sprite.animations.play 'down', 5, false
      else if Enemy.direction is 2 and Enemy.sprite.x > Enemy.margin
        Enemy.sprite.body.velocity.x = -Enemy.speed
        Enemy.sprite.animations.play 'left', 5, false
      else if Enemy.direction is 3 and Enemy.sprite.x < Enemy.game.realWidth - Enemy.margin
        Enemy.sprite.body.velocity.x = Enemy.speed
        Enemy.sprite.animations.play 'right', 5, false

    return Enemy

# class Enemy
#   constructor: (Enemy.index, Enemy.game, Enemy.phaser, Enemy.meta) ->
#     Enemy.sprite = null
#     Enemy.direction = null
#     Enemy.speed = @meta.speed
#     @margin = 50

#     @x = @meta.x
#     @y = @meta.y
    
#     @health = @meta.health
#     @alive = true
#     @png = @meta.png
#     @serverId = @meta.id

#     @setDirection = (num) ->
#       @direction = num

#     @clearDirection = () ->
#       @direction = null

#     @derender = () ->
#       do @sprite.kill

#   damage: ->
#     @health--
#     if @health <= 0
#       @game.killEnemy @ 
#       # @alive = false
#       # @sprite.kill()

#     return true

#   preload: ->
#     @game.load.atlasXML "enemy", "images/enemy.png", "images/enemy.xml"

#   create: () ->
#     @sprite = @game.add.sprite(@x, @y, "enemy")
#     @game.physics.enable(@sprite, @phaser.Physics.ARCADE)
#     @sprite.body.immovable = true
#     @sprite.body.collideWorldBounds = true
#     @sprite.anchor.setTo(.3, .5)
#     @sprite.body.bounce.set(1)
#     @sprite.body.width = 100
#     @sprite.body.height = 100
#     @sprite.animations.add("down", Phaser.Animation.generateFrameNames('enemy_move_down', 0, 10, '.png', 4), 30, false)
#     @sprite.animations.add("left", Phaser.Animation.generateFrameNames('enemy_move_left', 0, 10, '.png', 4), 30, false)
#     @sprite.animations.add("right", Phaser.Animation.generateFrameNames('enemy_move_right', 0, 10, '.png', 4), 30, false)
#     @sprite.animations.add("up", Phaser.Animation.generateFrameNames('enemy_move_up', 0, 10, '.png', 4), 30, false)

#   update: ->
#     @sprite.body.velocity.x = 0
#     @sprite.body.velocity.y = 0

#     if @direction is 0 and @sprite.y > @margin
#       @sprite.body.velocity.y = -@speed 
#       @sprite.animations.play 'up', 5, false
#     else if @direction is 1 and @sprite.y < @game.realHeight - @margin
#       @sprite.body.velocity.y = @speed
#       @sprite.animations.play 'down', 5, false
#     else if @direction is 2 and @sprite.x > @margin
#       @sprite.body.velocity.x = -@speed
#       @sprite.animations.play 'left', 5, false
#     else if @direction is 3 and @sprite.x < @game.realWidth - @margin
#       @sprite.body.velocity.x = @speed
#       @sprite.animations.play 'right', 5, false
