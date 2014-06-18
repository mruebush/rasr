(function() {
  define(['arrows'], function(Arrows) {
    var Hero, fontStyle;
    fontStyle = {
      font: "20px Arial",
      fill: "#ffffff",
      align: "left"
    };
    Hero = (function() {
      var arrowIndex, arrowSpeed, expText, fireRate, healthText, manaText, nextFire, numArrows, numArrowsShot;

      expText = null;

      healthText = null;

      manaText = null;

      fireRate = 400;

      nextFire = 0;

      arrowIndex = 0;

      arrowSpeed = 600;

      numArrows = 30;

      numArrowsShot = 5;

      Hero.prototype.set = function(property, value) {
        return this[property] = value;
      };

      Hero.prototype.damage = function() {
        this.meta.health--;
        return console.log(healthText);
      };

      Hero.prototype.render = function() {
        return this.game.debug.text("health: " + this.meta.health, 20, 30, fontStyle);
      };

      function Hero(game, phaser, meta) {
        this.game = game;
        this.phaser = phaser;
        this.meta = meta;
        this.sprite = null;
        this.speed = 400;
        this.startOnScreenPos = 10;
        this.upKey = null;
        this.downKey = null;
        this.leftKey = null;
        this.rightKey = null;
        this.spaceBar = null;
        this.directionFacing = 'up';
      }

      Hero.prototype.createArrows = function() {
        this.arrows = this.game.add.group();
        this.arrows.enableBody = true;
        this.arrows.physicsBodyType = Phaser.Physics.ARCADE;
        this.arrows.createMultiple(numArrows, 'arrow', 0, false);
        this.arrows.setAll('anchor.x', 0.5);
        this.arrows.setAll('anchor.y', 0.5);
        this.arrows.setAll('outOfBoundsKill', true);
        return this.arrows.setAll('checkWorldBounds', true);
      };

      Hero.prototype.preload = function() {
        this.game.load.spritesheet("roshan", "images/roshan.png", 32, 48);
        return this.game.load.image('arrow', 'images/bullet.png');
      };

      Hero.prototype.create = function() {
        var mana;
        this.sprite = this.game.add.sprite(this.meta.x, this.meta.y, "roshan");
        this.game.physics.enable(this.sprite, this.phaser.Physics.ARCADE);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.bounce.set(1);
        expText = this.game.add.text(20, 10, "exp: " + this.meta.exp, fontStyle);
        mana = this.game.add.text(20, 50, "mana: " + this.meta.mana, fontStyle);
        this.sprite.animations.add("down", [0, 3], false);
        this.sprite.animations.add("left", [4, 7], false);
        this.sprite.animations.add("right", [8, 11], false);
        this.sprite.animations.add("up", [12, 15], false);
        this._setControls();
        return this.createArrows();
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
          this.directionFacing = 'up';
        } else if (this.downKey.isDown) {
          this.sprite.body.velocity.y = this.speed;
          this.sprite.animations.play("down", 5, false);
          this.directionFacing = 'down';
        } else if (this.leftKey.isDown) {
          this.sprite.body.velocity.x = -this.speed;
          this.sprite.animations.play("left", 5, false);
          this.directionFacing = 'left';
        } else if (this.rightKey.isDown) {
          this.sprite.body.velocity.x = this.speed;
          this.sprite.animations.play("right", 5, false);
          this.directionFacing = 'right';
        }
        if (this.spaceBar.isDown) {
          console.log('space bar is down');
          this.fire();
        }
      };

      Hero.prototype.fire = function() {
        var arrow, baseAngle, i, thisAngle, _i;
        if (this.game.time.now > nextFire) {
          if (this.directionFacing === 'up') {
            baseAngle = Math.PI;
          } else if (this.directionFacing === 'right') {
            baseAngle = Math.PI / 2;
          } else if (this.directionFacing === 'down') {
            baseAngle = 0;
          } else if (this.directionFacing === 'left') {
            baseAngle = -Math.PI / 2;
          }
          for (i = _i = 0; 0 <= numArrowsShot ? _i < numArrowsShot : _i > numArrowsShot; i = 0 <= numArrowsShot ? ++_i : --_i) {
            arrow = this.arrows.children[arrowIndex];
            arrow.reset(this.sprite.x, this.sprite.y);
            console.log(arrow);
            arrow.bringToTop();
            console.log(arrow);
            thisAngle = baseAngle + (i - 2) * 0.2;
            console.log(thisAngle);
            arrow.rotation = this.game.physics.arcade.moveToXY(arrow, this.sprite.x + 1000 * Math.sin(thisAngle), this.sprite.y + 1000 * Math.cos(thisAngle), arrowSpeed);
            arrowIndex = (arrowIndex + 1) % numArrows;
          }
          return nextFire = this.game.time.now + fireRate;
        }
      };

      Hero.prototype._setControls = function() {
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        return this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      };

      return Hero;

    })();
    return Hero;
  });

}).call(this);
