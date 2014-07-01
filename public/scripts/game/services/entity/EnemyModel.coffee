app.service 'Enemy', ->

  return (game, phaser, meta) ->
    Enemy = {}
    Enemy.game = game
    Enemy.phaser = phaser
    Enemy.sprite = null
    Enemy.direction = null
    Enemy.speed = meta.speed
    Enemy.margin = 50

    Enemy.x = meta.x
    Enemy.y = meta.y

    Enemy.health = meta.health
    Enemy.alive = true
    Enemy.png = meta.png
    Enemy.serverId = meta.id
    Enemy.dbId = meta.dbId
    Enemy.name = meta.name
    Enemy.xp = meta.xp

    Enemy.reportDirection = ->
      report = ->
        Enemy.game.enemyMoving
          enemy: Enemy.serverId
          _id: Enemy.dbId
          x: Enemy.sprite.x
          y: Enemy.sprite.y

      Enemy.reportTimer = setInterval report, 250

    Enemy.reportDirection = _.once(Enemy.reportDirection)

    Enemy.setDirection = (num) ->
      Enemy.direction = num

    Enemy.clearDirection = ->
      Enemy.timer = setTimeout ->
        Enemy.direction = null
        Enemy.game.stopEnemy(Enemy)
      , 500

    Enemy.derender = ->
      Enemy.alive = false
      do Enemy.sprite.kill
      clearInterval Enemy.timer
      clearInterval Enemy.reportTimer

    Enemy.damage = ->
      do Enemy.reportDirection
      Enemy.game.damageEnemy @

      Enemy.healthBar.clear()

      color = switch
        when Enemy.health < 2 then color = 0xFF0000
        when Enemy.health < 3 then color = 0xFF9900
        when Enemy.health < 4 then color = 0x00FF00
        else 0x009933

      Enemy.healthBar.lineStyle 10, color, 1
      Enemy.healthBar.moveTo(-10, -30)
      Enemy.healthBar.lineTo((Enemy.sprite.body.width / 100) * Enemy.health * 10, -30)

      return true

    Enemy.preload = ->
      Enemy.game.load.atlasXML "enemy", "images/enemy.png", "images/enemy.xml"

    Enemy.attachHealthBar = ->
      Enemy.healthBar = game.add.graphics 0, 0
      Enemy.healthBar.lineStyle 10, 0x009933, 1
      Enemy.healthBar.moveTo(-10, -30)
      Enemy.healthBar.lineTo(Enemy.sprite.body.width / 2, -30)
      Enemy.sprite.addChild(Enemy.healthBar)

    Enemy.create = ->
      Enemy.sprite = Enemy.game.add.sprite(Enemy.x, Enemy.y, "enemy")
      Enemy.game.physics.enable(Enemy.sprite, Enemy.phaser.Physics.ARCADE)
      Enemy.sprite.body.immovable = true
      Enemy.sprite.body.collideWorldBounds = true
      Enemy.sprite.body.setSize(Enemy.sprite.body.sourceWidth, Enemy.sprite.body.halfHeight, 0, Enemy.sprite.body.height / 3)
      Enemy.sprite.anchor.setTo(.3, .5)
      
      do Enemy.attachHealthBar

      Enemy.sprite.animations.add("up", Phaser.Animation.generateFrameNames('enemy_move_up', 0, 10, '.png', 4), 30, false)
      Enemy.sprite.animations.add("left", Phaser.Animation.generateFrameNames('enemy_move_left', 0, 10, '.png', 4), 30, false)
      Enemy.sprite.animations.add("right", Phaser.Animation.generateFrameNames('enemy_move_right', 0, 10, '.png', 4), 30, false)
      Enemy.sprite.animations.add("down", Phaser.Animation.generateFrameNames('enemy_move_down', 0, 10, '.png', 4), 30, false)

    Enemy.update = ->
      Enemy.sprite.body.velocity.x = 0
      Enemy.sprite.body.velocity.y = 0

      if Enemy.direction is 0 and Enemy.sprite.y > Enemy.margin
        Enemy.sprite.body.velocity.y = -Enemy.speed 
        Enemy.sprite.animations.play 'up', 5, false
      else if Enemy.direction is 1 and Enemy.sprite.y < Enemy.game.realHeight - Enemy.margin
        Enemy.sprite.body.velocity.y = Enemy.speed
        Enemy.sprite.animations.play 'down', 5, false
      else if Enemy.direction is 2 and Enemy.sprite.x > Enemy.margin
        Enemy.sprite.body.velocity.x = -Enemy.speed
        Enemy.sprite.animations.play 'left', 5, false
      else if Enemy.direction is 3 and Enemy.sprite.x < Enemy.game.realWidth - Enemy.margin
        Enemy.sprite.body.velocity.x = Enemy.speed
        Enemy.sprite.animations.play 'right', 5, false

    return Enemy
