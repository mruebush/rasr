(function() {
  define(function() {
    var Canvas, Editor;
    Canvas = {};
    Editor = void 0;
    Canvas.cursor = [];
    Canvas.cursor.last = {};
    Canvas.initialize = function() {
      Editor = require("editor");
      Editor.$("#canvas").draggable({
        mouseButton: 1,
        cursor: "move",
        start: function() {
          if (!Editor.keystatus.spacebar) {
            Editor.$("body").css("cursor", "");
            return false;
          }
        }
      });
      this.reposition();
      Editor.$("#canvas").fadeIn();
      Editor.$(window).on("resize", this.reposition);
    };
    Canvas.events = {
      "mousedown|mousemove|mouseup #canvas": function(e) {
        var ex, ey, lx, ly, offset, sx, sy, th, tileset, tw, x, y;
        if (!Editor.activeTileset) {
          return;
        }
        if (e.which === 3) {
          Editor.Tilesets.resetSelection();
          return;
        }
        tileset = Editor.activeTileset;
        tw = tileset.tilewidth;
        th = tileset.tileheight;
        offset = Editor.$("#canvas").offset();
        x = Math.floor((e.pageX - offset.left) / tw);
        y = Math.floor((e.pageY - offset.top) / th);
        Canvas.cursor[0] = x;
        Canvas.cursor[1] = y;
        Editor.$("#canvas").find(".selection").css({
          top: y * th,
          left: x * tw
        });
        if (!Editor.keystatus.spacebar) {
          if (Editor.selection && ((e.type === "mousedown" && e.which === 1) || Editor.mousedown)) {
            if (Editor.tool === "draw") {
              sx = Editor.selection[0][0];
              sy = Editor.selection[0][1];
              ex = Editor.selection[1][0];
              ey = Editor.selection[1][1];
              lx = ex - sx;
              ly = ey - sy;
              y = 0;
              while (y <= ly) {
                x = 0;
                while (x <= lx) {
                  if ([Canvas.cursor[0] + x, Canvas.cursor[1] + y] in Canvas.cursor.last) {
                    return;
                  }
                  x++;
                }
                y++;
              }
              Canvas.draw();
            } else {
              if (Editor.tool === "fill" && e.type === "mousedown") {
                Canvas.fill();
              }
            }
          } else {
            if (!Editor.selection) {
              Canvas.makeSelection(e);
            }
          }
          if (Editor.selection && !Editor.mousedown) {
            Canvas.cursor.last = {};
          }
        }
      }
    };
    Canvas.draw = function() {
      var $div, $tile, bgpos, bgx, bgy, coords, cx, cxp, cy, cyp, ex, ey, layer, left, lx, ly, pos_x, pos_y, query, sx, sy, th, tileset, top, tw, x, y;
      tileset = Editor.activeTileset;
      layer = Editor.Layers.getActive();
      cx = this.cursor[0];
      cy = this.cursor[1];
      tw = tileset.tilewidth;
      th = tileset.tileheight;
      sx = Editor.selection[0][0];
      sy = Editor.selection[0][1];
      ex = Editor.selection[1][0];
      ey = Editor.selection[1][1];
      lx = ex - sx;
      ly = ey - sy;
      bgpos = Editor.$("#canvas").find(".selection").css("background-position").split(" ");
      bgx = parseInt(bgpos[0], 10);
      bgy = parseInt(bgpos[1], 10);
      pos_x = void 0;
      pos_y = void 0;
      coords = void 0;
      $div = void 0;
      x = void 0;
      y = void 0;
      query = void 0;
      cxp = void 0;
      cyp = void 0;
      $tile = void 0;
      top = void 0;
      left = void 0;
      if (!Editor.$(layer.elem).attr("data-tileset")) {
        Editor.$(layer.elem).addClass("ts_" + tileset.id);
        Editor.$(layer.elem).attr("data-tileset", tileset.name);
      } else if (Editor.$(layer.elem).attr("data-tileset") !== tileset.name) {
        if (!Editor.$("#canvas .warning:visible").length) {
          Editor.$("#canvas .warning").html("Cannot use different tilesets on one layer, please clear the layer first.").show().delay(2000).fadeOut(1000);
        }
        return;
      }
      if (Editor.selection.custom) {
        cxp = cx * tw;
        cyp = cy * th;
        Editor.$("#canvas").find(".selection").find("div").each(function() {
          top = parseInt(Editor.$(this).css("top"), 10);
          left = parseInt(Editor.$(this).css("left"), 10);
          $tile = Editor.$(this).clone();
          $tile.css({
            top: top + cyp,
            left: left + cxp
          });
          coords = ((left + cxp) / tw) + "." + ((top + cyp) / th);
          query = Editor.$(layer.elem).find("div[data-coords='" + coords + "']");
          if (query.length) {
            Editor.$(query).attr("style", $tile.attr("style"));
          } else {
            $tile.attr("data-coords", coords);
            Editor.$(layer.elem).append($tile);
          }
        });
      } else {
        y = 0;
        while (y <= ly) {
          x = 0;
          while (x <= lx) {
            pos_x = cx + x;
            pos_y = cy + y;
            Canvas.cursor.last[[pos_x, pos_y]] = true;
            coords = pos_x + "." + pos_y;
            query = Editor.$(layer.elem).find("div[data-coords='" + coords + "']");
            $div = (query.length ? query : Editor.$("<div>").css({
              position: "absolute",
              left: pos_x * tw,
              top: pos_y * th
            }).attr("data-coords", coords));
            $div.attr("data-coords-tileset", (Math.abs(bgx / tw) + x) + "." + (Math.abs(bgy / th) + y));
            $div.css("background-position", (bgx - (x * tw)) + "px" + " " + (bgy - (y * th)) + "px");
            if (!query.length) {
              Editor.$(layer.elem).append($div);
            }
            x++;
          }
          y++;
        }
      }
    };
    Canvas.fill = function(e) {
      var bgpos, bgx, bgy, closedList, cx, cy, documentFragment, ex, ey, fill_recursive, fx, fy, layer, query, replace_bgpos, search_bgpos, sx, sy, th, tileset, tw;
      tileset = Editor.activeTileset;
      layer = Editor.Layers.getActive();
      cx = this.cursor[0];
      cy = this.cursor[1];
      tw = tileset.tilewidth;
      th = tileset.tileheight;
      sx = Editor.selection[0][0];
      sy = Editor.selection[0][1];
      ex = Editor.selection[1][0];
      ey = Editor.selection[1][1];
      fx = Editor.$("#canvas").width() / tw;
      fy = Editor.$("#canvas").height() / th;
      bgpos = Editor.$("#canvas").find(".selection").css("background-position").split(" ");
      bgx = parseInt(bgpos[0], 10);
      bgy = parseInt(bgpos[1], 10);
      query = Editor.$(layer.elem).find("div[data-coords='" + cx + "." + cy + "']");
      search_bgpos = (query.length ? query.attr("data-coords-tileset") : null);
      replace_bgpos = Math.abs(bgx / tw) + "." + Math.abs(bgy / th);
      documentFragment = document.createDocumentFragment();
      closedList = [];
      fill_recursive = function(ox, oy) {
        var $elem, coords, x, y;
        coords = [[ox, oy - 1], [ox, oy + 1], [ox - 1, oy], [ox + 1, oy]];
        $elem = void 0;
        x = void 0;
        y = void 0;
        coords.forEach(function(arr) {
          x = arr[0];
          y = arr[1];
          if (x < 0 || x >= fx || y < 0 || y >= fy) {
            return;
          }
          if (closedList.indexOf(x + "." + y) !== -1) {
            return;
          }
          $elem = Editor.$(layer.elem).find("div[data-coords='" + arr[0] + "." + arr[1] + "']");
          if ((!$elem.length && !search_bgpos) || $elem.attr("data-coords-tileset") === search_bgpos) {
            if (!$elem.length) {
              $elem = Editor.$("<div>").css({
                position: "absolute",
                left: x * tw,
                top: y * th
              }).attr("data-coords", x + "." + y);
              documentFragment.appendChild($elem[0]);
            }
            $elem.css("background-position", bgx + "px" + " " + bgy + "px");
            $elem.attr("data-coords-tileset", replace_bgpos);
            closedList.push(x + "." + y);
            fill_recursive(x, y);
          }
        });
      };
      if (!Editor.$(layer.elem).attr("data-tileset")) {
        Editor.$(layer.elem).addClass("ts_" + tileset.id);
        Editor.$(layer.elem).attr("data-tileset", tileset.name);
      } else if (Editor.$(layer.elem).attr("data-tileset") !== tileset.name) {
        if (!Editor.$("#canvas .warning:visible").length) {
          Editor.$("#canvas .warning").html("Cannot use different tilesets on one layer, please clear the layer first.").show().delay(2000).fadeOut(1000);
        }
        return;
      }
      fill_recursive(cx, cy);
      Editor.$(layer.elem).append(documentFragment);
    };
    Canvas.makeSelection = function(e) {
      var $selection, $tile, ex, ey, layer, left, sx, sy, th, tileset, top, tw;
      tileset = void 0;
      tw = void 0;
      th = void 0;
      ex = void 0;
      ey = void 0;
      $selection = void 0;
      layer = void 0;
      top = void 0;
      left = void 0;
      $tile = void 0;
      Editor.Utils.makeSelection(e, "#canvas");
      if (e.type === "mousedown") {
        Editor.$("#canvas").find(".selection").css("background-color", "rgba(0, 0, 0, 0.3)");
      } else if (e.type === "mouseup") {
        tileset = Editor.activeTileset;
        tw = tileset.tilewidth;
        th = tileset.tileheight;
        sx = Editor.selection[0][0] * tw;
        sy = Editor.selection[0][1] * th;
        ex = Editor.selection[1][0] * tw;
        ey = Editor.selection[1][1] * th;
        $selection = Editor.$("#canvas").find(".selection");
        layer = Editor.Layers.getActive();
        Editor.$(layer.elem).find("div").each(function() {
          top = parseInt(Editor.$(this).css("top"), 10);
          left = parseInt(Editor.$(this).css("left"), 10);
          if (left >= sx && left <= ex && top >= sy && top <= ey) {
            $tile = Editor.$(this).clone();
            $tile.css({
              top: top - sy,
              left: left - sx
            });
            $selection.append($tile);
          }
        });
        $selection.css("background-color", "transparent");
        $selection.addClass(Editor.$(layer.elem).attr("class").replace("layer", "nobg"));
        Editor.selection.custom = true;
      }
    };
    Canvas.reposition = function(e) {
      var extra, left, top;
      extra = (Editor.$("#toolbar").width() + Editor.$("#canvas").width() < Editor.$(window).width() ? Editor.$("#toolbar").width() / 2 : 0);
      left = (Editor.$(window).width() / 2) - (Editor.$("#canvas").width() / 2) + extra;
      top = (Editor.$(window).height() / 2) - (Editor.$("#canvas").height() / 2);
      Editor.$("#canvas").css({
        top: top,
        left: left
      });
    };
    Canvas.updateGrid = function() {
      var bfr, buffer, th, tileset, tw;
      buffer = document.createElement("canvas");
      bfr = buffer.getContext("2d");
      tileset = Editor.activeTileset;
      tw = tileset.tilewidth;
      th = tileset.tileheight;
      buffer.width = tw;
      buffer.height = th;
      bfr.fillStyle = "rgba(0, 0, 0, 0.1)";
      bfr.fillRect(0, th - 1, tw, 1);
      bfr.fillRect(tw - 1, 0, 1, th);
      Editor.$("#canvas").css("backgroundImage", "url(" + buffer.toDataURL() + ")");
      Editor.$("#canvas").find(".selection").css({
        width: tw,
        height: th
      });
    };
    return Canvas;
  });

}).call(this);
