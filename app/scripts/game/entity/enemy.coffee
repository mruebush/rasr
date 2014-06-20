define( ->

  class Enemy
    constructor: (@index, @game, @phaser, @meta) ->
      @sprite = null
      @direction = null
      @speed = @meta.speed
      @margin = 50
      @x = Math.min(Math.max(@game.world.randomX, @margin), @game.width - @margin)
      @y = Math.min(Math.max(@game.world.randomY, @margin), @game.height - @margin)
      @health = @meta.health
      @alive = true

      @derender = () ->
        do @sprite.kill
      # @png = @meta.png

    damage: ->
      @health--
      if @health <= 0
        @alive = false
        @sprite.kill()
      return true

    # derender: ->
    #   do @spirte.kill


    preload: ->
      @game.load.spritesheet "enemy", "images/leviathan.png", 96, 96

    create: () ->
      @sprite = @game.add.sprite(@x, @y, "enemy")
      @game.physics.enable(@sprite, @phaser.Physics.ARCADE)
      @sprite.body.immovable = true
      @sprite.body.collideWorldBounds = true
      @sprite.anchor.setTo(.3, .5)
      @sprite.body.bounce.set(1)
      @sprite.body.width = 100
      @sprite.body.height = 100
      # @sprite.body.allowCollision = true

      # @sprite.body.renderDebug(@sprite, @sprite)

      @sprite.animations.add "down", [0, 3], true
      @sprite.animations.add "left", [4, 7], true
      @sprite.animations.add "right", [8, 11], true
      @sprite.animations.add "up", [12, 15], true

      setInterval(=>
        @direction = Math.floor(Math.random() * 4)
        setTimeout(=>
          @direction = null
        , 500)
      , 2000)

    update: ->
      @sprite.body.velocity.x = 0
      @sprite.body.velocity.y = 0

      if @direction is 0 and @sprite.y > @margin
        @sprite.body.velocity.y = -@speed 
        @sprite.animations.play 'up', 5, false
      else if @direction is 1 and @sprite.y < @game.height - @margin
        @sprite.body.velocity.y = @speed
        @sprite.animations.play 'down', 5, false
      else if @direction is 2 and @sprite.x > @margin
        @sprite.body.velocity.x = -@speed
        @sprite.animations.play 'left', 5, false
      else if @direction is 3 and @sprite.x < @game.width - @margin
        @sprite.body.velocity.x = @speed
        @sprite.animations.play 'right', 5, false
      
  return Enemy
)
