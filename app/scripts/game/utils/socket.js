(function() {
  define(['events'], function(events) {
    return function(rootUrl) {
      var actions, socket, _joinListener, _leaveListener, _moveListener;
      socket = io.connect();
      actions = {};
      actions.logout = function(mapId, user, x, y) {
        return socket.emit('logout', {
          user: user,
          mapId: mapId,
          x: x,
          y: y
        });
      };
      actions.join = function(mapId, user, initPos) {
        socket.emit('join', {
          user: user,
          mapId: mapId,
          x: initPos.x,
          y: initPos.y
        });
        _joinListener(mapId, user);
        _leaveListener(mapId, user);
        return _moveListener(user);
      };
      actions.leave = function(mapId, user) {
        return socket.emit('leave', {
          user: user,
          mapId: mapId
        });
      };
      actions.message = function(message, mapId, user) {
        return socket.emit('message', {
          user: user,
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
            return actions.trigger('player leave', data.user);
          }
        });
      };
      _joinListener = function(mapId, user) {
        return socket.on(mapId, function(data) {
          if (data.user !== user) {
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
