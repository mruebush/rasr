(function() {
  define(['events'], function(events) {
    return function(rootUrl) {
      var actions, socket, _joinListener, _leaveListener, _moveListener;
      socket = io.connect();
      actions = {};
      actions.join = function(mapId, thisUser, initPos) {
        socket.emit('join', {
          user: thisUser,
          mapId: mapId,
          x: initPos.x,
          y: initPos.y
        });
        console.log("" + thisUser + " emitted join on " + mapId);
        _joinListener(mapId, thisUser);
        _leaveListener(mapId, thisUser);
        return _moveListener(thisUser);
      };
      actions.leave = function(mapId, thisUser) {
        return socket.emit('leave', {
          user: thisUser,
          mapId: mapId
        });
      };
      actions.message = function(message, mapId, thisUser) {
        return socket.emit('message', {
          user: thisUser,
          message: message,
          room: mapId
        });
      };
      actions.move = function(dir, user, mapId, x, y) {
        return socket.emit('move', {
          dir: dir,
          user: user,
          room: mapId,
          x: x,
          y: y
        });
      };
      _leaveListener = function(mapId, user) {
        return socket.on('leave', function(data) {
          if (data.user !== user) {
            return console.log("" + data.user + " just left the map");
          }
        });
      };
      _joinListener = function(mapId, thisUser) {
        return socket.on(mapId, function(data) {
          if (data.user !== thisUser) {
            return actions.trigger('join', data);
          } else {
            return actions.trigger('others', data);
          }
        });
      };
      _moveListener = function(user) {
        return socket.on('move', function(data) {
          if (data.user !== user) {
            return actions.trigger('move', data);
          }
        });
      };
      actions = events(actions);
      window.actions = actions;
      return actions;
    };
  });

}).call(this);
