(function() {
  define(function() {
    var Fx;
    Fx = (function() {
      function Fx() {
        this.sprite = null;
        console.log('new fx');
      }

      Fx.prototype.preload = function() {};

      Fx.prototype.create = function() {};

      Fx.prototype.update = function() {};

      return Fx;

    })();
    return Fx;
  });

}).call(this);
