(function() {
  'use strict';
  require.config({
    shim: {
      'socketio': {
        exports: 'io'
      },
      'phaser': {
        exports: 'Phaser'
      }
    },
    paths: {
      jquery: '../../bower_components/jquery/dist/jquery',
      backbone: '../../bower_components/backbone/backbone',
      underscore: '../../bower_components/underscore/underscore',
      socketio: '../../bower_components/socket.io-client/socket.io',
      phaser: '../../bower_components/phaser/phaser',
      arrows: 'entity/arrows',
      hero: 'entity/hero',
      enemy: 'entity/enemy',
      map: 'map/map',
      events: 'utils/events',
      socket: 'utils/socket',
      player: 'entity/player'
    }
  });

  require(['hero', 'map', 'enemy', 'events', 'socket', 'phaser', 'player'], function(Hero, Map, Enemy, events, socket, Phaser, Player) {
    var actions, app, arrowEnemy, create, createEnemies, downScreen, enemies, game, hero, hurtHero, initPos, initialMap, leftScreen, map, mapId, players, preload, rightScreen, rootUrl, upScreen, update, user;
    app = events({});
    game = null;
    hero = null;
    map = null;
    enemies = [];
    players = events({});
    mapId = null;
    initialMap = null;
    upScreen = null;
    rightScreen = null;
    downScreen = null;
    leftScreen = null;
    rootUrl = 'http://g4m3.azurewebsites.net';
    user = prompt('Fullen Sie das user bitte !');
    initPos = {};
    actions = {};
    preload = function() {
      hero = events(new Hero(game, Phaser, {
        exp: 150,
        health: 100,
        mana: 100,
        str: 10,
        dex: 10,
        int: 10,
        luk: 10,
        x: initPos.x,
        y: initPos.y
      }));
      window.hero = hero;
      map = events(new Map(game, Phaser, mapId));
      game.physics.arcade.checkCollision.up = false;
      game.physics.arcade.checkCollision.right = false;
      game.physics.arcade.checkCollision.down = false;
      game.physics.arcade.checkCollision.left = false;
      map.on('borderChange', function(border, exists) {
        return game.physics.arcade.checkCollision[border.split('Screen')[0]] = !exists;
      });
      hero.actions = actions;
      hero.user = user;
      hero.preload(null, initialMap);
      hero.set('mapId', mapId);
      map.preload();
      app.trigger('create');
      app.isLoaded = true;
      createEnemies(4);
      players.on('join', function(data) {
        var player;
        player = new Player(game, Phaser, {
          x: data.x,
          y: data.y
        });
        player.user = data.user;
        player.preload();
        player = events(player);
        player.on('move', function(data) {
          return player.move(data.dir);
        });
        return players.trigger('create', player);
      });
      return hero.actions.on('others', function(data) {
        var index, other, _i, _len, _ref, _results;
        _ref = data.others;
        _results = [];
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          other = _ref[index];
          console.log("" + other.user + " joined the map on " + other.x + "," + other.y);
          _results.push(players.trigger('join', {
            user: other.user,
            x: other.x,
            y: other.y
          }));
        }
        return _results;
      });
    };
    create = function() {
      var enemy, index, _i, _len;
      map.create();
      hero.create();
      hero.on('changeMap', function(direction) {
        app.isLoaded = false;
        console.log("Leave " + hero.mapId);
        hero.actions.leave(hero.mapId, user);
        console.log('Left map');
        map.reload(direction, hero);
        return createEnemies(4);
      });
      players.on('create', function(player) {
        player.create();
        return players[player.user] = player;
      });
      hero.actions.on('move', function(data) {
        return players[data.user].trigger('move', data);
      });
      map.on('finishLoad', function() {
        var enemy, _i, _len;
        hero.sprite.bringToTop();
        hero.arrows.forEach(function(arrow) {
          return arrow.bringToTop();
        });
        for (_i = 0, _len = enemies.length; _i < _len; _i++) {
          enemy = enemies[_i];
          enemy.sprite.bringToTop();
        }
        return app.isLoaded = true;
      });
      for (index = _i = 0, _len = enemies.length; _i < _len; index = ++_i) {
        enemy = enemies[index];
        enemy.create();
      }
      return hero.actions.join(mapId, user, initPos);
    };
    update = function() {
      var enemy, player, _i, _len, _results;
      if (app.isLoaded) {
        map.update();
        hero.update();
        for (_i = 0, _len = enemies.length; _i < _len; _i++) {
          enemy = enemies[_i];
          if (enemy.alive) {
            game.physics.arcade.collide(hero.sprite, enemy.sprite, hurtHero, null, hero);
            game.physics.arcade.collide(hero.arrows, enemy.sprite, arrowEnemy, null, enemy);
            enemy.update();
          }
        }
        _results = [];
        for (player in players) {
          if (player.update) {
            _results.push(player.update());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };
    hurtHero = function(enemySprite, heroSprite) {
      return this.damage();
    };
    arrowEnemy = function(enemySprite, arrow) {
      console.log('kill enemy', this);
      this.damage();
      return arrow.kill();
    };
    createEnemies = function(num) {
      var enemy, i, _i, _results;
      enemies = [];
      _results = [];
      for (i = _i = 0; 0 <= num ? _i < num : _i > num; i = 0 <= num ? ++_i : --_i) {
        enemy = new Enemy(i, game, Phaser, {
          rank: 1,
          health: 10,
          dmg: 1
        });
        enemy.preload();
        enemy.create();
        _results.push(enemies.push(enemy));
      }
      return _results;
    };
    return $.ajax({
      url: "" + rootUrl + "/player/" + user
    }).done(function(playerInfo) {
      var url;
      mapId = playerInfo.mapId;
      initPos.x = playerInfo.x;
      initPos.y = playerInfo.y;
      actions = socket(rootUrl, events);
      url = "" + rootUrl + "/screen/" + mapId;
      return $.ajax({
        url: url
      }).done(function(mapData) {
        initialMap = mapData;
        return game = new Phaser.Game(800, 600, Phaser.AUTO, "", {
          preload: preload,
          create: create,
          update: update
        });
      });
    });
  });

}).call(this);
