define( ->
  fontStyle = { font: "20px Arial", fill: "#ffffff", align: "left" }

  class Hero
    expText = null
    healthText = null
    manaText = null
    fireRate = 400
    nextFire = 0
    arrowIndex = 0
    arrowSpeed = 600
    numArrows = 50
    numArrowsShot = 5

    damage: ->
      @meta.health--
      @render()
      
    render: ->
      @game.debug.text("health: #{@meta.health}", 20, 30, fontStyle)

    constructor: (@game, @phaser, @meta) ->
      @sprite = null
      @speed = 200
      @startOnScreenPos = 10
      @png = @meta.png

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
      @game.load.spritesheet "#{@png}", "images/#{@png}.png", 32, 48
      @game.load.image('arrow', 'images/bullet.png')

    create: ->
      @sprite = @game.add.sprite(@meta.x, @meta.y, "#{@png}")
      @game.physics.enable(@sprite, @phaser.Physics.ARCADE)
      @sprite.body.collideWorldBounds = true
      @sprite.body.bounce.set(1)
      expText = @game.add.text(20, 10, "exp: #{@meta.exp}", fontStyle)
      # healthText = @game.add.text(20, 30, "health: #{@meta.health}", fontStyle)
      @render()
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
        @game.trigger('changeMap', 'left')

      if @sprite.x > @game.width
        @sprite.x = @startOnScreenPos
        @game.trigger('changeMap', 'right')

      if @sprite.y < 0
        @sprite.y = @game.height - @startOnScreenPos
        @game.trigger('changeMap', 'up')

      if @sprite.y > @game.height
        @sprite.y = @startOnScreenPos
        @game.trigger('changeMap', 'down')

      if @upKey.isDown
        @sprite.body.velocity.y = -@speed
        @sprite.animations.play "up", 5, false
        @directionFacing = 'up'
        @game.move 
          dir: 'up'
          x: @sprite.x
          y: @sprite.y
      else if @downKey.isDown
        @sprite.body.velocity.y = @speed
        @sprite.animations.play "down", 5, false
        @directionFacing = 'down'
        @game.move 
          dir:'down'
          x: @sprite.x
          y: @sprite.y
      else if @leftKey.isDown
        @sprite.body.velocity.x = -@speed
        @sprite.animations.play "left", 5, false
        @directionFacing = 'left'
        @game.move 
         dir:'left'
         x: @sprite.x
         y: @sprite.y
      else if @rightKey.isDown
        @sprite.body.velocity.x = @speed
        @sprite.animations.play "right", 5, false
        @directionFacing = 'right'
        @game.move 
          dir: 'right'
          x: @sprite.x
          y: @sprite.y

      if @spaceBar.isDown
        @fire();

      # @sprite.bringToTop()

      return

    renderMissiles: (x, y, angle, num) ->
      
      for i in [0...num]
        console.log(arrowIndex)
        arrow = @arrows.children[arrowIndex]
        arrow.reset(x, y)
        thisAngle = angle + (i - 2) * 0.2
        # console.log(thisAngle)
        arrow.rotation = @game.physics.arcade.moveToXY(
          arrow, 
          x + Math.sin(thisAngle), 
          y + Math.cos(thisAngle), 
          arrowSpeed
          )
        arrowIndex = (arrowIndex + 1) % numArrows

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

        @game.shoot @game.user, @game.mapId, @sprite.x, @sprite.y, baseAngle, numArrowsShot
        @renderMissiles @sprite.x, @sprite.y, baseAngle, numArrowsShot
        nextFire = @game.time.now + fireRate;




    _setControls: ->
      @upKey = @game.input.keyboard.addKey(Phaser.Keyboard.UP)
      @downKey = @game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
      @leftKey = @game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
      @rightKey = @game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
      @spaceBar = @game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

  return Hero
)
