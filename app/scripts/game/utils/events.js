(function() {
  define(function() {
    return function(obj) {
      obj._listeners = {};
      obj.on = function(key, callback) {
        if (obj._listeners[key]) {
          obj._listeners[key].push(callback);
        } else {
          obj._listeners[key] = [callback];
        }
      };
      obj.trigger = function(key) {
        var callback, callbacks, i;
        if (obj._listeners[key]) {
          callbacks = obj._listeners[key];
          i = 0;
          while (i < callbacks.length) {
            callback = callbacks[i];
            callback.apply(null, Array.prototype.slice.call(arguments, 1));
            i++;
          }
        }
      };
      return obj;
    };
  });

}).call(this);
