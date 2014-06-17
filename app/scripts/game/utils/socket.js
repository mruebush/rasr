(function() {
  define(['socketio'], function(io) {
    return function(rootUrl) {
      var actions, socket, _joinListener, _leaveListener, _moveListener;
      socket = io.connect(rootUrl);
      actions = {};
      actions.join = function(mapId, thisUser) {
        socket.emit('join', mapId);
        return _joinListener(mapId, thisUser);
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
      actions.move = function(x, y, mapId, thisUser) {
        return socket.emit('move', {
          x: x,
          y: y,
          user: thisUser,
          mapId: mapId
        });
      };
      _leaveListener = function(mapId, user) {
        return socket.on('leave', function(mapId, user, thisUser) {});
      };
      _joinListener = function(mapId, thisUser) {
        return socket.on(mapId, function(data) {
          if (data.user === !thisUser) {
            return console.log(data.message);
          }
        });
      };
      _moveListener = function(x, y, mapId, user) {};
      return actions;
    };
  });

}).call(this);
