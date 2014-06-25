fontStyle = { font: "20px Arial", fill: "#ffffff", align: "left" }

app.factory 'Hero', (Arrow) ->
  expText = null
  healthText = null
  manaText = null
  fireRate = 400
  nextFire = 0
  arrowIndex = 0
  arrowSpeed = 600
  numArrows = 50
  numArrowsShot = 5
  Hero = {}

  return (game, phaser, meta) ->
    Hero.game = game
    Hero.phaser = phaser
    Hero.meta = meta
    Hero.sprite = null
    Hero.speed = 200
    Hero.startOnScreenPos = 10
    Hero.png = Hero.meta.png

    Hero.upKey = null
    Hero.downKey = null
    Hero.leftKey = null
    Hero.rightKey = null
    Hero.spaceBar = null
    Hero.directionFacing = 'down'

    Hero.damage = ->
      Hero.sprite.animations.play 'damage_down', 15, false
      Hero.meta.health--
      Hero.render()
      
    Hero.render = ->
      Hero.game.debug.text("health: #{Hero.meta.health}", 20, 30, fontStyle)

    Hero.createArrows = ->
      # taken care of by "Arrow" Service
      Hero.arrow = Arrow(Hero.game)

    Hero.preload = ->
      Hero.game.load.atlasXML "player", "assets/player.png", "assets/player.xml"
      Hero.game.load.image "arrow", "assets/bullet.png"

    Hero.create = ->
      Hero.sprite = Hero.game.add.sprite(Hero.meta.x, Hero.meta.y, "player")
      Hero.game.physics.enable(Hero.sprite, Hero.phaser.Physics.ARCADE)
      Hero.sprite.body.collideWorldBounds = true
      Hero.sprite.body.bounce.set(1)
      expText = Hero.game.add.text(20, 10, "exp: #{Hero.meta.exp}", fontStyle)
      # healthText = Hero.game.add.text(20, 30, "health: #{Hero.meta.health}", fontStyle)
      Hero.render()
      mana = Hero.game.add.text(20, 50, "mana: #{Hero.meta.mana}", fontStyle)

      Hero.sprite.animations.add("down", Phaser.Animation.generateFrameNames('player_walk_down', 0, 11, '.png', 4), 30, false)
      Hero.sprite.animations.add("left", Phaser.Animation.generateFrameNames('player_walk_left', 0, 11, '.png', 4), 30, false)
      Hero.sprite.animations.add("right", Phaser.Animation.generateFrameNames('player_walk_right', 0, 11, '.png', 4), 30, false)
      Hero.sprite.animations.add("up", Phaser.Animation.generateFrameNames('player_walk_up', 0, 11, '.png', 4), 30, false)

      Hero.sprite.animations.add("attack_down", Phaser.Animation.generateFrameNames('player_attack_down', 0, 4, '.png', 4), 15, false)
      Hero.sprite.animations.add("attack_left", Phaser.Animation.generateFrameNames('player_attack_left', 0, 4, '.png', 4), 15, false)
      Hero.sprite.animations.add("attack_right", Phaser.Animation.generateFrameNames('player_attack_right', 0, 4, '.png', 4), 15, false)
      Hero.sprite.animations.add("attack_up", Phaser.Animation.generateFrameNames('player_attack_up', 0, 4, '.png', 4), 15, false)

      Hero.sprite.animations.add("damage_down", Phaser.Animation.generateFrameNames('player_take_damage_from_down', 0, 10, '.png', 4), 30, false)
      Hero.sprite.animations.add("damage_left", Phaser.Animation.generateFrameNames('player_take_damage_from_left', 0, 10, '.png', 4), 30, false)
      Hero.sprite.animations.add("damage_right", Phaser.Animation.generateFrameNames('player_take_damage_from_right', 0, 10, '.png', 4), 30, false)
      Hero.sprite.animations.add("damage_up", Phaser.Animation.generateFrameNames('player_take_damage_from_up', 0, 10, '.png', 4), 30, false)

      Hero._setControls()
      Hero.createArrows()

    Hero.update = ->
      Hero.sprite.body.velocity.x = 0
      Hero.sprite.body.velocity.y = 0

      if Hero.sprite.x < 0
        Hero.sprite.x = (Hero.game.realWidth) - Hero.startOnScreenPos
        Hero.game.trigger('changeMap', 'left')

      if Hero.sprite.x > Hero.game.realWidth
        Hero.sprite.x = Hero.startOnScreenPos
        Hero.game.trigger('changeMap', 'right')

      if Hero.sprite.y < 0
        Hero.sprite.y = Hero.game.realHeight - Hero.startOnScreenPos
        Hero.game.trigger('changeMap', 'up')

      if Hero.sprite.y > Hero.game.realHeight
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

    Hero.renderMissiles = (x, y, angle, num) ->
      for i in [0...num]
        arrow = Hero.arrow.arrows.children[arrowIndex]
        arrow.reset(x, y)
        thisAngle = angle + (i - 2) * 0.2
        arrow.rotation = Hero.game.physics.arcade.moveToXY(
          arrow, 
          x + Math.sin(thisAngle), 
          y + Math.cos(thisAngle), 
          arrowSpeed
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

        Hero.game.shoot Hero.game.user, Hero.game.mapId, Hero.sprite.x, Hero.sprite.y, baseAngle, numArrowsShot
        Hero.renderMissiles Hero.sprite.x, Hero.sprite.y, baseAngle, numArrowsShot
        nextFire = Hero.game.time.now + fireRate;

    Hero._setControls = ->
      Hero.upKey = Hero.game.input.keyboard.addKey(Phaser.Keyboard.UP)
      Hero.downKey = Hero.game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
      Hero.leftKey = Hero.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
      Hero.rightKey = Hero.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
      Hero.spaceBar = Hero.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    return Hero
