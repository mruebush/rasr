(function() {
  app.service('Player', function() {
    return function(game, phaser, meta) {
      this.game = game;
      this.phaser = phaser;
      this.meta = meta;
      this.sprite = null;
      this.user = null;
      this.preload = function() {
        this.game.load.atlasXML("player", "images/player.png", "images/player.xml");
        return this.game.load.image('arrow', 'images/bullet.png');
      };
      this.create = function() {
        this.sprite = this.game.add.sprite(this.meta.x, this.meta.y, "player");
        this.game.physics.enable(this.sprite, this.phaser.Physics.ARCADE);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.bounce.set(1);
        this.sprite.animations.add("down", Phaser.Animation.generateFrameNames('player_walk_down', 0, 11, '.png', 4), 30, false);
        this.sprite.animations.add("left", Phaser.Animation.generateFrameNames('player_walk_left', 0, 11, '.png', 4), 30, false);
        this.sprite.animations.add("right", Phaser.Animation.generateFrameNames('player_walk_right', 0, 11, '.png', 4), 30, false);
        this.sprite.animations.add("up", Phaser.Animation.generateFrameNames('player_walk_up', 0, 11, '.png', 4), 30, false);
        this.sprite.animations.add("attack_down", Phaser.Animation.generateFrameNames('player_attack_down', 0, 4, '.png', 4), 15, false);
        this.sprite.animations.add("attack_left", Phaser.Animation.generateFrameNames('player_attack_left', 0, 4, '.png', 4), 15, false);
        this.sprite.animations.add("attack_right", Phaser.Animation.generateFrameNames('player_attack_right', 0, 4, '.png', 4), 15, false);
        return this.sprite.animations.add("attack_up", Phaser.Animation.generateFrameNames('player_attack_up', 0, 4, '.png', 4), 15, false);
      };
      this.move = function(data) {
        var dir;
        dir = data.dir;
        this.sprite.y = data.y;
        this.sprite.x = data.x;
        if (dir === 'up') {
          this.sprite.animations.play("up", 5, false);
        } else if (dir === 'down') {
          this.sprite.animations.play("down", 5, false);
        }
        if (dir === 'left') {
          this.sprite.animations.play("left", 5, false);
        } else if (dir === 'right') {
          this.sprite.animations.play("right", 5, false);
        }
        return this.update();
      };
      return this.update = function() {
        this.sprite.bringToTop();
      };
    };
  });

}).call(this);
