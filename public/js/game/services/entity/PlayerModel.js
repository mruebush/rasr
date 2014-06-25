(function() {
  app.factory('Player', function() {
    var Player;
    Player = {};
    return function(game, phaser, meta) {
      Player.game = game;
      Player.phaser = phaser;
      Player.meta = meta;
      Player.sprite = null;
      Player.user = null;
      Player.preload = function() {
        Player.game.load.atlasXML("player", "assets/player.png", "assets/player.xml");
        return Player.game.load.image('arrow', 'assets/bullet.png');
      };
      Player.create = function() {
        Player.sprite = Player.game.add.sprite(Player.meta.x, Player.meta.y, "player");
        Player.game.physics.enable(Player.sprite, Player.phaser.Physics.ARCADE);
        Player.sprite.body.collideWorldBounds = true;
        Player.sprite.body.bounce.set(1);
        Player.sprite.animations.add("down", Phaser.Animation.generateFrameNames('player_walk_down', 0, 11, '.png', 4), 30, false);
        Player.sprite.animations.add("left", Phaser.Animation.generateFrameNames('player_walk_left', 0, 11, '.png', 4), 30, false);
        Player.sprite.animations.add("right", Phaser.Animation.generateFrameNames('player_walk_right', 0, 11, '.png', 4), 30, false);
        Player.sprite.animations.add("up", Phaser.Animation.generateFrameNames('player_walk_up', 0, 11, '.png', 4), 30, false);
        Player.sprite.animations.add("attack_down", Phaser.Animation.generateFrameNames('player_attack_down', 0, 4, '.png', 4), 15, false);
        Player.sprite.animations.add("attack_left", Phaser.Animation.generateFrameNames('player_attack_left', 0, 4, '.png', 4), 15, false);
        Player.sprite.animations.add("attack_right", Phaser.Animation.generateFrameNames('player_attack_right', 0, 4, '.png', 4), 15, false);
        return Player.sprite.animations.add("attack_up", Phaser.Animation.generateFrameNames('player_attack_up', 0, 4, '.png', 4), 15, false);
      };
      Player.move = function(data) {
        var dir;
        dir = data.dir;
        Player.sprite.y = data.y;
        Player.sprite.x = data.x;
        if (dir === 'up') {
          Player.sprite.animations.play("up", 5, false);
        } else if (dir === 'down') {
          Player.sprite.animations.play("down", 5, false);
        }
        if (dir === 'left') {
          Player.sprite.animations.play("left", 5, false);
        } else if (dir === 'right') {
          Player.sprite.animations.play("right", 5, false);
        }
        return Player.update();
      };
      Player.update = function() {
        Player.sprite.bringToTop();
      };
      return Player;
    };
  });

}).call(this);
