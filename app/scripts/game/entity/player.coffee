
define( ->
  fontStyle = { font: "20px Arial", fill: "#ffffff", align: "left" }

  class Player

    constructor: (@game, @phaser, @meta) ->
      @sprite = null
      @user = null

    preload: ->
      @game.load.atlasXML "player", "images/player.png", "images/player.xml"
      @game.load.image 'arrow', 'images/bullet.png'

    create: ->
      @sprite = @game.add.sprite(@meta.x, @meta.y, "player")
      @game.physics.enable(@sprite, @phaser.Physics.ARCADE)
      @sprite.body.collideWorldBounds = true
      @sprite.body.bounce.set(1)

      @sprite.animations.add("down", Phaser.Animation.generateFrameNames('player_walk_down', 0, 11, '.png', 4), 30, false)
      @sprite.animations.add("left", Phaser.Animation.generateFrameNames('player_walk_left', 0, 11, '.png', 4), 30, false)
      @sprite.animations.add("right", Phaser.Animation.generateFrameNames('player_walk_right', 0, 11, '.png', 4), 30, false)
      @sprite.animations.add("up", Phaser.Animation.generateFrameNames('player_walk_up', 0, 11, '.png', 4), 30, false)

      @sprite.animations.add("attack_down", Phaser.Animation.generateFrameNames('player_attack_down', 0, 4, '.png', 4), 15, false)
      @sprite.animations.add("attack_left", Phaser.Animation.generateFrameNames('player_attack_left', 0, 4, '.png', 4), 15, false)
      @sprite.animations.add("attack_right", Phaser.Animation.generateFrameNames('player_attack_right', 0, 4, '.png', 4), 15, false)
      @sprite.animations.add("attack_up", Phaser.Animation.generateFrameNames('player_attack_up', 0, 4, '.png', 4), 15, false)


    move: (data) ->

      dir = data.dir
      @sprite.y = data.y
      @sprite.x = data.x

      if dir is 'up'
        @sprite.animations.play "up", 30, false
      else if dir is 'down'
        @sprite.animations.play "down", 30, false
      else if dir is 'left'
        @sprite.animations.play "left", 30, false
      else if dir is 'right'
        @sprite.animations.play "right", 30, false

      do @update
      
    update: ->
      @sprite.bringToTop()

      return

  return Player
)
