(function() {
  define(['jquery'], function($) {
    var Map;
    Map = (function() {
      function Map(game, Phaser, mapId) {
        this.game = game;
        this.Phaser = Phaser;
        this.mapId = mapId;
        this.layer = null;
        this.oldBorders = null;
        this.borders = {
          upScreen: true,
          rightScreen: true,
          downScreen: true,
          leftScreen: true
        };
      }

      Map.prototype.preload = function(direction, data, callback, hero) {
        var that, url,
          _this = this;
        if (direction == null) {
          direction = 'screen';
        }
        that = this;
        url = "http://g4m3.azurewebsites.net/" + direction + "/" + this.mapId;
        if (!data) {
          return $.ajax({
            url: url,
            success: function(data) {
              return that._loadAssets.call(that, data, callback, hero);
            }
          });
        } else {
          return this._loadAssets.call(this, data, callback, hero);
        }
      };

      Map.prototype._loadAssets = function(data, callback, hero) {
        var border, tilesetImage, value, _ref, _results;
        if (hero) {
          hero.set('mapId', data._id);
          console.log("Enter " + hero.mapId);
          console.log(hero.sprite.x);
          console.log(hero.sprite.y);
          hero.actions.join(hero.mapId, hero.user, {
            x: hero.sprite.x,
            y: hero.sprite.y
          });
        }
        this.mapId = data._id;
        this.mapData = data;
        this.game.load.tilemap('map', "assets/tilemaps/maps/desert.json", data, this.Phaser.Tilemap.TILED_JSON);
        tilesetImage = this._getImageNameOfTileset(data);
        this.game.load.image('tiles', "assets/tilemaps/tiles/" + tilesetImage);
        callback && callback.apply(this);
        this.oldBorders = this.borders;
        this.borders = {
          upScreen: data.upScreen,
          rightScreen: data.rightScreen,
          downScreen: data.downScreen,
          leftScreen: data.leftScreen
        };
        _ref = this.borders;
        _results = [];
        for (border in _ref) {
          value = _ref[border];
          if (!!value !== !!this.oldBorders[border]) {
            $("." + border).toggleClass('no-bordering-screen');
            _results.push(this.trigger('borderChange', border, !!value));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      Map.prototype.create = function() {
        var layername, map, tilesetName;
        map = this.game.add.tilemap('map');
        tilesetName = this._getNameOfTileset(this.mapData);
        map.addTilesetImage(tilesetName, 'tiles');
        layername = this._getLayerName(this.mapData);
        this.layer = map.createLayer(layername);
        this.layer.resizeWorld();
        this.layer.debug = false;
        return this.trigger('finishLoad');
      };

      Map.prototype.reload = function(direction, hero) {
        return this.preload(direction, null, this.create, hero);
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
