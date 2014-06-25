(function() {
  app.service('Enemy', function() {
    var Enemy;
    Enemy = {};
    return function(game, phaser, meta) {
      Enemy.game = game;
      Enemy.phaser = phaser;
      Enemy.meta = meta;
      Enemy.sprite = null;
      Enemy.direction = null;
      Enemy.speed = meta.speed;
      Enemy.margin = 50;
      Enemy.x = meta.x;
      Enemy.y = meta.y;
      Enemy.health = meta.health;
      Enemy.alive = true;
      Enemy.png = meta.png;
      Enemy.serverId = meta.id;
      Enemy.dbId = meta.dbId;
      Enemy.name = meta.name;
      Enemy.xp = meta.xp;
      Enemy.reportDirection = function() {
        var report;
        report = function() {
          return Enemy.game.enemyMoving({
            enemy: Enemy.serverId,
            _id: Enemy.dbId,
            x: Enemy.sprite.x,
            y: Enemy.sprite.y
          });
        };
        return Enemy.reportTimer = setInterval(report, 250);
      };
      Enemy.reportDirection = _.once(Enemy.reportDirection);
      Enemy.setDirection = function(num) {
        return Enemy.direction = num;
      };
      Enemy.clearDirection = function() {
        return Enemy.timer = setTimeout(function() {
          Enemy.direction = null;
          return Enemy.game.stopEnemy(Enemy);
        }, 500);
      };
      Enemy.derender = function() {
        Enemy.sprite.kill();
        clearInterval(Enemy.timer);
        return clearInterval(Enemy.reportTimer);
      };
      Enemy.damage = function() {
        Enemy.reportDirection();
        Enemy.game.damageEnemy(Enemy);
        if (Enemy.health <= 0) {
          Enemy.game.killEnemy(Enemy);
        }
        return true;
      };
      Enemy.preload = function() {
        return Enemy.game.load.atlasXML("enemy", "images/enemy.png", "images/enemy.xml");
      };
      Enemy.create = function() {
        Enemy.sprite = Enemy.game.add.sprite(Enemy.x, Enemy.y, "enemy");
        Enemy.game.physics.enable(Enemy.sprite, Enemy.phaser.Physics.ARCADE);
        Enemy.sprite.body.immovable = true;
        Enemy.sprite.body.collideWorldBounds = true;
        Enemy.sprite.body.setSize(Enemy.sprite.body.sourceWidth, Enemy.sprite.body.halfHeight, 0, Enemy.sprite.body.halfHeight);
        Enemy.sprite.animations.add("down", Phaser.Animation.generateFrameNames('enemy_move_down', 0, 10, '.png', 4), 30, false);
        Enemy.sprite.animations.add("left", Phaser.Animation.generateFrameNames('enemy_move_left', 0, 10, '.png', 4), 30, false);
        Enemy.sprite.animations.add("right", Phaser.Animation.generateFrameNames('enemy_move_right', 0, 10, '.png', 4), 30, false);
        return Enemy.sprite.animations.add("up", Phaser.Animation.generateFrameNames('enemy_move_up', 0, 10, '.png', 4), 30, false);
      };
      Enemy.update = function() {
        Enemy.sprite.body.velocity.x = 0;
        Enemy.sprite.body.velocity.y = 0;
        if (Enemy.direction === 0 && Enemy.sprite.y > Enemy.margin) {
          Enemy.sprite.body.velocity.y = -Enemy.speed;
          return Enemy.sprite.animations.play('up', 5, false);
        } else if (Enemy.direction === 1 && Enemy.sprite.y < Enemy.game.realHeight - Enemy.margin) {
          Enemy.sprite.body.velocity.y = Enemy.speed;
          return Enemy.sprite.animations.play('down', 5, false);
        } else if (Enemy.direction === 2 && Enemy.sprite.x > Enemy.margin) {
          Enemy.sprite.body.velocity.x = -Enemy.speed;
          return Enemy.sprite.animations.play('left', 5, false);
        } else if (Enemy.direction === 3 && Enemy.sprite.x < Enemy.game.realWidth - Enemy.margin) {
          Enemy.sprite.body.velocity.x = Enemy.speed;
          return Enemy.sprite.animations.play('right', 5, false);
        }
      };
      return Enemy;
    };
  });

}).call(this);
