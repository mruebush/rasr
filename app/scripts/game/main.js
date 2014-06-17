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
    var app, collisionHandler, create, enemies, game, hero, initialMap, map, mapId, preload, rootUrl, takeDmg, update, user;
    app = events({});
    game = null;
    hero = null;
    map = null;
    enemies = [];
    mapId = null;
    initialMap = null;
    rootUrl = 'http:localhost:9000';
    user = "test";
    preload = function() {
      var enemy, i, _i, _results;
      hero = events(new Hero(game, Phaser, {
        exp: 150,
        health: 100,
        mana: 100,
        str: 10,
        dex: 10,
        int: 10,
        luk: 10
      }));
      map = new Map(game, Phaser, mapId);
      map = events(map);
      hero.preload(null, initialMap);
      map.preload('screen', initialMap);
      app.trigger('create');
      app.isLoaded = true;
      _results = [];
      for (i = _i = 0; _i < 14; i = ++_i) {
        enemy = new Enemy(i, game, Phaser, {
          rank: 1,
          health: 10,
          dmg: 1
        });
        enemies.push(enemy);
        _results.push(enemy.preload());
      }
      return _results;
    };
    create = function() {
      var enemy, _i, _len, _results;
      map.create();
      hero.create();
      hero.on('changeMap', function(direction) {
        return map.reload(direction, hero);
      });
      map.on('finishLoad', function() {
        return hero.sprite.bringToTop();
      });
      _results = [];
      for (_i = 0, _len = enemies.length; _i < _len; _i++) {
        enemy = enemies[_i];
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
          game.physics.arcade.overlap(hero.sprite, enemy.sprite, hero.takeDmg, null, hero);
          _results.push(enemy.update());
        }
        return _results;
      }
    };
    takeDmg = function() {
      return console.log('taking dmg');
    };
    collisionHandler = function() {
      return console.log('hit');
    };
    return $.ajax({
      url: "/player/" + user,
      error: function(err) {
        return console.log("err: " + err);
      }
    }).done(function(playerInfo) {
      var actions, url;
      console.log('got player information');
      mapId = playerInfo.mapId;
      actions = socket(rootUrl);
      actions.join(mapId, user);
      url = "/screen/" + mapId;
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
