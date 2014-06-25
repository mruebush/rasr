(function() {
  app.service('Map', function(MapAPI) {
    var Map;
    Map = {};
    return function(game, Phaser, mapId) {
      var _this = this;
      Map.game = game;
      Map.Phaser = Phaser;
      Map.mapId = mapId;
      Map.layers = [];
      Map.tiles = [];
      Map.game.physics.arcade.checkCollision.up = false;
      Map.game.physics.arcade.checkCollision.right = false;
      Map.game.physics.arcade.checkCollision.down = false;
      Map.game.physics.arcade.checkCollision.left = false;
      Map.game.on('changeMap', function(direction) {
        Map.game.changingScreen = true;
        return Map.reload(direction);
      });
      Map.preload = function(direction, data, callback) {
        if (!data) {
          return MapAPI.moveMap().get({
            direction: direction,
            mapId: Map.mapId
          }, function(mapData) {
            Map._loadAssets.call(Map, mapData, callback);
            return console.log("Triggering enterMap");
          });
        } else {
          return Map._loadAssets.call(Map, data, callback);
        }
      };
      Map._loadAssets = function(data, loader, triggerEnter) {
        var tileset, _i, _len, _ref,
          _this = this;
        if (loader == null) {
          loader = Map.game.load;
        }
        Map.mapId = data._id;
        Map.game.mapId = Map.mapId;
        Map.mapData = data;
        loader.tilemap('map', null, data, Map.Phaser.Tilemap.TILED_JSON);
        _ref = data.tilesets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tileset = _ref[_i];
          Map.tiles[tileset.name] = loader.image(tileset.name, "assets/tilemaps/tiles/" + tileset.image, 32, 32);
        }
        loader.start();
        return loader.onLoadComplete.add(function() {
          return Map.create(triggerEnter);
        });
      };
      Map.create = function(triggerEnter) {
        var layer, map, tileset, _i, _j, _len, _len1, _ref, _ref1;
        map = Map.game.add.tilemap('map');
        _ref = Map.mapData.tilesets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tileset = _ref[_i];
          map.addTilesetImage(tileset.name);
        }
        _ref1 = Map.mapData.layers;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          layer = _ref1[_j];
          layer = map.createLayer(layer.name);
          Map.layers.push(layer);
          layer.resizeWorld();
          if (layer.name === 'collision') {
            map.setCollisionBetween(1, 1000, true, layer);
          }
        }
        Map.game._createCtrls(Map.mapData);
        Map.trigger('finishLoad');
        if (triggerEnter) {
          return Map.game.trigger('enterMap');
        }
      };
      Map.reloadMap = function(loader, direction) {
        return MapAPI.moveMap().get({
          direction: direction,
          mapId: Map.mapId
        }, function(mapData) {
          Map._loadAssets.call(Map, mapData, loader, true);
          Map.game.mapData = mapData;
          return Map.game.trigger("enterMap");
        });
      };
      Map.reload = function(direction) {
        var layer, loader, _i, _len, _ref;
        _ref = Map.layers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          layer = _ref[_i];
          layer.destroy();
        }
        Map.layers = [];
        loader = new Map.Phaser.Loader(Map.game);
        return Map.reloadMap(loader, direction);
      };
      Map.update = function() {};
      Map._makeMap = function(direction, mapId) {
        return MapAPI.makeMap().get({
          direction: direction,
          mapId: mapId
        });
      };
      return Map;
    };
  });

}).call(this);
