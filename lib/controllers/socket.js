module.exports = {};
var io;

// sample users object:
// { user1: { room: 'name of room', x: xCoord, y: yCoord}, user2: {...}, ...}
var users = {};

// sample rooms object:
// { room1: 5, room2: 0, ... }
var rooms = {}; 

// enemies
var allEnemies = {};

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
    // console.log(io.sockets);

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

      // console.log('data', data);
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
      // console.log(socket.rooms);

      console.log(enemies[room]);

      if (enemies.length === 0) {

        console.log('no enemies in room');

        io.in(room).emit(room, {
          user: user,
          others: get(users, room, user),
          x: x,
          y: y
        });

      } else if (allEnemies[room]) {

        console.log('got enemies in memory.. ')

        io.in(room).emit(room, {
          user: user,
          others: get(users, room, user),
          x: x,
          y: y,
          enemies: allEnemies[room]
        });

      } else {

        console.log('querying db for enemies')

        var callbacksFired = 0;

        for (var i = 0, _len = enemies.length; i < _len; i++) {

          var count = enemies[i].count;

          getEnemyData(enemies[i].id).then(function(result){

            enemyData.push({
              data: result,
              count: count
            });

            // console.log('result', result)

            callbacksFired++;
            if (callbacksFired === _len) {

              console.log('enemies ', enemyData);
              allEnemies[room] = enemyData;
              // console.log(enemies[room]);

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


    });

    socket.on('leave', function(data) {
      var user = data.user;
      var mapId = data.mapId;
      delete users[user];

      rooms[mapId]--;

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


var getEnemyData = function(enemyId) {
  return Enemy.findByIdAsync(enemyId);
};

var moveEnemies = function() {
  
  for (var room in rooms) {
    if (rooms[room]) {

      io.in(room).emit('move enemies',{
        param: 'move dem enemies!'
      });

    }
  }

};

var enemyTimer = setInterval(moveEnemies, 2000);


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


