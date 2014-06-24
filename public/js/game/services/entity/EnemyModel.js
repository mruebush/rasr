(function() {
  app.service('Enemy', function() {
    return function(index, game, phaser, meta) {
      this.index = index;
      this.game = game;
      this.phaser = phaser;
      this.meta = meta;
      this.sprite = null;
      this.direction = null;
      this.speed = this.meta.speed;
      this.margin = 50;
      this.x = this.meta.x;
      this.y = this.meta.y;
      this.health = this.meta.health;
      this.alive = true;
      this.png = this.meta.png;
      this.serverId = this.meta.id;
      this.setDirection = function(num) {
        return this.direction = num;
      };
      this.clearDirection = function() {
        return this.direction = null;
      };
      this.derender = function() {
        return this.sprite.kill();
      };
      this.damage = function() {
        this.health--;
        if (this.health <= 0) {
          return this.game.killEnemy;
        }
      };
      return true;
      this.preload = function() {
        return this.game.load.atlasXML("enemy", "images/enemy.png", "images/enemy.xml");
      };
      this.create = function() {
        this.sprite = this.game.add.sprite(this.x, this.y, "enemy");
        this.game.physics.enable(this.sprite, this.phaser.Physics.ARCADE);
        this.sprite.body.immovable = true;
        this.sprite.body.collideWorldBounds = true;
        this.sprite.anchor.setTo(.3, .5);
        this.sprite.body.bounce.set(1);
        this.sprite.body.width = 100;
        this.sprite.body.height = 100;
        this.sprite.animations.add("down", Phaser.Animation.generateFrameNames('enemy_move_down', 0, 10, '.png', 4), 30, false);
        this.sprite.animations.add("left", Phaser.Animation.generateFrameNames('enemy_move_left', 0, 10, '.png', 4), 30, false);
        this.sprite.animations.add("right", Phaser.Animation.generateFrameNames('enemy_move_right', 0, 10, '.png', 4), 30, false);
        return this.sprite.animations.add("up", Phaser.Animation.generateFrameNames('enemy_move_up', 0, 10, '.png', 4), 30, false);
      };
      return this.update = function() {
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        if (this.direction === 0 && this.sprite.y > this.margin) {
          this.sprite.body.velocity.y = -this.speed;
          return this.sprite.animations.play('up', 5, false);
        } else if (this.direction === 1 && this.sprite.y < this.game.realHeight - this.margin) {
          this.sprite.body.velocity.y = this.speed;
          return this.sprite.animations.play('down', 5, false);
        } else if (this.direction === 2 && this.sprite.x > this.margin) {
          this.sprite.body.velocity.x = -this.speed;
          return this.sprite.animations.play('left', 5, false);
        } else if (this.direction === 3 && this.sprite.x < this.game.realWidth - this.margin) {
          this.sprite.body.velocity.x = this.speed;
          return this.sprite.animations.play('right', 5, false);
        }
      };
    };
  });

}).call(this);
