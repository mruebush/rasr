define(['arrows'], (Arrows) ->
  fontStyle = { font: "20px Arial", fill: "#ffffff", align: "left" }

  class Hero
    expText = null
    healthText = null
    manaText = null
    fireRate = 400
    nextFire = 0
    arrowIndex = 0
    arrowSpeed = 600
    numArrows = 30
    numArrowsShot = 5

    set: (property, value) ->
      @[property] = value

    constructor: (@game, @phaser, @meta) ->
      @sprite = null
      @speed = 200
      @startOnScreenPos = 10

      @upKey = null
      @downKey = null
      @leftKey = null
      @rightKey = null
      @spaceBar = null
      @directionFacing = 'up'

    createArrows: ->
      @arrows = @game.add.group()
      @arrows.enableBody = true
      @arrows.physicsBodyType = Phaser.Physics.ARCADE
      @arrows.createMultiple(numArrows, 'arrow', 0, false)
      @arrows.setAll('anchor.x', 0.5)
      @arrows.setAll('anchor.y', 0.5)
      @arrows.setAll('outOfBoundsKill', true)
      @arrows.setAll('checkWorldBounds', true)
      
    preload: ->
      @game.load.spritesheet "roshan", "images/roshan.png", 32, 48
      @game.load.image('arrow', 'images/bullet.png')

    create: ->
      @sprite = @game.add.sprite(@meta.x, @meta.y, "roshan")
      @game.physics.enable(@sprite, @phaser.Physics.ARCADE)
      @sprite.body.collideWorldBounds = true
      @sprite.body.bounce.set(1)
      expText = @game.add.text(20, 10, "exp: #{@meta.exp}", fontStyle)
      healthText = @game.add.text(20, 30, "health: #{@meta.health}", fontStyle)
      mana = @game.add.text(20, 50, "mana: #{@meta.mana}", fontStyle)

      @sprite.animations.add "down", [0, 3], false
      @sprite.animations.add "left", [4, 7], false
      @sprite.animations.add "right", [8, 11], false
      @sprite.animations.add "up", [12, 15], false
      @_setControls()
      @createArrows()

    update: ->
      @sprite.body.velocity.x = 0
      @sprite.body.velocity.y = 0

      if @sprite.x < 0
        @sprite.x = @game.width - @startOnScreenPos
        @trigger('changeMap', 'left')

      if @sprite.x > @game.width
        @sprite.x = @startOnScreenPos
        @trigger('changeMap', 'right')

      if @sprite.y < 0
        @sprite.y = @game.height - @startOnScreenPos
        @trigger('changeMap', 'up')

      if @sprite.y > @game.height
        @sprite.y = @startOnScreenPos
        @trigger('changeMap', 'down')

      if @upKey.isDown
        @sprite.body.velocity.y = -@speed
        @sprite.animations.play "up", 5, false
        @directionFacing = 'up'
        # @actions.move 'up', @user, @mapId, @sprite.x, @sprite.y
      else if @downKey.isDown
        @sprite.body.velocity.y = @speed
        @sprite.animations.play "down", 5, false
        @directionFacing = 'down'
        # @actions.move 'down', @user, @mapId, @sprite.x, @sprite.y
      else if @leftKey.isDown
        @sprite.body.velocity.x = -@speed
        @sprite.animations.play "left", 5, false
        @directionFacing = 'left'
        # @actions.move 'left', @user, @mapId, @sprite.x, @sprite.y
      else if @rightKey.isDown
        @sprite.body.velocity.x = @speed
        @sprite.animations.play "right", 5, false
        @directionFacing = 'right'
        # @actions.move 'right', @user, @mapId, @sprite.x, @sprite.y

      if @spaceBar.isDown
        console.log('space bar is down')
        @fire();

      # @sprite.bringToTop()

      return

    fire: ->
      if @game.time.now > nextFire

        if @directionFacing is 'up'
          baseAngle = Math.PI
        else if @directionFacing is 'right'
          baseAngle = Math.PI/2
        else if @directionFacing is 'down'
          baseAngle = 0
        else if @directionFacing is 'left'
          baseAngle = -Math.PI/2

        for i in [0...numArrowsShot]
          arrow = @arrows.children[arrowIndex]
          arrow.reset(@sprite.x, @sprite.y)
          thisAngle = baseAngle + (i - 2) * 0.2
          console.log(thisAngle)
          arrow.rotation = @game.physics.arcade.moveToXY(
            arrow, 
            @sprite.x + 1000*Math.sin(thisAngle), 
            @sprite.y + 1000*Math.cos(thisAngle), 
            arrowSpeed
            )
          arrowIndex = (arrowIndex + 1) % numArrows

        nextFire = @game.time.now + fireRate;




    _setControls: ->
      @upKey = @game.input.keyboard.addKey(Phaser.Keyboard.UP)
      @downKey = @game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
      @leftKey = @game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
      @rightKey = @game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
      @spaceBar = @game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

  return Hero
)
