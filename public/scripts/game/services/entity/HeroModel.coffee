app.factory 'Hero', (Arrow) ->
  nextFire = 0
  arrowIndex = 0
  numArrows = 50
  heartRemoved = false
  segments = 80
  heartSegment = 20
  Hero = {}
  collisionHeight = null
  collisionHeightOffset = null
  collisionWidth = null
  collisionWidthOffset = null

  return (game, phaser, meta) ->

    Hero.levelUp = ->
      @level++
      @speed = do @speedCalc
      @xpToGo = do @xpToLevel
      @fireRate = do @fireRateCalc
      @numArrowsShot = do @numArrowsCalc
      @arrowSpeed = do @arrowSpeedCalc
      @game.shoot Hero.game.user, Hero.game.mapId, Hero.sprite.x, Hero.sprite.y, 0, 32, @directionFacing
      @renderMissiles Hero.sprite.x, Hero.sprite.y + 60, 0, 32, 350

    Hero.addXP = (data) ->
      @xp = data.user.xp
      @toGo = Math.round(100*Hero.xp / Hero.xpToGo)
      width = "#{@toGo}%"
      if data.user.levelUp
        do @levelUp
        width = '0%'
        Hero.xpToGo = do Hero.xpToLevel

      $('div.progress-bar').css({
        width: width
        })
      do @game.digest

    Hero.xpToLevel = ->
      return Math.floor(Math.exp(0.5 * @level))

    Hero.speedCalc = ->
      170 + Math.floor(15 * Math.log(@level))

    Hero.fireRateCalc = ->
      400 + 0.5 * (@level - 1)

    Hero.numArrowsCalc = ->
      1 + 0.2 * (@level - 1)

    Hero.arrowSpeedCalc = ->
      600 + 0.4 * (@level - 1)

    Hero.game = game 
    Hero.phaser = phaser
    Hero.meta = meta
    Hero.sprite = null
    Hero.startOnScreenPos = 10
    Hero.png = meta.png
    Hero.level = meta.level
    Hero.dmg = meta.dmg
    Hero.xp = meta.xp
    Hero.xpToGo = do Hero.xpToLevel

    Hero.upKey = null
    Hero.downKey = null
    Hero.leftKey = null
    Hero.rightKey = null
    Hero.spaceBar = null
    Hero.directionFacing = 'down'
    Hero.died = false

    Hero.speed = do Hero.speedCalc
    Hero.fireRate = do Hero.fireRateCalc
    Hero.numArrowsShot = Math.ceil(do Hero.numArrowsCalc)
    Hero.arrowSpeed = do Hero.arrowSpeedCalc
    Hero.toGo = Math.round(100*Hero.xp / Hero.xpToGo)
    $('div.progress-bar').css({
      width: "#{Hero.toGo}%"
    })

    Hero.damage = ->
      Hero.sprite.animations.play 'damage_' + Hero.directionFacing, 15, false
      Hero.meta.health--
      heartRemoved = false if @meta.health <= segments
      if @meta.health <= segments and not heartRemoved
        do Hero.game.hearts.children.pop
        segments -= heartSegment
        heartRemoved = true

      Hero.healthBar.clear()

      color = switch
        when @meta.health < 25 then color = 0xFF0000
        when @meta.health < 50 then color = 0xFF9900
        when @meta.health < 75 then color = 0x00FF00
        else 0x009933

      Hero.healthBar.lineStyle 10, color, 1
      Hero.healthBar.moveTo(0, -10)
      Hero.healthBar.lineTo((Hero.sprite.body.width / 100) * @meta.health, -10)

      if @meta.health <= 0
        Hero.sprite.animations.play "die", 15, false
        Hero.died = true
        Hero.sprite.body.velocity.x = 0
        Hero.sprite.body.velocity.y = 0
        do Hero.game.gameOver



    Hero.createArrows = ->
      # taken care of by "Arrow" Service
      Hero.arrow = Arrow(Hero.game)

    Hero.preload = ->
      Hero.game.load.atlasXML "player", "assets/player.png", "assets/player.xml"
      Hero.game.load.image "arrow", "assets/bullet.png"

    Hero.attachHealthBar = ->
      Hero.healthBar = game.add.graphics 0, 0
      Hero.healthBar.lineStyle 10, 0x009933, 1
      Hero.healthBar.moveTo(0, -10)
      Hero.healthBar.lineTo(Hero.sprite.body.width, -10)
      Hero.sprite.addChild(Hero.healthBar)
      
    Hero.attachName = (name)->
      style = { font: "15px Arial", align: "center" }
      text = game.add.text 10, -20, name, style
      text.shadowBlur = 5
      Hero.sprite.addChild text

    Hero.create = ->
      Hero.sprite = Hero.game.add.sprite(Hero.meta.x, Hero.meta.y, "player")

      Hero.game.physics.enable(Hero.sprite, Hero.phaser.Physics.ARCADE)
      Hero.sprite.body.collideWorldBounds = true

      do Hero.attachHealthBar

      Hero.sprite.animations.add("down", Phaser.Animation.generateFrameNames('walk_down', 0, 11, '.png', 4), 30, false)
      Hero.sprite.animations.add("left", Phaser.Animation.generateFrameNames('walk_left', 0, 11, '.png', 4), 30, false)
      Hero.sprite.animations.add("right", Phaser.Animation.generateFrameNames('walk_right', 0, 11, '.png', 4), 30, false)
      Hero.sprite.animations.add("up", Phaser.Animation.generateFrameNames('walk_up', 0, 11, '.png', 4), 30, false)

      collisionHeight = Hero.sprite.body.sourceHeight * 0.65
      collisionHeightOffset = Hero.sprite.body.sourceHeight * 0.25
      collisionWidth = Hero.sprite.body.sourceWidth * 0.75
      collisionWidthOffset = Hero.sprite.body.sourceWidth * 0.125

      Hero.sprite.body.setSize(collisionWidth, collisionHeight, collisionWidthOffset, collisionHeightOffset)

      Hero.sprite.animations.add("attack_up", Phaser.Animation.generateFrameNames('attack_up', 0, 4, '.png', 4), 15, false)
      Hero.sprite.animations.add("attack_left", Phaser.Animation.generateFrameNames('attack_left', 0, 4, '.png', 4), 15, false)
      Hero.sprite.animations.add("attack_right", Phaser.Animation.generateFrameNames('attack_right', 0, 4, '.png', 4), 15, false)
      Hero.sprite.animations.add("attack_down", Phaser.Animation.generateFrameNames('attack_down', 0, 4, '.png', 4), 15, false)

      Hero.sprite.animations.add("damage_up", Phaser.Animation.generateFrameNames('take_damage_from_up', 0, 10, '.png', 4), 30, false)
      Hero.sprite.animations.add("damage_left", Phaser.Animation.generateFrameNames('take_damage_from_left', 0, 10, '.png', 4), 30, false)
      Hero.sprite.animations.add("damage_right", Phaser.Animation.generateFrameNames('take_damage_from_right', 0, 10, '.png', 4), 30, false)
      Hero.sprite.animations.add("damage_down", Phaser.Animation.generateFrameNames('take_damage_from_down', 0, 10, '.png', 4), 30, false)

      Hero.sprite.animations.add("up", Phaser.Animation.generateFrameNames('walk_up', 0, 11, '.png', 4), 30, false)
      Hero.sprite.animations.add("left", Phaser.Animation.generateFrameNames('walk_left', 0, 11, '.png', 4), 30, false)
      Hero.sprite.animations.add("right", Phaser.Animation.generateFrameNames('walk_right', 0, 11, '.png', 4), 30, false)
      Hero.sprite.animations.add("down", Phaser.Animation.generateFrameNames('walk_down', 0, 11, '.png', 4), 30, false)

      Hero.sprite.animations.add("die", Phaser.Animation.generateFrameNames('die_', 1, 5, '.png', 2), 15, false)


      Hero._setControls()
      Hero.createArrows()

    Hero.update = ->
      if (Hero.died)
        return
      Hero.sprite.body.velocity.x = 0
      Hero.sprite.body.velocity.y = 0

      if Hero.sprite.x < 0 - collisionWidthOffset
        Hero.sprite.x = (Hero.game.realWidth) - Hero.startOnScreenPos
        Hero.game.trigger('changeMap', 'left')

      if Hero.sprite.x > Hero.game.realWidth + collisionWidthOffset
        Hero.sprite.x = Hero.startOnScreenPos
        Hero.game.trigger('changeMap', 'right')

      if Hero.sprite.y < 0 - collisionHeightOffset
        Hero.sprite.y = Hero.game.realHeight - Hero.startOnScreenPos
        Hero.game.trigger('changeMap', 'up')

      if Hero.sprite.y > Hero.game.realHeight + collisionHeightOffset
        Hero.sprite.y = Hero.startOnScreenPos
        Hero.game.trigger('changeMap', 'down')

      if Hero.upKey.isDown
        Hero.sprite.body.velocity.y = -Hero.speed
        Hero.sprite.animations.play "up", 30, false
        Hero.directionFacing = 'up'
        Hero.game.move 
          dir: 'up'
          x: Hero.sprite.x
          y: Hero.sprite.y
      else if Hero.downKey.isDown
        Hero.sprite.body.velocity.y = Hero.speed
        Hero.sprite.animations.play "down", 30, false
        Hero.directionFacing = 'down'
        Hero.game.move 
          dir:'down'
          x: Hero.sprite.x
          y: Hero.sprite.y
      else if Hero.leftKey.isDown
        Hero.sprite.body.velocity.x = -Hero.speed
        Hero.sprite.animations.play "left", 30, false
        Hero.directionFacing = 'left'
        Hero.game.move 
         dir:'left'
         x: Hero.sprite.x
         y: Hero.sprite.y
      else if Hero.rightKey.isDown
        Hero.sprite.body.velocity.x = Hero.speed
        Hero.sprite.animations.play "right", 30, false
        Hero.directionFacing = 'right'
        Hero.game.move 
          dir: 'right'
          x: Hero.sprite.x
          y: Hero.sprite.y
      else if Hero.spaceBar.isDown
        Hero.sprite.animations.play "attack_#{Hero.directionFacing}", 15, false
        Hero.fire();

      # Hero.sprite.bringToTop()

      return

    Hero.renderMissiles = (x, y, angle, num, speed = Hero.arrowSpeed) ->
      initialAngle = angle + (num - 1) * 0.1
      for i in [0...num]
        arrow = Hero.arrow.arrows.children[arrowIndex]
        arrow.reset(x, y)
        # shoot straight
        thisAngle = initialAngle - i * 0.2
        # thisAngle = angle
        arrow.rotation = Hero.game.physics.arcade.moveToXY(
          arrow, 
          x + Math.sin(thisAngle), 
          y + Math.cos(thisAngle), 
          speed
          )
        arrowIndex = (arrowIndex + 1) % numArrows

    Hero.fire = ->
      if Hero.game.time.now > nextFire

        if Hero.directionFacing is 'up'
          baseAngle = Math.PI
        else if Hero.directionFacing is 'right'
          baseAngle = Math.PI/2
        else if Hero.directionFacing is 'down'
          baseAngle = 0
        else if Hero.directionFacing is 'left'
          baseAngle = -Math.PI/2

        Hero.game.shoot Hero.game.user, Hero.game.mapId, Hero.sprite.x, Hero.sprite.y, baseAngle, Hero.numArrowsShot, @directionFacing
        Hero.renderMissiles Hero.sprite.x, Hero.sprite.y + 60, baseAngle, Hero.numArrowsShot
        nextFire = Hero.game.time.now + Hero.fireRate;

    Hero._setControls = ->
      Hero.upKey = Hero.game.input.keyboard.addKey(Phaser.Keyboard.UP)
      Hero.downKey = Hero.game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
      Hero.leftKey = Hero.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
      Hero.rightKey = Hero.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
      Hero.spaceBar = Hero.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    return Hero
