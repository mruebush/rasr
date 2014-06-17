module.exports = {};
var io;
var userData = {};

module.exports.init = function(server) {

  io = require('socket.io').listen(server);
  io.attach(server);

  io.on('connection', function(socket){

    console.log('a wild connection appears');

    socket.on('join', function(room) {

      socket.join(room);
      console.log('socket joined ' + room);

    });

    socket.on('leave', function(data) {

      var user = data.user;
      var mapId = data.mapId;

      socket.leave(mapId);
      io.in(mapId).emit(mapId, {
        message: 'user ' + user + ' left room',
        user: user
      });
      console.log('socket left ' + room);
    });

    socket.on('move', function(data) {

    });

    socket.on('message', function(data){

      var message = data.message;
      var room = data.room;
      var user = data.user;

      console.log('recieved message' + message);

      io.in(room).emit(room, {
        message: message,
        user: user
      });

    });

  });



};


module.exports.connect = function(user, mapId) {
  userData[user] = mapId;
};

module.exports.disconnect = function(user) {
  delete userData[user];
};
