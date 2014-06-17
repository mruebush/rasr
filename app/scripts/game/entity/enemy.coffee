define( ->

  class Enemy
    constructor: (@index, @game, @phaser, @meta) ->
      @sprite = null
      @direction = null
      @x = @game.world.randomX
      @y = @game.world.randomY
      @name = @index.toString()

    preload: ->
      @game.load.spritesheet "enemy", "images/leviathan.png", 96, 96

    create: ->
      @sprite = @game.add.sprite(@x, @y, "enemy")
      @game.physics.enable(@sprite, @phaser.Physics.ARCADE)
      @sprite.body.immovable = false
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

      @game.physics.arcade.velocityFromRotation(@sprite.rotation, 100, @sprite.body.velocity);
      setInterval(=>
        @direction = Math.floor(Math.random() * 4)
        setTimeout(=>
          @direction = null
        , 1500)
      , 2000)

    update: ->
      if @direction is 0 
        @sprite.body.y -= 2 
        @sprite.animations.play 'up', 5, false
      if @direction is 1
        @sprite.body.y += 2
        @sprite.animations.play 'down', 5, false
      if @direction is 2 
        @sprite.body.x -= 2
        @sprite.animations.play 'left', 5, false
      if @direction is 3 
        @sprite.body.x += 2
        @sprite.animations.play 'right', 5, false
      
  return Enemy
)
