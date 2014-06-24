app.service 'Enemy', ->
  return (@index, @game, @phaser, @meta) ->
    @sprite = null
    @direction = null
    @speed = @meta.speed
    @margin = 50

    @x = @meta.x
    @y = @meta.y

    @health = @meta.health
    @alive = true
    @png = @meta.png
    @serverId = @meta.id

    @setDirection = (num) ->
      @direction = num

    @clearDirection = ->
      @direction = null

    @derender = ->
      do @sprite.kill

    @damage = ->
      @health--
      if @health <= 0
        @game.killEnemy
        
    return true

    @preload = ->
      @game.load.atlasXML "enemy", "images/enemy.png", "images/enemy.xml"

    @create = ->
      @sprite = @game.add.sprite(@x, @y, "enemy")
      @game.physics.enable(@sprite, @phaser.Physics.ARCADE)
      @sprite.body.immovable = true
      @sprite.body.collideWorldBounds = true
      @sprite.anchor.setTo(.3, .5)
      @sprite.body.bounce.set(1)
      @sprite.body.width = 100
      @sprite.body.height = 100
      @sprite.animations.add("down", Phaser.Animation.generateFrameNames('enemy_move_down', 0, 10, '.png', 4), 30, false)
      @sprite.animations.add("left", Phaser.Animation.generateFrameNames('enemy_move_left', 0, 10, '.png', 4), 30, false)
      @sprite.animations.add("right", Phaser.Animation.generateFrameNames('enemy_move_right', 0, 10, '.png', 4), 30, false)
      @sprite.animations.add("up", Phaser.Animation.generateFrameNames('enemy_move_up', 0, 10, '.png', 4), 30, false)

    @update = ->
      @sprite.body.velocity.x = 0
      @sprite.body.velocity.y = 0

      if @direction is 0 and @sprite.y > @margin
        @sprite.body.velocity.y = -@speed 
        @sprite.animations.play 'up', 5, false
      else if @direction is 1 and @sprite.y < @game.realHeight - @margin
        @sprite.body.velocity.y = @speed
        @sprite.animations.play 'down', 5, false
      else if @direction is 2 and @sprite.x > @margin
        @sprite.body.velocity.x = -@speed
        @sprite.animations.play 'left', 5, false
      else if @direction is 3 and @sprite.x < @game.realWidth - @margin
        @sprite.body.velocity.x = @speed
        @sprite.animations.play 'right', 5, false



# class Enemy
#   constructor: (@index, @game, @phaser, @meta) ->
#     @sprite = null
#     @direction = null
#     @speed = @meta.speed
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
