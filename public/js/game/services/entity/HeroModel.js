(function() {
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

    numArrows = 50;

    numArrowsShot = 5;

    Hero.prototype.damage = function() {
      this.sprite.animations.play('damage_down', 15, false);
      this.meta.health--;
      return this.render();
    };

    Hero.prototype.render = function() {
      return this.game.debug.text("health: " + this.meta.health, 20, 30, fontStyle);
    };

    function Hero(game, phaser, meta) {
      this.game = game;
      this.phaser = phaser;
      this.meta = meta;
      this.sprite = null;
      this.speed = 200;
      this.startOnScreenPos = 10;
      this.png = this.meta.png;
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
      this.game.load.atlasXML("player", "images/player.png", "images/player.xml");
      return this.game.load.image('arrow', 'images/bullet.png');
    };

    Hero.prototype.create = function() {
      var mana;
      this.sprite = this.game.add.sprite(this.meta.x, this.meta.y, "player");
      this.game.physics.enable(this.sprite, this.phaser.Physics.ARCADE);
      this.sprite.body.collideWorldBounds = true;
      this.sprite.body.bounce.set(1);
      expText = this.game.add.text(20, 10, "exp: " + this.meta.exp, fontStyle);
      this.render();
      mana = this.game.add.text(20, 50, "mana: " + this.meta.mana, fontStyle);
      this.sprite.animations.add("down", Phaser.Animation.generateFrameNames('player_walk_down', 0, 11, '.png', 4), 30, false);
      this.sprite.animations.add("left", Phaser.Animation.generateFrameNames('player_walk_left', 0, 11, '.png', 4), 30, false);
      this.sprite.animations.add("right", Phaser.Animation.generateFrameNames('player_walk_right', 0, 11, '.png', 4), 30, false);
      this.sprite.animations.add("up", Phaser.Animation.generateFrameNames('player_walk_up', 0, 11, '.png', 4), 30, false);
      this.sprite.animations.add("attack_down", Phaser.Animation.generateFrameNames('player_attack_down', 0, 4, '.png', 4), 15, false);
      this.sprite.animations.add("attack_left", Phaser.Animation.generateFrameNames('player_attack_left', 0, 4, '.png', 4), 15, false);
      this.sprite.animations.add("attack_right", Phaser.Animation.generateFrameNames('player_attack_right', 0, 4, '.png', 4), 15, false);
      this.sprite.animations.add("attack_up", Phaser.Animation.generateFrameNames('player_attack_up', 0, 4, '.png', 4), 15, false);
      this.sprite.animations.add("damage_down", Phaser.Animation.generateFrameNames('player_take_damage_from_down', 0, 10, '.png', 4), 30, false);
      this.sprite.animations.add("damage_left", Phaser.Animation.generateFrameNames('player_take_damage_from_left', 0, 10, '.png', 4), 30, false);
      this.sprite.animations.add("damage_right", Phaser.Animation.generateFrameNames('player_take_damage_from_right', 0, 10, '.png', 4), 30, false);
      this.sprite.animations.add("damage_up", Phaser.Animation.generateFrameNames('player_take_damage_from_up', 0, 10, '.png', 4), 30, false);
      this._setControls();
      return this.createArrows();
    };

    Hero.prototype.update = function() {
      this.sprite.body.velocity.x = 0;
      this.sprite.body.velocity.y = 0;
      if (this.sprite.x < 0) {
        this.sprite.x = this.game.realWidth - this.startOnScreenPos;
        this.game.trigger('changeMap', 'left');
      }
      if (this.sprite.x > this.game.realWidth) {
        this.sprite.x = this.startOnScreenPos;
        this.game.trigger('changeMap', 'right');
      }
      if (this.sprite.y < 0) {
        this.sprite.y = this.game.realHeight - this.startOnScreenPos;
        this.game.trigger('changeMap', 'up');
      }
      if (this.sprite.y > this.game.realHeight) {
        this.sprite.y = this.startOnScreenPos;
        this.game.trigger('changeMap', 'down');
      }
      if (this.upKey.isDown) {
        this.sprite.body.velocity.y = -this.speed;
        this.sprite.animations.play("up", 30, false);
        this.directionFacing = 'up';
        this.game.move({
          dir: 'up',
          x: this.sprite.x,
          y: this.sprite.y
        });
      } else if (this.downKey.isDown) {
        this.sprite.body.velocity.y = this.speed;
        this.sprite.animations.play("down", 30, false);
        this.directionFacing = 'down';
        this.game.move({
          dir: 'down',
          x: this.sprite.x,
          y: this.sprite.y
        });
      } else if (this.leftKey.isDown) {
        this.sprite.body.velocity.x = -this.speed;
        this.sprite.animations.play("left", 30, false);
        this.directionFacing = 'left';
        this.game.move({
          dir: 'left',
          x: this.sprite.x,
          y: this.sprite.y
        });
      } else if (this.rightKey.isDown) {
        this.sprite.body.velocity.x = this.speed;
        this.sprite.animations.play("right", 30, false);
        this.directionFacing = 'right';
        this.game.move({
          dir: 'right',
          x: this.sprite.x,
          y: this.sprite.y
        });
      } else if (this.spaceBar.isDown) {
        this.sprite.animations.play("attack_" + this.directionFacing, 15, false);
        this.fire();
      }
    };

    Hero.prototype.renderMissiles = function(x, y, angle, num) {
      var arrow, i, thisAngle, _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= num ? _i < num : _i > num; i = 0 <= num ? ++_i : --_i) {
        arrow = this.arrows.children[arrowIndex];
        arrow.reset(x, y);
        thisAngle = angle + (i - 2) * 0.2;
        arrow.rotation = this.game.physics.arcade.moveToXY(arrow, x + Math.sin(thisAngle), y + Math.cos(thisAngle), arrowSpeed);
        _results.push(arrowIndex = (arrowIndex + 1) % numArrows);
      }
      return _results;
    };

    Hero.prototype.fire = function() {
      var baseAngle;
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
        this.game.shoot(this.game.user, this.game.mapId, this.sprite.x, this.sprite.y, baseAngle, numArrowsShot);
        this.renderMissiles(this.sprite.x, this.sprite.y, baseAngle, numArrowsShot);
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

}).call(this);
