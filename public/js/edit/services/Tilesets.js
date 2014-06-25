(function() {
  app.factory('Tilesets', [
    'TilesetView', '$rootScope', function(TilesetView, $rootScope) {
      var Editor, Tilesets, count, tilesetCount;
      Tilesets = {};
      Tilesets.collection = {};
      Editor = void 0;
      count = 0;
      tilesetCount = 0;
      Tilesets.initialize = function(data) {
        var key, tileset;
        Editor = $rootScope.Editor;
        this.view = TilesetView.initialize();
        tilesetCount = data.tilesets.length;
        for (key in data.tilesets) {
          tileset = data.tilesets[key];
          Editor.Tilesets.add({
            image: "/assets/tilemaps/tiles/" + tileset.image,
            name: tileset.name,
            tilewidth: tileset.tilewidth,
            tileheight: tileset.tileheight,
            margin: tileset.margin,
            spacing: tileset.spacing
          });
        }
      };
      Tilesets.set = function(name) {
        var tileset;
        tileset = Tilesets.collection[name];
        Editor.activeTileset = tileset;
        Editor.$("#tileset_container").css({
          width: tileset.width,
          height: tileset.height
        }).attr("class", "ts_" + tileset.id);
        Editor.$("#tilesets select").val(name);
        Editor.$("#tilesets .loading").remove();
        this.resetSelection();
      };
      Tilesets.add = function(data) {
        var bfr, css, id, img, name, style;
        this.total += 1;
        img = new Image();
        bfr = document.createElement("canvas").getContext("2d");
        name = data.name || data.image.match(/(?:.+)\/([^\/]+)/)[1];
        style = document.createElement("style");
        id = name.replace(/[^a-zA-Z]/g, "_");
        css = void 0;
        img.src = data.image;
        img.addEventListener("load", (function() {
          bfr.canvas.width = data.width = this.width;
          bfr.canvas.height = data.height = this.height;
          if (data.alpha) {
            data.base64 = Tilesets.setAlpha(this, data.alpha);
          }
          if (data.margin) {
            data.base64 = Tilesets.slice(this, data);
          }
          if (!data.alpha && !data.margin) {
            bfr.drawImage(this, 0, 0);
            data.base64 = bfr.canvas.toDataURL();
          }
          data.id = id;
          data.name = name;
          Tilesets.collection[name] = data;
          Tilesets.set(name);
          Editor.$(style).attr("id", "tileset_" + id);
          Editor.$(style).attr("class", "tileset");
          css = ".ts_" + id + ", .ts_" + id + " > div {\n";
          css += "\twidth: " + data.tilewidth + "px;\n";
          css += "\theight: " + data.tileheight + "px;\n";
          css += "\tbackground-image: url('" + data.base64 + "');\n";
          css += "}";
          Editor.$(style).append(css);
          Editor.$("head").append(style);
          Editor.$("#tilesets select").append("<option>" + name + "</option>");
          Editor.$("#tilesets select").val(name);
          Editor.$("#tileset").jScrollPane();
          Editor.Canvas.updateGrid();
          count++;
          if (count === tilesetCount) {
            $rootScope.$broadcast('editorReady');
          }
        }), false);
      };
      Tilesets.setAlpha = function(img, alpha) {
        var bfr, i, imgData, l, red, tolerance;
        bfr = document.createElement("canvas").getContext("2d");
        imgData = void 0;
        red = void 0;
        i = void 0;
        l = void 0;
        bfr.canvas.width = img.width;
        bfr.canvas.height = img.height;
        bfr.drawImage(img, 0, 0);
        imgData = bfr.getImageData(0, 0, img.width, img.height);
        tolerance = 10;
        i = 0;
        l = imgData.data.length;
        while (i < l) {
          red = (i % 4 === 0 ? true : false);
          if (red ? imgData.data[i] >= alpha[0] - tolerance && imgData.data[i] <= alpha[0] + tolerance && imgData.data[i + 1] >= alpha[1] - tolerance && imgData.data[i + 1] <= alpha[1] + tolerance && imgData.data[i + 2] >= alpha[2] - tolerance && imgData.data[i + 2] <= alpha[2] + tolerance : void 0) {
            imgData.data[i + 3] = 0;
          }
          i++;
        }
        bfr.clearRect(0, 0, img.width, img.height);
        bfr.putImageData(imgData, 0, 0);
        return bfr.canvas.toDataURL();
      };
      Tilesets.slice = function(img, data) {
        var bfr, imgData, lx, ly, m, red, th, tw, x, xl, y, yl;
        bfr = document.createElement("canvas").getContext("2d");
        tw = data.tilewidth;
        th = data.tileheight;
        imgData = void 0;
        red = void 0;
        x = void 0;
        y = void 0;
        xl = void 0;
        yl = void 0;
        m = data.margin;
        bfr.canvas.width = img.width - (img.width / tw) * data.margin;
        bfr.canvas.height = img.height - (img.height / th) * data.margin;
        y = 0;
        ly = Math.floor(bfr.canvas.height / th);
        while (y < ly) {
          x = 0;
          lx = Math.floor(bfr.canvas.width / tw);
          while (x < lx) {
            bfr.drawImage(img, (x * (tw + m)) + m, (y * (th + m)) + m, tw, th, x * tw, y * th, tw, th);
            x++;
          }
          y++;
        }
        return bfr.canvas.toDataURL();
      };
      Tilesets.resetSelection = function() {
        Editor.$("#canvas .selection").remove();
        Editor.$("#tileset .selection").remove();
        delete Editor.selection;
      };
      Tilesets.getActive = function() {
        return Tilesets.collection[Editor.$("#tilesets select option:selected").val()];
      };
      return Tilesets;
    }
  ]);

}).call(this);
