(function() {
  'use strict';
  app.controller('GameCtrl', [
    '$scope', 'User', 'Auth', 'Hero', 'Enemy', 'Player', 'Events', 'Socket', 'PlayerAPI', 'MapAPI', function($scope, User, Auth, Hero, Enemy, Player, Events, Socket, PlayerAPI, MapAPI) {
      var app, arrowHurt, create, createExplosions, downScreen, explosion, explosions, game, hero, hurtHero, initPos, initialMap, initialize, leftScreen, map, mapId, players, png, preload, render, rightScreen, rootUrl, upScreen, update, user;
      $scope.currentUser = window.userData || {
        name: "test"
      };
      $scope.chats = [];
      $scope.sendChat = function() {
        var _results;
        $scope.chats.unshift({
          user: $scope.currentUser.name,
          message: $scope.chatToSend
        });
        $scope.chatToSend = '';
        _results = [];
        while ($scope.chats.length > 100) {
          _results.push($scope.chats.pop());
        }
        return _results;
      };
      app = Events({});
      window.game = game = null;
      hero = null;
      map = null;
      players = Events({});
      mapId = null;
      initialMap = null;
      upScreen = null;
      rightScreen = null;
      downScreen = null;
      leftScreen = null;
      png = null;
      rootUrl = '';
      user = $scope.currentUser.name;
      initPos = {};
      explosions = null;
      initialize = function() {
        return PlayerAPI.get(function(playerInfo) {
          var url;
          mapId = playerInfo.mapId;
          initPos.x = playerInfo.x;
          initPos.y = playerInfo.y;
          png = playerInfo.png || 'roshan';
          $scope.mapId = mapId;
          url = "/screen/" + mapId;
          return MapAPI.getMap(mapId).get(function(mapData) {
            initialMap = mapData;
            game = new Phaser.Game(800, 600, Phaser.AUTO, "game-canvas", {
              preload: preload,
              create: create,
              update: update
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
        game.load.atlasXML("enemy", "images/enemy.png", "images/enemy.xml");
        hero = Events(Hero(game, Phaser, {
          exp: 150,
          health: 100,
          mana: 100,
          str: 10,
          dex: 10,
          int: 10,
          luk: 10,
          x: initPos.x,
          y: initPos.y,
          png: png
        }));
        map = Events(Map(game, Phaser, mapId, $));
        game.user = user;
        game.map = map;
        Socket(rootUrl, game, players, Phaser);
        game.load.spritesheet('kaboom', 'images/explosion.png', 64, 64, 23);
        hero.preload();
        map.preload(null, initialMap);
        app.trigger('create');
        app.isLoaded = true;
        window.game = game;
        return game.hero = hero;
      };
      create = function() {
        var enemies, enemyId, enemyPositions,
          _this = this;
        map.create();
        hero.create();
        game.hero = hero;
        createExplosions();
        render();
        map.on('finishLoad', function() {
          hero.arrows.destroy();
          hero.createArrows();
          createExplosions();
          app.isLoaded = true;
          return render();
        });
        console.log("Joining " + game.mapId + " on " + hero.sprite.x + "," + hero.sprite.y);
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
        return game.join({
          x: hero.sprite.x,
          y: hero.sprite.y,
          enemies: enemies,
          positions: enemyPositions
        });
      };
      render = function() {
        game.layerRendering = game.add.group();
        game.layerRendering.add(map.layers[0]);
        game.layerRendering.add(map.layers[1]);
        game.layerRendering.add(map.layers[2]);
        game.layerRendering.add(hero.sprite);
        game.layerRendering.add(hero.arrows);
        game.layerRendering.add(explosions);
        game.layerRendering.add(map.layers[3]);
        return hero.sprite.bringToTop();
      };
      update = function() {
        var enemy, player, _i, _len, _ref, _results;
        if (app.isLoaded) {
          map.update();
          hero.update();
          _ref = game.enemies;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            enemy = _ref[_i];
            if (enemy.alive) {
              hero.sprite.facing = hero.facing;
              game.physics.arcade.collide(hero.sprite, enemy.sprite, hurtHero, null, hero);
              game.physics.arcade.collide(hero.arrows, hero.sprite, arrowHurt, null, hero);
              game.physics.arcade.collide(hero.arrows, enemy.sprite, arrowHurt, null, enemy);
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
        explosionAnimation.reset(this.sprite.x, this.sprite.y);
        return explosionAnimation.play('kaboom', 30, false, true);
      };
      return initialize();
    }
  ]);

}).call(this);
