(function() {
  app.factory('TilesetView', [
    '$rootScope', function($rootScope) {
      var Editor, TilesetView;
      TilesetView = {};
      TilesetView.config = {
        filetypes: ["png", "jpg", "jpeg"]
      };
      TilesetView.tmp = {};
      Editor = void 0;
      TilesetView.initialize = function() {
        Editor = $rootScope.Editor;
        Editor.$("body").on("change", "#tilesets select", this.changeTileset).on("change", "input[name=file_tileset]", this.cacheFile).on("click", "#tilesets_add", this.add).on("click", "#tilesets_remove", this.remove);
        Editor.$("#tileset_container").on("mousedown mouseup mousemove", this.makeSelection);
        Editor.$("#tileset_remove").on("click", this.remove);
      };
      TilesetView.add = function(e) {
        var data, hex, reader, type;
        data = {
          tilewidth: +Editor.$("#dialog input[name=tile_width]").val(),
          tileheight: +Editor.$("#dialog input[name=tile_height]").val(),
          margin: +Editor.$("#dialog input[name=tile_margin]").val(),
          alpha: Editor.$("#dialog input[name=tile_alpha]").val()
        };
        hex = data.alpha.match(/^#?(([0-9a-fA-F]{3}){1,2})$/);
        type = void 0;
        data = void 0;
        if (hex && hex[1]) {
          hex = hex[1];
          if (hex.length === 3) {
            data.alpha = [parseInt(hex[0] + hex[0], 16), parseInt(hex[1] + hex[1], 16), parseInt(hex[2] + hex[2], 16)];
          } else if (hex.length === 6) {
            data.alpha = [parseInt(hex[0] + hex[1], 16), parseInt(hex[2] + hex[3], 16), parseInt(hex[5] + hex[6], 16)];
          }
        } else if (data.alpha.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])(, ?|$)){3}$/)) {
          data.alpha = Editor._.map(data.alpha.split(","), function(num) {
            return parseInt(num, 10);
          });
        } else {
          data.alpha = null;
        }
        if (!window.FileReader) {
          data = TilesetView.tmp.match(/.+\/(.+)\.(.+)/);
          data.name = data[1];
          type = data[2].toLowerCase();
        } else {
          data.name = TilesetView.tmp.name;
          type = TilesetView.tmp.type.split("/")[1];
        }
        if (TilesetView.config.filetypes.indexOf(type.toLowerCase()) === -1) {
          alert("Wrong file type in \"" + data.name + "\"\nSupported file types: " + TilesetView.config.filetypes.join(", "));
        } else if (Editor.$("#tilesets select option:contains(" + data.name + ")").length) {
          alert("File \"" + data.name + "\" does already exist.");
        } else {
          if (window.FileReader) {
            reader = new FileReader();
            reader.readAsDataURL(TilesetView.tmp);
            reader.onload = function(e) {
              TilesetView.process(e, data);
            };
          } else {
            TilesetView.process(null, data);
          }
        }
      };
      TilesetView.remove = function() {
        var name, tileset;
        tileset = Editor.activeTileset;
        if (!confirm("This will remove all tiles associated with \"" + tileset.name + "\", continue?")) {
          return;
        }
        Editor.$("style#tileset_" + tileset.id).remove();
        Editor.$("#tiles div.ts_" + tileset.id).remove();
        Editor.$(".layer[data-tileset='" + tileset.name + "']").removeAttr("data-tileset");
        Editor.$("#tilesets select option:selected").remove();
        delete Editor.Tilesets.collection[tileset.name];
        Editor.$("#tileset_container").css({
          width: 0,
          height: 0
        });
        if (Editor.$("#tilesets select option").length) {
          name = Editor.$("#tilesets select option:eq(0)").html();
          Editor.$("#tilesets select option").removeAttr("selected");
          Editor.$("#tilesets select option:eq(0)").attr("selected", true);
          Editor.Tilesets.set(name);
        }
      };
      TilesetView.changeTileset = function(e) {
        var name;
        name = Editor.$("#tilesets select option:selected").html();
        Editor.Tilesets.set(name);
        Editor.Tilesets.resetSelection();
        Editor.Canvas.updateGrid();
      };
      TilesetView.process = function(e, data) {
        data.image = (e ? e.target.result : TilesetView.tmp);
        Editor.Tilesets.add(data);
        Editor.$("#dialog").dialog("close");
      };
      TilesetView.cacheFile = function(e) {
        if (!window.FileReader) {
          e.preventDefault();
          TilesetView.tmp = prompt("Your browser doesn't support local file upload.\nPlease insert an image URL below:", "");
        } else if (e.type === "change") {
          TilesetView.tmp = e.target.files[0];
          Editor.$("#dialog input[name=tileset_file_overlay]").val(TilesetView.tmp.name);
        }
      };
      TilesetView.makeSelection = function(e) {
        var ex, ey, sx, sy, th, tileset, tw;
        if (!Editor.$("#tilesets select option:selected").length) {
          return;
        }
        tileset = void 0;
        tw = void 0;
        th = void 0;
        ex = void 0;
        ey = void 0;
        Editor.Utils.makeSelection(e, "#tileset_container");
        if (e.type === "mouseup") {
          tileset = Editor.activeTileset;
          tw = tileset.tilewidth;
          th = tileset.tileheight;
          sx = Editor.selection[0][0] * tw;
          sy = Editor.selection[0][1] * th;
          ex = Editor.selection[1][0] * tw;
          ey = Editor.selection[1][1] * th;
          if (!Editor.$("#canvas .selection").length) {
            Editor.$("#canvas").append("<div class='selection'></div>");
          }
          Editor.$("#canvas .selection").css({
            width: (ex - sx) + tw,
            height: (ey - sy) + th,
            backgroundColor: "transparent",
            backgroundPosition: (-sx) + "px " + (-sy) + "px"
          }).attr("class", "selection ts_" + tileset.id);
          Editor.$("#tileset_container").find(".selection").remove();
          delete Editor.selection.custom;
        }
      };
      return TilesetView;
    }
  ]);

}).call(this);
