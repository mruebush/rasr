
define( ->
  fontStyle = { font: "20px Arial", fill: "#ffffff", align: "left" }

  class Player

    constructor: (@game, @phaser, @meta) ->
      @sprite = null
      @user = null

    preload: ->
      @game.load.spritesheet "roshan", "images/roshan.png", 32, 48

    create: ->
      @sprite = @game.add.sprite(@meta.x, @meta.y, "roshan")
      @game.physics.enable(@sprite, @phaser.Physics.ARCADE)
      @sprite.body.bounce.set(1)

      @sprite.animations.add "down", [0, 3], false
      @sprite.animations.add "left", [4, 7], false
      @sprite.animations.add "right", [8, 11], false
      @sprite.animations.add "up", [12, 15], false


    move: (data) ->

      dir = data.dir
      @sprite.y = data.y
      @sprite.x = data.x
      
      if dir is 'up'
        # @sprite.y = data.y
        @sprite.animations.play "up", 5, false
      else if dir is 'down'
        # @actions.move 'down', @user, @mapId
        # @sprite.y = 2
        @sprite.animations.play "down", 5, false
      if dir is 'left'
        # @actions.move 'left', @user, @mapId
        # @sprite.x -= 2
        @sprite.animations.play "left", 5, false
      else if dir is 'right'
        # @actions.move 'right', @user, @mapId
        # @sprite.x += 2
        @sprite.animations.play "right", 5, false

      do @update
      
    update: ->
      @sprite.bringToTop()

      return

  return Player
)
