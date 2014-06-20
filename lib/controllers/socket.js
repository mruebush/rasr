module.exports = {};
var io;

// sample users object:
// { user1: { room: 'name of room', x: xCoord, y: yCoord}, user2: {...}, ...}
var users = {};

// sample rooms object:
// { room1: 5, room2: 0, ... }
var rooms = {}; 

var Promise = require('bluebird');
var mongoose = require('mongoose'),
    Player = mongoose.model('Player'),
    Enemy = mongoose.model('Enemy');

Promise.promisifyAll(Player);


module.exports.init = function(server) {

  io = require('socket.io').listen(server);
  io.attach(server);


  io.on('connection', function(socket){

    socket.on('disconnect', function() {
      console.log('a wild connection dissappears');
    });

    console.log('a wild troll appears');

    socket.on('logout', function(data) {
      console.log(data.user + ' logs out at ' + data.x + ',' + data.y + ' in ' + data.mapId);
      
      Player.findOneAsync({
        username: data.user
      }).then(function(user) {
        console.log(user)
        console.log('Saving user data .. ' + data.mapId);
        user.x = data.x;
        user.y = data.y;
        user.mapId = data.mapId;


        user.save();
      });

    });

    socket.on('shoot', function(data) {

      // console.log(data.user + ' shooting in map ' + data.mapId + ' at ' + data.x + ',' + data.y );

      io.in(data.mapId).emit('shoot', {
        x: data.x,
        y: data.y,
        angle: data.angle,
        num: data.num
      });

    });

    socket.on('troll', function() {
      console.log(socket.rooms);
    });

    socket.on('join', function(data) {

      var room = data.mapId;
      var user = data.user;
      var x = data.x;
      var y = data.y;
      var enemies = data.enemies;
      var enemyData = [];

      // console.log(enemies);

      socket.join(room);

      rooms[room] && rooms[room]++;
      rooms[room] = rooms[room] || 1;

      users[user] = {
        room: room,
        x: x,
        y: y
      };

      console.log(user + ' joined ' + room + ' in ' + x + ',' + y);
      console.log(socket.rooms)
      // console.log(users);
      // console.log(get(users, room, user));

      // if enemies
       // do loop get into and then emit
      // else just emit

      if (enemies.length === 0) {

        io.in(room).emit(room, {
          user: user,
          others: get(users, room, user),
          x: x,
          y: y
        });

      } else {

        var callbacksFired = 0;

        for (var i = 0, _len = enemies.length; i < _len; i++) {

          var count = enemies[i].count;

          getEnemyData(enemies[i].id).then(function(result){
            // console.log(result);

            // enemyData.push(result);


            enemyData.push({
              data: result,
              count: count
            });


            callbacksFired++;
            if (callbacksFired === _len) {

              console.log('enemies ', enemies)
              io.in(room).emit(room, {
                user: user,
                others: get(users, room, user),
                x: x,
                y: y,
                enemies: enemyData
              });

            }
          });

        }

      }

  

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

// var isEmpty = function(room) {
//   for (var user in users) {
//     if (user.room === room) {
//       return true;
//     }
//   }
//   return false;
// };
var getEnemyData = function(enemyId) {
  return Enemy.findByIdAsync(enemyId);
};

var processEnemyData = function(enemy) {

}

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


