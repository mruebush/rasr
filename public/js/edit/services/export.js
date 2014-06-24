(function() {
  app.factory('Export', [
    '$rootScope', function($rootScope) {
      var Editor, Export;
      Export = {};
      Editor = $rootScope;
      Export.initialize = function() {};
      Export.events = {
        "click #export": function(e) {
          Export.process(e);
        }
      };
      Export.process = function() {
        var anchor, coords, data, elem, format_output, gid, h, image, include_base64, layer, output, query, tilesXCount, tilesYCount, tileset, type, w, x, y;
        type = "JSON";
        include_base64 = Editor.$("select[name=include_base64]").val() === "yes";
        format_output = Editor.$("select[name=format_output]").val() === "yes";
        tileset = Editor.activeTileset;
        anchor = document.createElement("a");
        w = 20;
        h = 12;
        tilesYCount = Math.round(tileset.height / tileset.tileheight);
        tilesXCount = Math.round(tileset.width / tileset.tilewidth);
        output = void 0;
        layer = void 0;
        coords = void 0;
        y = void 0;
        x = void 0;
        query = void 0;
        elem = void 0;
        data = void 0;
        anchor.download = "map." + type.toLowerCase();
        if (type === "JSON") {
          output = {};
          output.layers = [];
          Editor.$(".layer").each(function() {
            var temp;
            layer = {
              name: Editor.$(this).attr("data-name"),
              tileset: Editor.$(this).attr("data-tileset"),
              data: [],
              x: 0,
              y: 0,
              height: h,
              width: w,
              visible: true,
              type: "tilelayer",
              opacity: 1
            };
            y = 0;
            while (y < h) {
              x = 0;
              while (x < w) {
                query = Editor.$(this).find("div[data-coords='" + x + "." + y + "']");
                coords = (query.length ? parseFloat(query.attr("data-coords-tileset"), 10) : -1);
                coords = coords.toString().split(".");
                temp = coords;
                if (coords.length === 1) {
                  coords.push("0");
                }
                coords = tilesXCount * (parseInt(coords[1], 10)) + parseInt(coords[0], 10) + 1;
                console.log("type: ", typeof coords);
                layer.data.push(coords);
                x++;
              }
              y++;
            }
            output.layers.push(layer);
          });
          output.tilesets = [];
          gid = 1;
          for (tileset in Editor.Tilesets.collection) {
            tileset = Editor.Tilesets.collection[tileset];
            image = tileset.image.split("/");
            tileset.image = image[image.length - 1];
            output.tilesets.push({
              name: tileset.name,
              image: tileset.image,
              imagewidth: tileset.width,
              imageheight: tileset.height,
              tilewidth: tileset.tilewidth,
              tileheight: tileset.tileheight,
              margin: tileset.margin || 0,
              spacing: tileset.spacing || 0,
              firstgid: gid++
            });
          }
          output.canvas = {
            width: window.parseInt(Editor.$("#canvas").css("width"), 10),
            height: window.parseInt(Editor.$("#canvas").css("height"), 10)
          };
          _.extend(output, Editor.cached);
          output = JSON.stringify(output);
          anchor.href = "data:application/json;charset=UTF-8;," + encodeURIComponent(output);
        }
        console.log("posting");
        $.ajax({
          url: "/save/" + Editor.cached._id,
          data: {
            map: output
          },
          dataType: "json",
          type: "PUT",
          success: function() {
            location.href = location.origin + "/play";
          },
          error: function(err) {
            location.href = location.origin + "/play";
          }
        });
      };
      return Export;
    }
  ]);

}).call(this);
