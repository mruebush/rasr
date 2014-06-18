(function() {
  define(function() {
    var Enemy;
    Enemy = (function() {
      function Enemy(index, game, phaser, meta) {
        this.index = index;
        this.game = game;
        this.phaser = phaser;
        this.meta = meta;
        this.sprite = null;
        this.direction = null;
        this.speed = 200;
        this.margin = 50;
        this.x = Math.min(Math.max(this.game.world.randomX, this.margin), this.game.width - this.margin);
        this.y = Math.min(Math.max(this.game.world.randomY, this.margin), this.game.height - this.margin);
        this.health = 5;
        this.alive = true;
      }

      Enemy.prototype.damage = function() {
        console.log('damage damage');
        this.health--;
        if (this.health <= 0) {
          this.alive = false;
          this.sprite.kill();
        }
        return true;
      };

      Enemy.prototype.preload = function() {
        return this.game.load.spritesheet("enemy", "images/leviathan.png", 96, 96);
      };

      Enemy.prototype.create = function() {
        var _this = this;
        this.sprite = this.game.add.sprite(this.x, this.y, "enemy");
        this.game.physics.enable(this.sprite, this.phaser.Physics.ARCADE);
        this.sprite.body.immovable = true;
        this.sprite.body.collideWorldBounds = true;
        this.sprite.anchor.setTo(.3, .5);
        this.sprite.body.bounce.set(1);
        this.sprite.body.width = 100;
        this.sprite.body.height = 100;
        this.sprite.animations.add("down", [0, 3], true);
        this.sprite.animations.add("left", [4, 7], true);
        this.sprite.animations.add("right", [8, 11], true);
        this.sprite.animations.add("up", [12, 15], true);
        return setInterval(function() {
          _this.direction = Math.floor(Math.random() * 4);
          return setTimeout(function() {
            return _this.direction = null;
          }, 500);
        }, 2000);
      };

      Enemy.prototype.update = function() {
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        if (this.direction === 0 && this.sprite.y > this.margin) {
          this.sprite.body.velocity.y = -this.speed;
          return this.sprite.animations.play('up', 5, false);
        } else if (this.direction === 1 && this.sprite.y < this.game.height - this.margin) {
          this.sprite.body.velocity.y = this.speed;
          return this.sprite.animations.play('down', 5, false);
        } else if (this.direction === 2 && this.sprite.x > this.margin) {
          this.sprite.body.velocity.x = -this.speed;
          return this.sprite.animations.play('left', 5, false);
        } else if (this.direction === 3 && this.sprite.x < this.game.width - this.margin) {
          this.sprite.body.velocity.x = this.speed;
          return this.sprite.animations.play('right', 5, false);
        }
      };

      return Enemy;

    })();
    return Enemy;
  });

}).call(this);
