module.exports = {};
var io;
var users = {};

module.exports.init = function(server) {

  io = require('socket.io').listen(server);
  io.attach(server);

  io.on('disconnect', function(socket) {
    console.log('a wild connection dissappears');
  });

  io.on('connection', function(socket){

    console.log('a wild connection appears');

    socket.on('join', function(data) {
      var room = data.mapId;
      var user = data.user;
      var x = data.x;
      var y = data.y;

      socket.join(room);

      users[user] = {
        room: room,
        x: x,
        y: y
      };

      console.log(user + ' joined ' + room);
      console.log(users);
      console.log(get(users,room,user));
  
      io.in(room).emit(room, {
        user: user,
        others: get(users, room, user),
        x: x,
        y: y
      });

    });

    socket.on('leave', function(data) {
      var user = data.user;
      var mapId = data.mapId;
      delete users[user];
      io.in(mapId).emit('leave', {
        user: user
      });
      socket.leave(mapId);
      console.log(user + ' left ' + mapId);
    });

    socket.on('move', function(data) {

      var dir = data.dir;
      var emitter = data.user;
      var room = data.room;
      var x = data.x;
      var y = data.y;
      users[emitter].x = x;
      users[emitter].y = y;
      // console.log(emitter + ' moved to ' + x + ',' + y);

      io.in(room).emit('move', {
        user: emitter,
        dir: dir,
        x: x,
        y: y
      });

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

var get = function(users, room, user) {
  var res = [];
  for (var key in users) {
    if (key !== user && users[key].room === room) {
      obj = users[key];
      obj.user = key;
      res.push(obj);
    }
  }
  return res;
};


module.exports.connect = function(user, mapId) {
  userData[user] = mapId;
};

module.exports.disconnect = function(user) {
  delete userData[user];
};