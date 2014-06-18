(function() {
  define(function() {
    var Hero, fontStyle;
    fontStyle = {
      font: "20px Arial",
      fill: "#ffffff",
      align: "left"
    };
    Hero = (function() {
      var expText, healthText, manaText;

      expText = null;

      healthText = null;

      manaText = null;

      Hero.prototype.set = function(property, value) {
        return this[property] = value;
      };

      function Hero(game, phaser, meta) {
        this.game = game;
        this.phaser = phaser;
        this.meta = meta;
        this.sprite = null;
        this.speed = 200;
        this.startOnScreenPos = 10;
        this.upKey = null;
        this.downKey = null;
        this.leftKey = null;
        this.rightKey = null;
      }

      Hero.prototype.preload = function() {
        return this.game.load.spritesheet("roshan", "images/roshan.png", 32, 48);
      };

      Hero.prototype.create = function() {
        var mana;
        this.sprite = this.game.add.sprite(this.meta.x, this.meta.y, "roshan");
        this.game.physics.enable(this.sprite, this.phaser.Physics.ARCADE);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.bounce.set(1);
        expText = this.game.add.text(20, 10, "exp: " + this.meta.exp, fontStyle);
        healthText = this.game.add.text(20, 30, "health: " + this.meta.health, fontStyle);
        mana = this.game.add.text(20, 50, "mana: " + this.meta.mana, fontStyle);
        this.sprite.animations.add("down", [0, 3], false);
        this.sprite.animations.add("left", [4, 7], false);
        this.sprite.animations.add("right", [8, 11], false);
        this.sprite.animations.add("up", [12, 15], false);
        return this._setControls();
      };

      Hero.prototype.update = function() {
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        if (this.sprite.x < 0) {
          this.sprite.x = this.game.width - this.startOnScreenPos;
          this.trigger('changeMap', 'left');
        }
        if (this.sprite.x > this.game.width) {
          this.sprite.x = this.startOnScreenPos;
          this.trigger('changeMap', 'right');
        }
        if (this.sprite.y < 0) {
          this.sprite.y = this.game.height - this.startOnScreenPos;
          this.trigger('changeMap', 'up');
        }
        if (this.sprite.y > this.game.height) {
          this.sprite.y = this.startOnScreenPos;
          this.trigger('changeMap', 'down');
        }
        if (this.upKey.isDown) {
          this.sprite.body.velocity.y = -this.speed;
          this.sprite.animations.play("up", 5, false);
          this.actions.move('up', this.user, this.mapId, this.sprite.x, this.sprite.y);
        } else if (this.downKey.isDown) {
          this.sprite.body.velocity.y = this.speed;
          this.sprite.animations.play("down", 5, false);
          this.actions.move('down', this.user, this.mapId, this.sprite.x, this.sprite.y);
        } else if (this.leftKey.isDown) {
          this.sprite.body.velocity.x = -this.speed;
          this.sprite.animations.play("left", 5, false);
          this.actions.move('left', this.user, this.mapId, this.sprite.x, this.sprite.y);
        } else if (this.rightKey.isDown) {
          this.sprite.body.velocity.x = this.speed;
          this.sprite.animations.play("right", 5, false);
          this.actions.move('right', this.user, this.mapId, this.sprite.x, this.sprite.y);
        }
        this.sprite.bringToTop();
      };

      Hero.prototype._setControls = function() {
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        return this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      };

      return Hero;

    })();
    return Hero;
  });

}).call(this);
