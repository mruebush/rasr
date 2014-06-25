(function() {
  app.factory('Socket', function(Player, Enemy, Messages, SERVER_URL) {
    return function(rootUrl, game, players, Phaser) {
      var mapId, socket, _damageEnemyListener, _derenderEnemyListener, _enemyListener, _enemyMovingListener, _gameOverListener, _joinListener, _leaveListener, _levelUpListener, _messageListener, _moveListener, _shootListener;
      socket = io.connect(SERVER_URL, {
        'sync disconnect on unload': true
      });
      window.socket = socket;
      window.players = players;
      mapId = game.mapId;
      game.on('login', function() {
        return socket.emit('login', game.user);
      });
      game.on('enterMap', function() {
        var enemies, enemyId, enemyPositions;
        console.log('trigger enterMap');
        game.enemyData = game.mapData.enemies || [];
        enemies = [];
        enemyPositions = {};
        for (enemyId in game.enemyData) {
          enemies.push({
            id: enemyId,
            count: game.enemyData[enemyId].count
          });
          enemyPositions[enemyId] = game.enemyData[enemyId].positions;
        }
        game.enemyPositions = enemyPositions;
        return game.join({
          mapId: game.mapId,
          x: game.hero.sprite.x,
          y: game.hero.sprite.y,
          enemies: enemies,
          positions: enemyPositions
        });
      });
      game.on('changeMap', function(direction) {
        var key, player;
        game.leave(game.mapId, game.user);
        socket.removeListener(game.mapId);
        for (key in players) {
          player = players[key];
          player.sprite.kill();
        }
        return players = {};
      });
      game.on('move', function(data) {
        if (players[data.user]) {
          return players[data.user].move(data);
        }
      });
      game.gameOver = function() {
        console.log("trigger game.gameOver");
        return socket.emit('gameOver', {
          user: game.user,
          room: game.mapId
        });
      };
      _gameOverListener = function() {
        return socket.on('gameOver', function(data) {
          return game.trigger('player leave', data.user);
        });
      };
      _gameOverListener();
      game.enemyMoving = function(data) {
        data.room = game.mapId;
        return socket.emit('enemyMoving', data);
      };
      _enemyMovingListener = function() {
        return socket.on('enemyMoving', function(data) {
          return game.trigger('enemyMoving', data);
        });
      };
      game.on('enemyMoving', function(data) {
        var enemy;
        enemy = game.enemies[data.serverId];
        if (enemy) {
          return enemy.setDirection(data.dir);
        }
      });
      _enemyMovingListener();
      game.on('levelUp', function(data) {
        return game.hero.speed += data.speed;
      });
      _levelUpListener = function() {
        return socket.on('levelUp', function(data) {
          if (data.user === game.user) {
            return game.trigger('levelUp', data);
          }
        });
      };
      game.killEnemy = function(enemy) {
        return socket.emit('enemyDies', {
          enemy: enemy.serverId,
          mapId: game.mapId,
          _id: enemy.dbId,
          user: game.user,
          enemyName: enemy.name,
          xp: enemy.xp
        });
      };
      game.on('derender enemy', function(data) {
        if (game.enemies[data.enemy]) {
          game.enemies[data.enemy].alive = false;
          game.enemies[data.enemy].sprite.kill();
          return game.enemies.splice(data.enemy, 1);
        }
      });
      _derenderEnemyListener = function() {
        return socket.on('derenderEnemy', function(data) {
          return game.trigger('derender enemy', data);
        });
      };
      game.damageEnemy = function(enemy) {
        return socket.emit('damageEnemy', {
          enemy: enemy.serverId,
          room: game.mapId,
          _id: enemy.dbId,
          user: game.user
        });
      };
      _damageEnemyListener = function() {
        return socket.on('damageEnemy', function(data) {
          return game.trigger('damageEnemy', data);
        });
      };
      game.on('damageEnemy', function(data) {
        return game.enemies[data.serverId].health--;
      });
      game.stopEnemy = function(enemy) {
        return socket.emit('stopEnemy', {
          enemy: enemy.serverId,
          room: game.mapId,
          _id: enemy.dbId,
          x: enemy.sprite.x,
          y: enemy.sprite.y
        });
      };
      game.shoot = function(user, mapId, x, y, angle, num, dir) {
        return socket.emit('shoot', {
          user: user,
          mapId: mapId,
          x: x,
          y: y,
          angle: angle,
          num: num,
          dir: dir
        });
      };
      _shootListener = function(user) {
        return socket.on('shoot', function(data) {
          if (data.user !== game.user) {
            return game.trigger('shoot', data);
          }
        });
      };
      game.on('shoot', function(data) {
        game.hero.renderMissiles(data.x, data.y, data.angle, data.num);
        return players[data.user].animateShoot(data.dir);
      });
      game.logout = function(x, y) {
        return socket.emit('logout', {
          user: game.user,
          mapId: game.mapId,
          x: x,
          y: y
        });
      };
      game.join = function(data) {
        var enemies, positions, x, y;
        x = data.x;
        y = data.y;
        enemies = data.enemies;
        positions = data.positions;
        socket.emit('join', {
          user: game.user,
          mapId: game.mapId,
          x: x,
          y: y,
          enemies: enemies,
          positions: positions
        });
        return _joinListener(game.user);
      };
      _joinListener = function(user) {
        return socket.on(game.mapId, function(data) {
          if (data.user !== game.user) {
            return game.trigger('player joined', data);
          } else {
            return game.trigger('i joined', data);
          }
        });
      };
      game.on('player joined', function(data) {
        var player;
        console.log('trigger player joined');
        player = new Player(game, Phaser, {
          x: data.x,
          y: data.y
        });
        player.user = data.user;
        player.preload();
        player.create();
        return players[player.user] = player;
      });
      game.on('i joined', function(data) {
        var creature, enemy, enemyType, i, num, other, player, type, _i, _j, _len, _len1, _ref, _ref1, _results;
        _ref = data.others;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          other = _ref[_i];
          player = new Player(game, Phaser, {
            x: other.x,
            y: other.y
          });
          player.user = other.user;
          player.preload();
          player.create();
          players[player.user] = player;
          console.log(player);
        }
        _ref1 = game.enemies;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          enemy = _ref1[_j];
          enemy.derender();
        }
        data.enemies = data.enemies || [];
        game.enemies = [];
        _results = [];
        for (enemyType in data.enemies) {
          type = data.enemies[enemyType];
          num = 0;
          _results.push((function() {
            var _results1;
            _results1 = [];
            for (i in type) {
              creature = type[i];
              enemy = new Enemy(game, Phaser, {
                rank: 1,
                health: creature.health,
                dmg: 1,
                png: creature.png,
                speed: creature.speed,
                x: +creature.position[0],
                y: +creature.position[1],
                id: num,
                dbId: creature._id,
                name: creature.name,
                xp: creature.xp
              });
              enemy.create();
              game.enemies.push(enemy);
              _results1.push(num++);
            }
            return _results1;
          })());
        }
        return _results;
      });
      game.leave = function() {
        return socket.emit('leave', {
          user: game.user,
          mapId: game.mapId
        });
      };
      _leaveListener = function(mapId, user) {
        return socket.on('leave', function(data) {
          if (data.user !== game.user) {
            return game.trigger('player leave', data.user);
          }
        });
      };
      game.on('player leave', function(user) {
        if (players[user]) {
          players[user].sprite.kill();
          return delete players[user];
        } else {
          return game.hero.sprite.kill();
        }
      });
      game.message = function(message) {
        return socket.emit('message', {
          user: game.user,
          message: message
        });
      };
      game.move = function(data) {
        return socket.emit('move', {
          dir: data.dir,
          user: game.user,
          room: game.mapId,
          x: data.x,
          y: data.y
        });
      };
      _moveListener = function(user) {
        return socket.on('move', function(data) {
          if (data.user !== game.user) {
            return game.trigger('move', data);
          }
        });
      };
      _messageListener = function() {
        return socket.on('message', function(data) {
          return game.addChat(data);
        });
      };
      _enemyListener = function() {
        return socket.on('move enemies', function(data) {
          return game.trigger('move enemies', data);
        });
      };
      game.on('move enemies', function(data) {
        var enemy, i, nums, _i, _len, _ref, _results;
        nums = data.nums;
        _ref = game.enemies;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          enemy = _ref[i];
          enemy.setDirection(nums[i].dir);
          if (nums[i].passive) {
            _results.push(enemy.clearDirection());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
      _leaveListener(mapId, game.user);
      _moveListener(game.user);
      _shootListener(game.user);
      _damageEnemyListener();
      _enemyListener();
      _messageListener();
      _derenderEnemyListener();
      return _levelUpListener();
    };
  });

}).call(this);
