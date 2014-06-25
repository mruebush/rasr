(function() {
  'use strict';
  app.controller('GameCtrl', [
    '$scope', 'User', 'Auth', 'Map', 'Hero', 'Enemy', 'Player', 'Events', 'Socket', 'PlayerAPI', 'MapAPI', 'SERVER_URL', function($scope, User, Auth, Map, Hero, Enemy, Player, Events, Socket, PlayerAPI, MapAPI, SERVER_URL) {
      var addChat, app, arrowHurt, create, createExplosions, downScreen, explosion, explosions, game, hero, hurtHero, init, initialMap, initialize, leftScreen, map, mapId, players, png, preload, render, renderMap, rightScreen, rootUrl, tileCollision, upScreen, update, user, _createCtrls;
      $scope.currentUser = window.userData || {
        name: "test"
      };
      $scope.chats = [];
      $scope.sendChat = function() {
        var chat;
        chat = {
          user: $scope.currentUser.name,
          message: $scope.chatToSend
        };
        return game.message(chat);
      };
      $scope.borders = {
        up: true,
        right: true,
        down: true,
        left: true
      };
      $scope.makeMap = function(direction) {
        console.log(direction);
        return MapAPI.makeMap().get({
          direction: direction,
          mapId: mapId
        });
      };
      app = Events({});
      window.game = game = null;
      hero = null;
      map = null;
      players = {};
      mapId = null;
      initialMap = null;
      upScreen = null;
      rightScreen = null;
      downScreen = null;
      leftScreen = null;
      png = null;
      rootUrl = '';
      user = $scope.currentUser.name;
      init = {};
      explosions = null;
      initialize = function() {
        return PlayerAPI.get(function(playerInfo) {
          mapId = playerInfo.mapId;
          init.x = playerInfo.x;
          init.y = playerInfo.y;
          init.xp = playerInfo.xp;
          init.speed = playerInfo.speed;
          init.png = playerInfo.png || 'roshan';
          $scope.mapId = mapId;
          return MapAPI.getMap().get({
            mapId: mapId
          }, function(mapData) {
            initialMap = mapData;
            console.log(mapData);
            game = new Phaser.Game(800, 600, Phaser.AUTO, "game-canvas", {
              preload: preload,
              create: create,
              update: update,
              render: render
            });
            game.rootUrl = rootUrl;
            game.enemies = [];
            game = Events(game);
            game.realWidth = 20 * 64;
            return game.realHeight = 12 * 64;
          });
        });
      };
      preload = function() {
        var _this = this;
        game.load.atlasXML("enemy", "assets/enemy.png", "assets/enemy.xml");
        hero = Events(Hero(game, Phaser, {
          exp: 150,
          health: 100,
          mana: 100,
          str: 10,
          dex: 10,
          int: 10,
          luk: 10,
          x: init.x,
          y: init.y,
          png: init.png,
          speed: init.speed
        }));
        map = Events(Map(game, Phaser, mapId));
        game.user = user;
        map.on('finishLoad', function() {
          hero.arrow.arrows.destroy();
          hero.createArrows();
          createExplosions();
          app.isLoaded = true;
          return renderMap();
        });
        Socket(SERVER_URL, game, players, Phaser);
        game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
        game.load.image('lifebar', 'assets/lifebar.png');
        game.load.image('heart', 'assets/heart.png');
        hero.preload();
        map.preload(null, initialMap);
        app.trigger('create');
        app.isLoaded = true;
        window.game = game;
        game.hero = hero;
        game._createCtrls = _createCtrls;
        return game.addChat = addChat;
      };
      create = function() {
        var enemies, enemyId, enemyPositions, i, initPos, offset, y, _i;
        game.lifebar = game.add.sprite(0, 0, 'lifebar');
        game.lifebar.fixedToCamera = true;
        game.lifebar.alpha = 0.8;
        game.hearts = game.add.group();
        initPos = 95;
        offset = 28;
        y = 13;
        for (i = _i = 0; _i < 5; i = ++_i) {
          game.hearts.add(game.add.sprite(initPos + offset * i, y, 'heart'));
        }
        game.hearts.fixedToCamera = true;
        game.hearts.alpha = 0.8;
        hero.create();
        game.hero = hero;
        enemies = [];
        enemyPositions = {};
        for (enemyId in initialMap.enemies) {
          enemies.push({
            id: enemyId,
            count: initialMap.enemies[enemyId].count
          });
          enemyPositions[enemyId] = initialMap.enemies[enemyId].positions;
        }
        game.enemyPositions = enemyPositions;
        game.camera.follow(hero.sprite);
        game.join({
          x: hero.sprite.x,
          y: hero.sprite.y,
          enemies: enemies,
          positions: enemyPositions
        });
        game.trigger('login');
        return game.stage.disableVisibilityChange = true;
      };
      renderMap = function() {
        var layer, _i, _len, _ref, _results;
        game.layerRendering = game.add.group();
        game.layerRendering.add(map.layers[0]);
        game.layerRendering.add(map.layers[1]);
        game.layerRendering.add(map.layers[2]);
        game.layerRendering.add(hero.sprite);
        game.layerRendering.add(hero.arrow.arrows);
        game.layerRendering.add(explosions);
        game.layerRendering.add(map.layers[3]);
        game.layerRendering.add(game.lifebar);
        game.layerRendering.add(game.hearts);
        console.log(map.layers);
        _ref = map.layers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          layer = _ref[_i];
          if (layer.name = 'collision') {
            console.log('collision layer!!!', layer);
            _results.push(map.collisionLayer = layer);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      render = function() {
        var debug, enemy, _i, _len, _ref, _results;
        debug = true;
        if (debug) {
          map.collisionLayer.debug = true;
          game.debug.body(hero.sprite);
          _ref = game.enemies;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            enemy = _ref[_i];
            if (enemy.alive) {
              _results.push(game.debug.body(enemy.sprite));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      };
      update = function() {
        var enemy, player, _i, _len, _ref, _results;
        if (app.isLoaded) {
          map.update();
          hero.update();
          game.physics.arcade.collide(hero.sprite, map.collisionLayer);
          game.physics.arcade.collide(hero.arrow.arrows, map.collisionLayer, tileCollision);
          game.physics.arcade.collide(hero.arrow.arrows, hero.sprite, arrowHurt, null, hero);
          _ref = game.enemies;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            enemy = _ref[_i];
            if (enemy.alive) {
              hero.sprite.facing = hero.facing;
              game.physics.arcade.collide(hero.sprite, enemy.sprite, hurtHero, null, hero);
              game.physics.arcade.collide(hero.arrow.arrows, enemy.sprite, arrowHurt, null, enemy);
              game.physics.arcade.collide(enemy.sprite, map.collisionLayer);
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
      hurtHero = function(heroSprite, enemySprite) {
        return this.damage();
      };
      tileCollision = function(arrow, tile) {
        return arrow.kill();
      };
      arrowHurt = function(sprite, arrow) {
        explosion.call(this);
        this.damage();
        return arrow.kill();
      };
      createExplosions = function() {
        var explosionAnimation, i, _i, _results;
        explosions = game.add.group();
        _results = [];
        for (i = _i = 0; _i < 10; i = ++_i) {
          explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
          explosionAnimation.anchor.setTo(0.5, 0.5);
          _results.push(explosionAnimation.animations.add('kaboom'));
        }
        return _results;
      };
      explosion = function() {
        var explosionAnimation;
        explosionAnimation = explosions.getFirstExists(false);
        if (explosionAnimation) {
          explosionAnimation.reset(this.sprite.x, this.sprite.y);
          return explosionAnimation.play('kaboom', 30, false, true);
        }
      };
      addChat = function(chat) {
        return $scope.$apply(function() {
          var _results;
          $scope.chats.push(chat);
          $scope.chatToSend = '';
          _results = [];
          while ($scope.chats.length > 100) {
            _results.push($scope.chats.shift());
          }
          return _results;
        });
      };
      _createCtrls = function(data) {
        var borders;
        $scope.mapId = map.mapId;
        borders = {
          upScreen: data.upScreen,
          rightScreen: data.rightScreen,
          downScreen: data.downScreen,
          leftScreen: data.leftScreen
        };
        return $scope.$apply(function() {
          var border, borderDirection, value, _results;
          _results = [];
          for (border in borders) {
            value = borders[border];
            borderDirection = border.split('Screen')[0];
            $scope.borders[borderDirection] = !!value;
            _results.push(map.game.physics.arcade.checkCollision[borderDirection] = !value);
          }
          return _results;
        });
      };
      return initialize();
    }
  ]);

}).call(this);
