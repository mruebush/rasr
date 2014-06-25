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
    numArrowsShot = 1

    damage: ->
      @sprite.animations.play 'damage_down', 15, false
      @meta.health--
      @render()
      if @meta.health <= 0
        console.log "hero takes lethal damage"
        # do @sprite.kill
        do @game.gameOver
        # do @game.destroy
      
    render: ->
      @game.debug.text("health: #{@meta.health}", 20, 30, fontStyle)

    constructor: (@game, @phaser, @meta) ->
      @sprite = null
      @speed = @meta.speed
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
      @game.load.atlasXML "player", "images/player.png", "images/player.xml"
      @game.load.image 'arrow', 'images/bullet.png'

    create: ->
      @sprite = @game.add.sprite(@meta.x, @meta.y, "player")
      @game.physics.enable(@sprite, @phaser.Physics.ARCADE)
      @sprite.body.collideWorldBounds = true
      @sprite.body.setSize(@sprite.body.halfWidth, -@sprite.body.sourceHeight / 3, @sprite.body.sourceWidth / 4, @sprite.body.sourceHeight)

      @sprite.animations.add("down", Phaser.Animation.generateFrameNames('player_walk_down', 0, 11, '.png', 4), 30, false)
      @sprite.animations.add("left", Phaser.Animation.generateFrameNames('player_walk_left', 0, 11, '.png', 4), 30, false)
      @sprite.animations.add("right", Phaser.Animation.generateFrameNames('player_walk_right', 0, 11, '.png', 4), 30, false)
      @sprite.animations.add("up", Phaser.Animation.generateFrameNames('player_walk_up', 0, 11, '.png', 4), 30, false)

      @sprite.animations.add("attack_down", Phaser.Animation.generateFrameNames('player_attack_down', 0, 4, '.png', 4), 15, false)
      @sprite.animations.add("attack_left", Phaser.Animation.generateFrameNames('player_attack_left', 0, 4, '.png', 4), 15, false)
      @sprite.animations.add("attack_right", Phaser.Animation.generateFrameNames('player_attack_right', 0, 4, '.png', 4), 15, false)
      @sprite.animations.add("attack_up", Phaser.Animation.generateFrameNames('player_attack_up', 0, 4, '.png', 4), 15, false)

      @sprite.animations.add("damage_down", Phaser.Animation.generateFrameNames('player_take_damage_from_down', 0, 10, '.png', 4), 30, false)
      @sprite.animations.add("damage_left", Phaser.Animation.generateFrameNames('player_take_damage_from_left', 0, 10, '.png', 4), 30, false)
      @sprite.animations.add("damage_right", Phaser.Animation.generateFrameNames('player_take_damage_from_right', 0, 10, '.png', 4), 30, false)
      @sprite.animations.add("damage_up", Phaser.Animation.generateFrameNames('player_take_damage_from_up', 0, 10, '.png', 4), 30, false)

      @_setControls()
      @createArrows()

    update: ->
      @sprite.body.velocity.x = 0
      @sprite.body.velocity.y = 0

      if @sprite.x < 0
        @sprite.x = (@game.realWidth) - @startOnScreenPos
        @game.trigger('changeMap', 'left')

      if @sprite.x > @game.realWidth
        @sprite.x = @startOnScreenPos
        @game.trigger('changeMap', 'right')

      if @sprite.y < 0
        @sprite.y = @game.realHeight - @startOnScreenPos
        @game.trigger('changeMap', 'up')

      if @sprite.y > @game.realHeight
        @sprite.y = @startOnScreenPos
        @game.trigger('changeMap', 'down')

      if @upKey.isDown
        @sprite.body.velocity.y = -@speed
        @sprite.animations.play "up", 30, false
        @directionFacing = 'up'
        @game.move 
          dir: 'up'
          x: @sprite.x
          y: @sprite.y
      else if @downKey.isDown
        @sprite.body.velocity.y = @speed
        @sprite.animations.play "down", 30, false
        @directionFacing = 'down'
        @game.move 
          dir:'down'
          x: @sprite.x
          y: @sprite.y
      else if @leftKey.isDown
        @sprite.body.velocity.x = -@speed
        @sprite.animations.play "left", 30, false
        @directionFacing = 'left'
        @game.move 
         dir:'left'
         x: @sprite.x
         y: @sprite.y
      else if @rightKey.isDown
        @sprite.body.velocity.x = @speed
        @sprite.animations.play "right", 30, false
        @directionFacing = 'right'
        @game.move 
          dir: 'right'
          x: @sprite.x
          y: @sprite.y
      else if @spaceBar.isDown
        @sprite.animations.play "attack_#{@directionFacing}", 15, false
        @fire();

      # @sprite.bringToTop()

      return

    renderMissiles: (x, y, angle, num) ->
      for i in [0...num]
        arrow = @arrows.children[arrowIndex]
        arrow.reset(x, y)
        thisAngle = angle + (i - 2) * 0.2
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
