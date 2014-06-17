
define( ->
  fontStyle = { font: "20px Arial", fill: "#ffffff", align: "left" }

  class Player
    expText = null
    healthText = null
    manaText = null

    constructor: (@game, @phaser, @meta) ->
      @sprite = null

      @upKey = null
      @downKey = null
      @leftKey = null
      @rightKey = null

    preload: ->
      @game.load.spritesheet "roshan", "images/roshan.png", 32, 48

    create: ->
      @sprite = @game.add.sprite(250, 250, "roshan")
      @game.physics.enable(@sprite, @phaser.Physics.ARCADE)
      @sprite.body.bounce.set(1)
      @expText = @game.add.text(20, 10, "exp: #{@meta.exp}", fontStyle)
      @healthText = @game.add.text(20, 30, "health: #{@meta.health}", fontStyle)
      @mana = @game.add.text(20, 50, "mana: #{@meta.mana}", fontStyle)
     
      @sprite.animations.add "down", [0, 3], false
      @sprite.animations.add "left", [4, 7], false
      @sprite.animations.add "right", [8, 11], false
      @sprite.animations.add "up", [12, 15], false
      @_setControls()

    update: ->
      if @sprite.x is 0
        @sprite.x = @game.width - 20
        @trigger('changeMap', 'left')

      if @sprite.x is @game.width
        @sprite.x = 10
        @trigger('changeMap', 'right')

      if @sprite.y is 0
        @sprite.y = @game.height - 20
        @trigger('changeMap', 'up')

      if @sprite.y is @game.height
        @sprite.y = 10
        @trigger('changeMap', 'down')

      if @upKey.isDown
        @sprite.y -= 2
        @sprite.animations.play "up", 5, false
      else if @downKey.isDown
        @sprite.y += 2
        @sprite.animations.play "down", 5, false
      if @leftKey.isDown
        @sprite.x -= 2
        @sprite.animations.play "left", 5, false
      else if @rightKey.isDown
        @sprite.x += 2
        @sprite.animations.play "right", 5, false

      @sprite.bringToTop()

      return

    _setControls: ->
      @upKey = @game.input.keyboard.addKey(Phaser.Keyboard.UP)
      @downKey = @game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
      @leftKey = @game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
      @rightKey = @game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)

    takeDmg: (hero, enemy) ->
      @meta.health -= 10
      @healthText.text = "health: #{@meta.health}"

  return Player
)
