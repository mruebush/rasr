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
      hero: 'entity/hero',
      enemy: 'entity/enemy',
      map: 'map/map',
      events: 'utils/events',
      socket: 'utils/socket'
    }
  });

  require(['hero', 'map', 'enemy', 'events', 'socket', 'phaser'], function(Hero, Map, Enemy, events, socket, Phaser) {
    var app, collisionHandler, create, createEnemies, downScreen, enemies, game, hero, initialMap, leftScreen, map, mapId, preload, rightScreen, rootUrl, upScreen, update, user;
    app = events({});
    game = null;
    hero = null;
    map = null;
    enemies = [];
    mapId = null;
    initialMap = null;
    upScreen = null;
    rightScreen = null;
    downScreen = null;
    leftScreen = null;
    rootUrl = 'http://g4m3.azurewebsites.net';
    user = 'test';
    preload = function() {
      hero = events(new Hero(game, Phaser, {
        exp: 150,
        health: 100,
        mana: 100,
        str: 10,
        dex: 10,
        int: 10,
        luk: 10
      }));
      map = events(new Map(game, Phaser, mapId));
      map.on('borderChange', function(border, exists) {
        return game.physics.arcade.checkCollision[border.split('Screen')[0]] = !exists;
      });
      hero.preload(null, initialMap);
      map.preload();
      app.trigger('create');
      app.isLoaded = true;
      return createEnemies(4);
    };
    create = function() {
      var enemy, index, _i, _len, _results;
      map.create();
      hero.create();
      map.on('finishLoad', function() {
        var enemy, _i, _len;
        hero.sprite.bringToTop();
        for (_i = 0, _len = enemies.length; _i < _len; _i++) {
          enemy = enemies[_i];
          enemy.sprite.bringToTop();
        }
        return app.isLoaded = true;
      });
      hero.on('changeMap', function(direction) {
        app.isLoaded = false;
        map.reload(direction, hero);
        return createEnemies(4);
      });
      _results = [];
      for (index = _i = 0, _len = enemies.length; _i < _len; index = ++_i) {
        enemy = enemies[index];
        _results.push(enemy.create());
      }
      return _results;
    };
    update = function() {
      var enemy, _i, _len, _results;
      if (app.isLoaded) {
        map.update();
        hero.update();
        _results = [];
        for (_i = 0, _len = enemies.length; _i < _len; _i++) {
          enemy = enemies[_i];
          if (enemy.alive) {
            game.physics.arcade.collide(hero.sprite, enemy.sprite, collisionHandler, null, enemy);
            _results.push(enemy.update());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };
    collisionHandler = function(heroSprite, enemySprite) {
      console.log('kill enemy', this);
      return this.damage();
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
      var actions;
      mapId = playerInfo.mapId;
      actions = socket(rootUrl);
      actions.join(mapId, user);
      return game = new Phaser.Game(800, 600, Phaser.AUTO, "", {
        preload: preload,
        create: create,
        update: update
      });
    });
  });

}).call(this);
