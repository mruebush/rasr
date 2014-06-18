module.exports = {};
var io;
var users = {};
var Promise = require('bluebird');

module.exports.init = function(server, db) {

  // var db = require('../models')(app);
  io = require('socket.io').listen(server);
  io.attach(server);
  Promise.promisifyAll(db);


  io.on('connection', function(socket){

    socket.on('disconnect', function() {
      console.log('a wild connection dissappears');
    });

    console.log('a wild troll appears');

    socket.on('logout', function(data) {
      console.log(data.user + ' logs out at ' + data.x + ',' + data.y + ' in ' + data.mapId);
      
      db.Player.findOneAsync({
        username: data.user
      }).then(function(user) {
        console.log('Saving user data ..');
        user.x = data.x;
        user.y = data.y;
        user.mapId = data.mapId;

        return user.saveAsync();
      }).then(function(user) {
        if (user) {
          console.log(user);
        }
      });

    });

    socket.on('shoot', function(data) {

      console.log(data.user + ' shooting in map ' + data.mapId + ' at ' + data.x + ',' + data.y );

      io.in(data.mapId).emit('shoot', {
        x: data.x,
        y: data.y,
        angle: data.angle,
        num: data.num
      });

    });

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
      // console.log(get(users, room, user));
  
      io.in(room).emit(room, {
        user: user,
        others: get(users, room, user),
        x: x,
        y: y
      });

      // console.log(users);

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
      // console.log(users);
    });

    socket.on('move', function(data) {

      var emitter = data.user;

      // console.log(data);

      if (users[emitter]) {
        
        var dir = data.dir;
        var room = data.room;
        var x = data.x;
        var y = data.y;
        // console.log(emitter + ' moved to ' + x + ',' + y);
        users[emitter].x = x;
        users[emitter].y = y;

        io.in(room).emit('move', {
          user: emitter,
          dir: dir,
          x: x,
          y: y
        });

      }


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
  var obj;
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