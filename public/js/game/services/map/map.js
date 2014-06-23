(function() {
  var Map;

  Map = (function() {
    function Map(game, Phaser, mapId, $) {
      var _this = this;
      this.game = game;
      this.Phaser = Phaser;
      this.mapId = mapId;
      this.$ = $;
      this.layers = [];
      this.oldBorders = null;
      this.tiles = [];
      this.borders = {
        upScreen: true,
        rightScreen: true,
        downScreen: true,
        leftScreen: true
      };
      this.game.physics.arcade.checkCollision.up = false;
      this.game.physics.arcade.checkCollision.right = false;
      this.game.physics.arcade.checkCollision.down = false;
      this.game.physics.arcade.checkCollision.left = false;
      this.game.on('changeMap', function(direction) {
        _this.game.changingScreen = true;
        return _this.reload(direction);
      });
      this.$up = this.$(".up");
      this.$up.click(function() {
        return _this._makeMap('up', _this.mapId);
      });
      this.$down = this.$(".down");
      this.$down.click(function() {
        return _this._makeMap('down', _this.mapId);
      });
      this.$right = this.$(".right");
      this.$right.click(function() {
        return _this._makeMap('right', _this.mapId);
      });
      this.$left = this.$(".left");
      this.$left.click(function() {
        return _this._makeMap('left', _this.mapId);
      });
    }

    Map.prototype.preload = function(direction, data, callback) {
      var that, url,
        _this = this;
      that = this;
      url = "" + this.game.rootUrl + "/move/" + direction + "/" + this.mapId;
      if (!data) {
        return this.$.ajax({
          url: url,
          success: function(data) {
            _this.$('#map-id').attr('href', '/edit/' + _this.mapId);
            that._loadAssets.call(that, data, callback);
            return console.log("Trigerring enterMap");
          }
        });
      } else {
        return this._loadAssets.call(this, data, callback);
      }
    };

    Map.prototype._loadAssets = function(data, loader) {
      var tileset, _i, _len, _ref,
        _this = this;
      if (loader == null) {
        loader = this.game.load;
      }
      this.mapId = data._id;
      this.game.mapId = this.mapId;
      this.mapData = data;
      loader.tilemap('map', null, data, this.Phaser.Tilemap.TILED_JSON);
      _ref = data.tilesets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tileset = _ref[_i];
        this.tiles[tileset.name] = loader.image(tileset.name, "assets/tilemaps/tiles/" + tileset.image, 32, 32);
      }
      loader.start();
      return loader.onLoadComplete.add(function() {
        return _this.create();
      });
    };

    Map.prototype.create = function() {
      var layer, map, tileset, _i, _j, _len, _len1, _ref, _ref1;
      map = this.game.add.tilemap('map');
      _ref = this.mapData.tilesets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tileset = _ref[_i];
        map.addTilesetImage(tileset.name);
      }
      _ref1 = this.mapData.layers;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        layer = _ref1[_j];
        layer = map.createLayer(layer.name);
        this.layers.push(layer);
        layer.resizeWorld();
      }
      return this.trigger('finishLoad');
    };

    Map.prototype.reloadMap = function(loader, direction) {
      var that, url,
        _this = this;
      that = this;
      url = "" + this.game.rootUrl + "/move/" + direction + "/" + this.mapId;
      return $.ajax({
        url: url,
        success: function(data) {
          that._createCtrls(data);
          that._loadAssets.call(that, data, loader);
          that.game.mapData = data;
          return that.game.trigger("enterMap");
        }
      });
    };

    Map.prototype.reload = function(direction) {
      var layer, loader, _i, _len, _ref;
      _ref = this.layers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        layer = _ref[_i];
        layer.destroy();
      }
      this.layers = [];
      loader = new this.Phaser.Loader(this.game);
      return this.reloadMap(loader, direction);
    };

    Map.prototype.update = function() {};

    Map.prototype._createCtrls = function(data) {
      var border, borderDirection, value, _ref, _results;
      $('#map-id').attr('href', '/edit/' + this.mapId);
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
          borderDirection = border.split('Screen')[0];
          this.$("." + borderDirection).toggleClass('hidden');
          _results.push(this.game.physics.arcade.checkCollision[borderDirection] = !value);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Map.prototype._makeMap = function(direction, mapId) {
      return this.$.ajax({
        url: "/make/" + direction + "/" + mapId,
        type: "GET",
        success: function() {},
        error: function() {}
      });
    };

    return Map;

  })();

}).call(this);
