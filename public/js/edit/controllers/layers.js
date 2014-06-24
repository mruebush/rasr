(function() {
  define(function() {
    var Editor, Layers;
    Layers = {};
    Editor = void 0;
    Layers.initialize = function() {
      Editor = require("editor");
      Editor.$("#layerlist").sortable({
        axis: "y",
        mouseButton: 1,
        appendTo: document.body,
        update: this.sortByIndex,
        containment: "#layers > div"
      });
      this.add("background");
      this.add("world");
    };
    Layers.events = {
      "click #layer-clear": function(e) {
        Layers.clear(e);
      },
      "click #layer-rename": function(e) {
        Layers.rename(e);
      },
      "click #layer-remove": function(e) {
        Layers.remove(e);
      },
      "click #layers-add": function(e) {
        Layers.add();
      },
      "click #layerlist li": function(e) {
        Editor.$("#layerlist li").removeClass("active");
        Editor.$(e.currentTarget).addClass("active");
      },
      "click #layerlist li span:first-child": function(e) {
        Layers.toggleVisibility(e);
      },
      "click #layerlist li span:last-child": function(e) {
        Layers.openContextmenu(e);
      },
      mousedown: function(e) {
        if ($(e.target).parent().attr("id") !== "contextmenu" ? $("body #contextmenu").length : void 0) {
          $("body #contextmenu").remove();
        }
      }
    };
    Layers.add = function(name) {
      var id, ids;
      id = 0;
      ids = [];
      if ($("#layerlist li").length) {
        Editor.$("#layerlist li").each(function() {
          ids.push(+this.getAttribute("data-id"));
        });
        while (ids.indexOf(id) !== -1) {
          id++;
        }
      }
      if (!name) {
        name = window.prompt("Layer name: (a-z, A-Z, _, -)");
      }
      if (!name || !name.match(/^[a-zA-Z_-][a-zA-Z0-9_-]{2,}$/)) {
        if (name) {
          alert("Name invalid or too short!");
        }
        return;
      }
      Editor.$("#layerlist li").removeClass("active");
      Editor.$("#layerlist").append("<li class='active' data-id='" + id + "'><span class='fa fa-eye'></span> " + name + "<span class='fa fa-cog'></span></li>");
      Editor.$("#layerlist").sortable("refresh");
      Editor.$("#tiles").append("<div class='layer' data-name='" + name + "' data-id='" + id + "'></div>");
      Layers.sortByIndex();
    };
    Layers.remove = function() {
      var id, name;
      name = $(Layers.contextTarget).text().trim();
      id = $(Layers.contextTarget).attr("data-id");
      if (confirm("Remove \"" + name + "\" ?")) {
        if ($("#layerlist li").length === 1) {
          alert("Cannot remove last layer!");
          return;
        }
        Editor.$(Layers.contextTarget).remove();
        Editor.$("#contextmenu").remove();
        Editor.$(".layer[data-id=" + id + "]").remove();
      }
    };
    Layers.clear = function(e) {
      var id, name;
      name = $(Layers.contextTarget).text().trim();
      id = $(Layers.contextTarget).attr("data-id");
      if (confirm("Remove all tiles from \"" + name + "\" ?")) {
        Editor.$(".layer[data-id=" + id + "]").html("").attr({
          "data-tileset": "",
          "class": "layer"
        });
        Editor.$("#contextmenu").remove();
      }
    };
    Layers.rename = function(e) {
      var id, name, newName;
      name = $(Layers.contextTarget).text().trim();
      id = $(Layers.contextTarget).attr("data-id");
      newName = prompt("Enter new name for \"" + name + "\":");
      if (!newName || newName.length < 3) {
        if (newName) {
          alert("Name too short!");
        }
        return;
      }
      Editor.$(".layer[data-id=" + id + "]").attr("data-name", newName);
      Editor.$(Layers.contextTarget).html("<span class='fa fa-eye'></span> " + newName + "<span class='fa fa-cog'></span>");
      Editor.$("#contextmenu").remove();
    };
    Layers.getActive = function() {
      var id;
      id = $("#layerlist li.active").attr("data-id");
      return {
        id: $("#layerlist li.active").attr("data-id"),
        elem: $(".layer[data-id=" + id + "]")[0]
      };
    };
    Layers.sortByIndex = function(e, ui) {
      Editor.$("#layerlist li").each(function(i) {
        var id;
        id = $(this).attr("data-id");
        Editor.$(".layer[data-id=" + id + "]").css("z-index", i);
      });
    };
    Layers.toggleVisibility = function(e) {
      var className, id, visible;
      visible = $(e.currentTarget).hasClass("fa fa-eye");
      className = (visible ? "fa fa-eye-slash" : "fa fa-eye");
      id = $(e.currentTarget).parent().attr("data-id");
      Editor.$(e.currentTarget).attr("class", "icon " + className);
      Editor.$(".layer[data-id=" + id + "]").toggle(!visible);
    };
    Layers.openContextmenu = function(e) {
      Layers.contextTarget = $(e.currentTarget).parent();
      Editor.$.get("/partials/edit/cm_layer.html", function(data) {
        Editor.$("body").append(data);
        Editor.$("#contextmenu").css("left", e.pageX);
        Editor.$("#contextmenu").css("top", e.pageY);
      });
    };
    return Layers;
  });

}).call(this);
