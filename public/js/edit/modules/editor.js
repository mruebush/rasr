(function() {
  define(["underscore", "modules/utils", "modules/menubar", "modules/tools", "modules/canvas", "modules/tilesets", "modules/layers", "modules/export", "modules/import", "events"], function() {
    var Editor, argNames, args, events;
    events = require("events");
    Editor = events({});
    args = arguments_;
    argNames = ["_", "Utils", "Menubar", "Tools", "Canvas", "Tilesets", "Layers", "Export", "Import"];
    Editor.tool = "draw";
    Editor.keystatus = {};
    Editor.mousedown = false;
    Editor.selection = null;
    Editor.initialize = function(data) {
      argNames.forEach(function(v, i) {
        Editor[v] = args[i];
        if (typeof Editor[v].initialize === "function") {
          Editor[v].initialize(data);
        }
      });
      Editor.registerEvents();
      $("#menubar > li").on("click mouseover", function(e) {
        if (e.type === "mouseover" && !$("#menubar > li.open").length) {
          return;
        }
        $("#menubar > li").removeClass("open");
        $(e.currentTarget).addClass("open");
      });
      $("body").on("mousedown", function(e) {
        if (!$("#menubar").find(e.target).length) {
          $("#menubar > li").removeClass("open");
        }
      });
      $("#toolbar").resizable({
        minWidth: 250,
        mouseButton: 1,
        handles: "e",
        alsoResize: "#tileset, #tileset .jspPane, #tileset .jspContainer, #tileset .jspHorizontalBar *",
        stop: function() {
          $("#tileset").jScrollPane();
        }
      });
      $(document).on("mousedown mouseup", function(e) {
        Editor.mousedown = e.type === "mousedown" && e.which === 1;
      });
      $(document).on("keydown keyup", function(e) {
        var c, down;
        c = e.keyCode;
        down = e.type === "keydown";
        if (e.altKey) {
          Editor.keystatus.altKey = down;
        }
        if (e.ctrlKey) {
          Editor.keystatus.ctrlKey = down;
        }
        if (e.shiftKey) {
          Editor.keystatus.shiftKey = down;
        }
        if (c === 32) {
          Editor.keystatus.spacebar = down;
        }
      });
      $("#tileset, #canvas_wrapper").disableSelection();
      $("#loading_screen").delay(1000).fadeOut();
    };
    Editor.registerEvents = function() {
      var pair, selector, type;
      pair = void 0;
      type = void 0;
      selector = void 0;
      argNames.forEach(function(v) {
        var evt;
        if (Editor[v].events) {
          for (evt in Editor[v].events) {
            pair = evt.split(" ");
            type = pair.shift().replace(/\|/g, " ");
            selector = pair.join(" ");
            $("body").on(type, selector, Editor[v].events[evt]);
          }
        }
      });
    };
    return Editor;
  });

}).call(this);
