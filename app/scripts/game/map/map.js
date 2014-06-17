(function() {
  define(['jquery'], function($) {
    var Map;
    Map = (function() {
      function Map(game, Phaser, mapId) {
        this.game = game;
        this.Phaser = Phaser;
        this.mapId = mapId;
        this.layer = null;
      }

      Map.prototype.preload = function(direction, data, callback) {
        var that, url,
          _this = this;
        if (direction == null) {
          direction = 'screen';
        }
        that = this;
        url = "/move/" + direction + "/" + this.mapId;
        if (!data) {
          return $.ajax({
            url: url,
            success: function(data) {
              return that._loadAssets.call(that, data, callback);
            }
          });
        } else {
          return this._loadAssets.call(this, data, callback);
        }
      };

      Map.prototype._loadAssets = function(data, callback) {
        var tilesetImage;
        this.mapId = data._id;
        this.mapData = data;
        this.game.load.tilemap('map', null, data, this.Phaser.Tilemap.TILED_JSON);
        tilesetImage = this._getImageNameOfTileset(data);
        this.game.load.image('tiles', "assets/tilemaps/tiles/" + tilesetImage);
        return callback && callback.apply(this);
      };

      Map.prototype.create = function() {
        var layername, map, tilesetName;
        map = this.game.add.tilemap('map');
        tilesetName = this._getNameOfTileset(this.mapData);
        map.addTilesetImage(tilesetName, 'tiles');
        layername = this._getLayerName(this.mapData);
        this.layer = map.createLayer(layername);
        this.layer.resizeWorld();
        this.layer.debug = true;
        return this.trigger('finishLoad');
      };

      Map.prototype.reload = function(direction) {
        return this.preload(direction, null, this.create);
      };

      Map.prototype.update = function() {};

      Map.prototype._getImageNameOfTileset = function(data) {
        return data.tilesets[0].image;
      };

      Map.prototype._getNameOfTileset = function(data) {
        return data.tilesets[0].name;
      };

      Map.prototype._getLayerName = function(data) {
        return data.layers[0].name;
      };

      return Map;

    })();
    return Map;
  });

}).call(this);
