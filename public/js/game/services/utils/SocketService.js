(function() {
  app.service('Socket', function(Player, Enemy, Messages) {
    return function(rootUrl, game, players, $, Phaser) {
      var mapId, socket, _derenderEnemyListener, _enemyListener, _joinListener, _leaveListener, _moveListener, _shootListener;
      socket = io.connect();
      window.socket = socket;
      mapId = game.mapId;
      game.on('derender enemy', function(data) {
        var creature, _i, _len, _ref, _results;
        console.log("time to derender", data);
        console.log(game.enemies);
        _ref = game.enemies;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          creature = _ref[_i];
          if (creature.serverId === data.enemy) {
            creature.alive = false;
            console.log(creature);
            _results.push(creature.sprite.kill());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
      game.on('move enemies', function(data) {
        var enemy, _i, _len, _ref, _results;
        _ref = game.enemies;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          enemy = _ref[_i];
          enemy.setDirection(data.num);
          _results.push(setTimeout(function() {
            return enemy.clearDirection();
          }, 500));
        }
        return _results;
      });
      game.on('enterMap', function() {
        var enemies, enemyId, enemyPositions;
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
      game.on('shoot', function(data) {
        return game.hero.renderMissiles(data.x, data.y, data.angle, data.num);
      });
      game.on('move', function(data) {
        return players[data.user].move(data);
      });
      game.on('player leave', function(user) {
        players[user].sprite.kill();
        return delete players[user];
      });
      game.on('changeMap', function(direction) {
        return game.leave(game.mapId, game.user);
      });
      game.on('player joined', function(data) {
        var player;
        player = Player(game, Phaser, {
          x: data.x,
          y: data.y
        });
        player.user = data.user;
        player.preload();
        player.create();
        return players[player.user] = player;
      });
      game.on('i joined', function(data) {
        var creature, enemy, i, num, other, player, x, y, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
        _ref = data.others;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          other = _ref[_i];
          player = Player(game, Phaser, {
            x: other.x,
            y: other.y
          });
          player.user = other.user;
          player.preload();
          player.create();
          players[player.user] = player;
        }
        _ref1 = game.enemies;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          enemy = _ref1[_j];
          enemy.derender();
        }
        data.enemies = data.enemies || [];
        game.enemies = [];
        _ref2 = data.enemies;
        _results = [];
        for (i = _k = 0, _len2 = _ref2.length; _k < _len2; i = ++_k) {
          creature = _ref2[i];
          _results.push((function() {
            var _l, _ref3, _results1;
            _results1 = [];
            for (num = _l = 0, _ref3 = creature.count; 0 <= _ref3 ? _l < _ref3 : _l > _ref3; num = 0 <= _ref3 ? ++_l : --_l) {
              console.log("Creating new enemy, " + num);
              x = +game.enemyPositions[creature.data._id][i][0];
              y = +game.enemyPositions[creature.data._id][i][1];
              enemy = Enemy(i, game, Phaser, {
                rank: 1,
                health: creature.data.health,
                dmg: 1,
                png: creature.data.png,
                speed: creature.data.speed,
                x: x,
                y: y,
                id: num
              });
              enemy.create();
              _results1.push(game.enemies.push(enemy));
            }
            return _results1;
          })());
        }
        return _results;
      });
      game.killEnemy = function(enemy) {
        console.log("enemy dies", enemy);
        return socket.emit('enemyDies', {
          enemy: enemy.serverId,
          mapId: game.mapId
        });
      };
      _derenderEnemyListener = function() {
        return socket.on('derenderEnemy', function(data) {
          console.log('time to derender', data.enemy);
          return game.trigger('derender enemy', data);
        });
      };
      game.shoot = function(user, mapId, x, y, angle, num) {
        return socket.emit('shoot', {
          user: user,
          mapId: mapId,
          x: x,
          y: y,
          angle: angle,
          num: num
        });
      };
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
      game.leave = function() {
        return socket.emit('leave', {
          user: game.user,
          mapId: game.mapId
        });
      };
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
      _shootListener = function(user) {
        return socket.on('shoot', function(data) {
          if (data.user !== game.user) {
            return game.trigger('shoot', data);
          }
        });
      };
      _leaveListener = function(mapId, user) {
        return socket.on('leave', function(data) {
          if (data.user !== game.user) {
            return game.trigger('player leave', data.user);
          }
        });
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
      _moveListener = function(user) {
        return socket.on('move', function(data) {
          if (data.user !== game.user) {
            return game.trigger('move', data);
          }
        });
      };
      _enemyListener = function() {
        return socket.on('move enemies', function(data) {
          return game.trigger('move enemies', data);
        });
      };
      _leaveListener(mapId, game.user);
      _moveListener(game.user);
      _shootListener(game.user);
      _enemyListener();
      return _derenderEnemyListener();
    };
  });

}).call(this);
