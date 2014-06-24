(function() {
  define(function() {
    var Editor, Import, Tilesets, getDefaultTileset;
    Import = {};
    Editor = void 0;
    Tilesets = void 0;
    Import.initialize = function() {
      Editor = require("editor");
    };
    Import.events = {
      "change input[name=file_import]": function(e) {
        Import.cacheFile(e);
      },
      "click #import": function(e) {
        var reader, type;
        if (!Import.tmp) {
          return alert("No file selected");
        }
        type = Import.tmp.name.split(".").pop().toLowerCase();
        reader = new FileReader();
        if (window.FileReader) {
          reader.readAsText(Import.tmp);
          reader.onload = function(e) {
            Import.process(e.target.result, type);
          };
        } else {
          Import.process(Import.tmp, type);
        }
      }
    };
    getDefaultTileset = function(data) {
      return data.tilesets[0].name;
    };
    Import.process = function(data, type) {
      var error, json;
      if (type === "json") {
        data = JSON.parse(data);
      } else {
        json = {
          tilesets: [],
          layers: [],
          canvas: {}
        };
        Editor.$(data).find("tileset").each(function(i) {
          json.tilesets.push({
            name: $(this).attr("name"),
            image: $(this).attr("image"),
            imagewidth: $(this).attr("imagewidth"),
            imageheight: $(this).attr("imageheight"),
            tilewidth: $(this).attr("tilewidth"),
            tileheight: $(this).attr("tilewidth")
          });
        });
        Editor.$(data).find("layer").each(function(i) {
          json.layers.push({
            name: $(this).attr("name"),
            tileset: $(this).attr("tileset"),
            data: $(this).html().split(",")
          });
        });
        json.canvas = {
          width: Editor.$(data).find("canvas").attr("width"),
          height: Editor.$(data).find("canvas").attr("height")
        };
        data = json;
      }
      Editor.$("#layerlist li, #tilesets option, .layer").remove();
      error = false;
      data.tilesets.forEach(function(tileset) {
        var hasSrc, id;
        id = tileset.name.replace(/[^a-zA-Z]/g, "_");
        hasSrc = tileset.image.indexOf("data:image") === 0;
        if (!hasSrc && !Editor.$("#tileset_" + id).length) {
          alert("Error: the source for the tileset \"" + tileset.image + "\" " + "is not currently present and is not included in your map file either. " + "Importing will be aborted.");
          error = true;
          false;
        } else if (hasSrc && !Editor.$("#tileset_" + id).length) {
          Editor.Tilesets.add(tileset);
        } else {
          if (Editor.$("#tileset_" + id).length) {
            Editor.$("#tilesets select").append("<option>" + tileset.name + "</option>");
          }
        }
      });
      if (error) {
        return;
      }
      Editor.Tilesets.set(data.tilesets[0].name);
      data.layers.forEach(function(layer) {
        var className, th, tilesWidthCount, tilesXCount, tilesYCount, tileset, tilesetId, tw, w;
        Editor.Layers.add(layer.name);
        if (!layer.tileset) {
          layer.tileset = getDefaultTileset(data);
        }
        tilesetId = void 0;
        data.tilesets.forEach(function(v, i) {
          if (v.name === layer.tileset) {
            tilesetId = i;
            return false;
          }
        });
        tileset = data.tilesets[tilesetId];
        if (!data.canvas) {
          data.canvas = {
            width: 1280,
            height: 768
          };
        }
        w = Math.round(data.canvas.width / tileset.tilewidth);
        tw = tileset.tilewidth;
        th = tileset.tileheight;
        tilesWidthCount = data.tilesets[tilesetId];
        tilesYCount = Math.round(tileset.imageheight / tileset.tileheight);
        tilesXCount = Math.round(tileset.imagewidth / tileset.tilewidth);
        className = "ts_" + tileset.name.replace(/[^a-zA-Z]/g, "_");
        Editor.$(".layer[data-name=" + layer.name + "]").addClass(className);
        Editor.$(".layer[data-name=" + layer.name + "]").attr("data-tileset", tileset.name);
        layer.data.forEach(function(coords, i) {
          var $div, bgpos, temp, x, y;
          if (coords === -1) {
            return true;
          }
          temp = coords;
          coords = (Math.max(0, coords % tilesXCount - 1)) + "." + Math.floor(coords / tilesXCount);
          if (coords === "-1.0") {
            debugger;
          }
          coords = coords.toString();
          if (coords.length === 1) {
            coords += ".0";
          }
          x = i % w;
          y = ~~(i / w);
          bgpos = coords.split(".");
          $div = Editor.$("<div>").css({
            position: "absolute",
            left: x * tw,
            top: y * th
          }).attr("data-coords", x + "." + y);
          $div.attr("data-coords-tileset", coords);
          $div.css("background-position", (-(bgpos[0] * tw)) + "px" + " " + (-(bgpos[1] * th)) + "px");
          Editor.$(".layer." + className).append($div);
        });
      });
      delete Import.tmp;
    };
    Import.cacheFile = function(e) {
      if (!window.FileReader) {
        e.preventDefault();
        Import.tmp = prompt("Your browser doesn't support local file upload.\nPlease insert an image URL below:", "");
      } else if (e.type === "change") {
        Import.tmp = e.target.files[0];
        Editor.$("#dialog input[name=file_overlay]").val(Import.tmp.name);
      }
    };
    return Import;
  });

}).call(this);
