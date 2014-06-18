(function() {
  define(function() {
    var Player, fontStyle;
    fontStyle = {
      font: "20px Arial",
      fill: "#ffffff",
      align: "left"
    };
    Player = (function() {
      function Player(game, phaser, meta) {
        this.game = game;
        this.phaser = phaser;
        this.meta = meta;
        this.sprite = null;
        this.user = null;
      }

      Player.prototype.preload = function() {
        return this.game.load.spritesheet("roshan", "images/roshan.png", 32, 48);
      };

      Player.prototype.create = function() {
        this.sprite = this.game.add.sprite(this.meta.x, this.meta.y, "roshan");
        this.game.physics.enable(this.sprite, this.phaser.Physics.ARCADE);
        this.sprite.body.bounce.set(1);
        this.sprite.animations.add("down", [0, 3], false);
        this.sprite.animations.add("left", [4, 7], false);
        this.sprite.animations.add("right", [8, 11], false);
        return this.sprite.animations.add("up", [12, 15], false);
      };

      Player.prototype.move = function(data) {
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

      Player.prototype.update = function() {
        this.sprite.bringToTop();
      };

      return Player;

    })();
    return Player;
  });

}).call(this);
