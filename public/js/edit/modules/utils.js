(function() {
  define(function() {
    var Editor, Utils;
    Utils = {};
    Editor = void 0;
    Utils.initialize = function() {
      Editor = require("editor");
    };
    Utils.makeSelection = function(e, container) {
      var $container, $selection, ex, ey, h, id, offset, s, sx, sy, th, tileset, tw, w, x, y;
      tileset = Editor.activeTileset;
      tw = tileset.tilewidth;
      th = tileset.tileheight;
      sx = void 0;
      sy = void 0;
      $container = Editor.$(container);
      offset = $container.offset();
      x = Math.floor(((e.pageX - offset.left) + $container.scrollTop()) / tw) * tw;
      y = Math.floor(((e.pageY - offset.top) + $container.scrollLeft()) / th) * th;
      $selection = $container.find(".selection");
      if (e.type === "mousedown") {
        if (!$selection.length) {
          $container.append("<div class='selection'></div>");
        }
        $selection.css({
          left: x,
          top: y,
          width: tw,
          height: th
        });
        delete Editor.selection;
        Editor.tmp_selection = [[x, y], new Array(2)];
      } else if (e.type === "mousemove") {
        if (Editor.mousedown) {
          sx = Editor.tmp_selection[0][0];
          sy = Editor.tmp_selection[0][1];
          w = Math.abs((x - sx) + tw);
          h = Math.abs((y - sy) + th);
          if (sx <= x) {
            $selection.css({
              left: sx,
              width: w
            });
          } else {
            $selection.css({
              left: x,
              width: w + tw * 2
            });
          }
          if (sy <= y) {
            $selection.css({
              top: sy,
              height: h
            });
          } else {
            $selection.css({
              top: y,
              height: h + th * 2
            });
          }
        } else {
          if (!$selection.length) {
            $container.append("<div class='selection'></div>");
          }
          $container.find(".selection").css({
            left: x,
            top: y,
            width: tw,
            height: th
          });
        }
      } else if (e.type === "mouseup" && Editor.tmp_selection) {
        s = Editor.tmp_selection;
        id = Editor.$("select[name=tileset_select] option:selected").index();
        ex = void 0;
        ey = void 0;
        s[1][0] = x;
        s[1][1] = y;
        sx = (s[0][0] < s[1][0] ? s[0][0] : s[1][0]);
        sy = (s[0][1] < s[1][1] ? s[0][1] : s[1][1]);
        ex = (s[0][0] > s[1][0] ? s[0][0] : s[1][0]);
        ey = (s[0][1] > s[1][1] ? s[0][1] : s[1][1]);
        Editor.selection = [[sx / tw, sy / th], [ex / tw, ey / th]];
      }
    };
    return Utils;
  });

}).call(this);
