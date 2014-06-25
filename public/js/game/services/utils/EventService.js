(function() {
  var __slice = [].slice;

  app.factory('Events', function() {
    return function(obj) {
      obj._listeners = {};
      obj.on = function(key, callback) {
        if (obj._listeners[key]) {
          obj._listeners[key].push(callback);
        } else {
          obj._listeners[key] = [callback];
        }
      };
      obj.trigger = function() {
        var callback, callbacks, data, i, key;
        key = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (obj._listeners[key]) {
          callbacks = obj._listeners[key];
          i = 0;
          while (i < callbacks.length) {
            callback = callbacks[i];
            callback.apply(null, data);
            i++;
          }
        }
      };
      return obj;
    };
  });

}).call(this);
