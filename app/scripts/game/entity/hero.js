(function() {
  define(function() {
    var Player, fontStyle;
    fontStyle = {
      font: "20px Arial",
      fill: "#ffffff",
      align: "left"
    };
    Player = (function() {
      var expText, healthText, manaText;

      expText = null;

      healthText = null;

      manaText = null;

      function Player(game, phaser, meta) {
        this.game = game;
        this.phaser = phaser;
        this.meta = meta;
        this.sprite = null;
        this.upKey = null;
        this.downKey = null;
        this.leftKey = null;
        this.rightKey = null;
      }

      Player.prototype.preload = function() {
        return this.game.load.spritesheet("roshan", "images/roshan.png", 32, 48);
      };

      Player.prototype.create = function() {
        this.sprite = this.game.add.sprite(250, 250, "roshan");
        this.game.physics.enable(this.sprite, this.phaser.Physics.ARCADE);
        this.sprite.body.bounce.set(1);
        this.expText = this.game.add.text(20, 10, "exp: " + this.meta.exp, fontStyle);
        this.healthText = this.game.add.text(20, 30, "health: " + this.meta.health, fontStyle);
        this.mana = this.game.add.text(20, 50, "mana: " + this.meta.mana, fontStyle);
        this.sprite.animations.add("down", [0, 3], false);
        this.sprite.animations.add("left", [4, 7], false);
        this.sprite.animations.add("right", [8, 11], false);
        this.sprite.animations.add("up", [12, 15], false);
        return this._setControls();
      };

      Player.prototype.update = function() {
        if (this.sprite.x === 0) {
          this.sprite.x = this.game.width - 20;
          this.trigger('changeMap', 'left');
        }
        if (this.sprite.x === this.game.width) {
          this.sprite.x = 10;
          this.trigger('changeMap', 'right');
        }
        if (this.sprite.y === 0) {
          this.sprite.y = this.game.height - 20;
          this.trigger('changeMap', 'up');
        }
        if (this.sprite.y === this.game.height) {
          this.sprite.y = 10;
          this.trigger('changeMap', 'down');
        }
        if (this.upKey.isDown) {
          this.sprite.y -= 2;
          this.sprite.animations.play("up", 5, false);
        } else if (this.downKey.isDown) {
          this.sprite.y += 2;
          this.sprite.animations.play("down", 5, false);
        }
        if (this.leftKey.isDown) {
          this.sprite.x -= 2;
          this.sprite.animations.play("left", 5, false);
        } else if (this.rightKey.isDown) {
          this.sprite.x += 2;
          this.sprite.animations.play("right", 5, false);
        }
        this.sprite.bringToTop();
      };

      Player.prototype._setControls = function() {
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        return this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      };

      Player.prototype.takeDmg = function(hero, enemy) {
        this.meta.health -= 10;
        return this.healthText.text = "health: " + this.meta.health;
      };

      return Player;

    })();
    return Player;
  });

}).call(this);
