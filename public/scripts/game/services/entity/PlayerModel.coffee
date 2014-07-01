app.factory 'Player', ->

  return (game, phaser, meta) ->
    Player = {}
    Player.game = game
    Player.phaser = phaser
    Player.meta = meta
    Player.sprite = null
    Player.user = null
    Player.animateShoot = (dir) ->
      Player.sprite.animations.play "attack_#{dir}", 15, false

    Player.preload = ->
      Player.game.load.atlasXML "player", "assets/player.png", "assets/player.xml"
      Player.game.load.image 'arrow', 'assets/bullet.png'

    Player.create = ->
      Player.sprite = Player.game.add.sprite(Player.meta.x, Player.meta.y, "player")
      Player.game.physics.enable(Player.sprite, Player.phaser.Physics.ARCADE)
      Player.sprite.body.collideWorldBounds = true
      Player.sprite.body.bounce.set(1)
      
      collisionHeight = Hero.sprite.body.sourceHeight * 0.65;
      collisionHeightOffset = Hero.sprite.body.sourceHeight * 0.25;
      collisionWidth = Hero.sprite.body.sourceWidth * 0.75;
      collisionWidthOffset = Hero.sprite.body.sourceWidth * 0.125;

      Player.sprite.body.setSize(collisionWidth, collisionHeight, collisionWidthOffset, collisionHeightOffset);

      Player.sprite.animations.add("attack_up", Phaser.Animation.generateFrameNames('player_attack_up', 0, 4, '.png', 4), 15, false)
      Player.sprite.animations.add("attack_left", Phaser.Animation.generateFrameNames('player_attack_left', 0, 4, '.png', 4), 15, false)
      Player.sprite.animations.add("attack_right", Phaser.Animation.generateFrameNames('player_attack_right', 0, 4, '.png', 4), 15, false)
      Player.sprite.animations.add("attack_down", Phaser.Animation.generateFrameNames('player_attack_down', 0, 4, '.png', 4), 15, false)

      Player.sprite.animations.add("up", Phaser.Animation.generateFrameNames('player_walk_up', 0, 11, '.png', 4), 30, false)
      Player.sprite.animations.add("left", Phaser.Animation.generateFrameNames('player_walk_left', 0, 11, '.png', 4), 30, false)
      Player.sprite.animations.add("right", Phaser.Animation.generateFrameNames('player_walk_right', 0, 11, '.png', 4), 30, false)
      Player.sprite.animations.add("down", Phaser.Animation.generateFrameNames('player_walk_down', 0, 11, '.png', 4), 30, false)

    Player.move = (data) ->

      dir = data.dir

      @sprite.y = data.y
      @sprite.x = data.x

      if dir is 'up'
        @sprite.animations.play "up", 5, false
      else if dir is 'down'
        @sprite.animations.play "down", 5, false
      if dir is 'left'
        @sprite.animations.play "left", 5, false
      else if dir is 'right'
        @sprite.animations.play "right", 5, false

      do @update
      
    Player.update = ->
      @sprite.bringToTop()
      return

    return Player
