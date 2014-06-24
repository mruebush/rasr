module.exports = {};
// var _ = require('lodash');
var io;

// sample users object:
// { user1: { room: 'name of room', x: xCoord, y: yCoord, xp:, level:}, user2: {...}, ...}
var users = {};

// sample rooms object:
// { room1: 5, room2: 0, ... }
var rooms = {}; 

// enemies
var allEnemies = {};

// var allEnemies = {};
// allEnemies looks like:
// { '<ROOM ID>': { '<enemy ID #1>': { '0': Object, '1': Object, '2': Object } } }
//
// where Object = { 
//        pos: [x,y]
//        health: 5,
//       }

var xpToLevel = require('./level').level;
var speedBoost = require('./level').speed;

var Promise = require('bluebird');
var mongoose = require('mongoose'),
    Player = mongoose.model('Player'),
    Enemy = mongoose.model('Enemy');

Promise.promisifyAll(Player);


module.exports.init = function(server) {

  io = require('socket.io').listen(server);
  io.attach(server);


  io.on('connection', function(socket){

    // get all player info as soon as they log in
    console.log('a wild troll appears');

    socket.on('login', function(user) {

      Player.findOneAsync({
        username: user
      }).then(function(result) {

        users[user] = {
          room: result.mapId,
          png: result.png,
          speed: result.speed,
          xp: +result.xp,
          level: +result.level,
          x: result.x,
          y: result.y
        };

        console.log('loaded ', users[user]);

      });

      io.emit('message', {
        user: 'Server',
        message: user + ' has joined the game!'
      });

    });

    socket.on('resetAll', function(data) {
      users[data.user].xp = 0;
      users[data.user].level = 1;
    });

    socket.on('freeXp', function(data) {

      var user = data.user;
      users[data.user].xp += data.xp;
      console.log("Awarded " + data.xp + " free xp to " + user);

      var message = user + ' was awarded ' + data.xp + ' free xp';

      if (users[user].xp >= xpToLevel(users[user].level)) {

        users[user].level++;
        users[user].xp = 0;
        message = user + ' reached level ' + users[user].level;
        
      }

      io.emit('message', {
        user: 'Server',
        message: message
      });

      console.log(speedBoost(users[user].level));

      io.emit('levelUp', {
        speed: speedBoost(users[user].level)
      });

    });
    

    socket.on('enemyDies', function(data) {


      var room = data.mapId;
      var user = data.user;

      delete allEnemies[room][data._id][data.enemy];

      io.in(room).emit('derenderEnemy', data);
      var message = user + ' has slain a ' + data.enemyName + ' for ' + data.xp + ' exp!';

      users[user].xp += data.xp;

      console.log('current xp ', users[user].xp);
      console.log('total xp needed to level', xpToLevel(users[user].level));
      
      if (users[user].xp >= xpToLevel(users[user].level)) {

        users[user].level++;
        users[user].xp = 0;
        message = user + ' reached level ' + users[user].level;
        
        io.in(room).emit('levelUp', {
          speed: speedBoost(users[user].level),
          user: user
        });

      }

      io.in(room).emit('message', {
        user: 'Server',
        message: message
      });


    });


    socket.on('disconnect', function() {
      console.log('a wild connection dissappears');
    });

    socket.on('damageEnemy', function(data) {
      console.log(data.user + ' damages enemy ' + data.enemy + ' in ' + data.room);
      // console.log(allEnemies[data.room][data._id])

      if (allEnemies[data.room]) {
        if (allEnemies[data.room][data._id]) {

          if (allEnemies[data.room][data._id][data.enemy]) {
            
            allEnemies[data.room][data._id][data.enemy].health--;

            io.in(data.room).emit('damageEnemy', {
              serverId: data.enemy
            });
          }

        }
      } else {
        console.log ('crash avoided')
      }


    });



    socket.on('logout', function(data) {
      console.log(data.user + ' logs out at ' + data.x + ',' + data.y + ' in ' + data.mapId);

      var userData = users[data.user];

      Player.findOneAndUpdate({
        username: data.user
      }, {
        x: userData.x,
        y: userData.y,
        mapId: userData.room,
        level: userData.level,
        xp: userData.xp
      }, null, function(){
        console.log(arguments);
      });

    });

    socket.on('shoot', function(data) {

      // console.log(data.user + ' shooting in map ' + data.mapId + ' at ' + data.x + ',' + data.y );

      io.in(data.mapId).emit('shoot', {
        user: data.user,
        x: data.x,
        y: data.y,
        angle: data.angle,
        num: data.num
      });

    });

    socket.on('stopEnemy', function(data) {

      if (allEnemies[data.room]) {
        if (allEnemies[data.room][data._id]) {
          if (allEnemies[data.room][data._id][data.enemy]) {
            allEnemies[data.room][data._id][data.enemy].position[0] = data.x;
            allEnemies[data.room][data._id][data.enemy].position[1] = data.y;
          }
        }
      }
      
    });

    socket.on('troll', function(){
      console.log(users);
    });


    socket.on('join', function(data) {

      var room = data.mapId;
      var user = data.user;
      var x = data.x;
      var y = data.y;
      var enemies = data.enemies;

      socket.join(room);

      rooms[room] && rooms[room]++;
      rooms[room] = rooms[room] || 1;

      users[user] = extend({
        name: user,
        room: room,
        x: x,
        y: y
      }, users[user]);

      console.log(user + ' joined ' + room + ' in ' + x + ',' + y);
      
      if (enemies.length === 0) {

        console.log('no enemies in room');

        io.in(room).emit(room, {
          user: user,
          others: getOtherUsersInRoom(room, user),
          x: x,
          y: y
        });

      } else if (allEnemies[room]) {

        console.log('got enemies in memory.. ');

        io.in(room).emit(room, {
          user: user,
          others: getOtherUsersInRoom(room, user),
          x: x,
          y: y,
          enemies: allEnemies[room]
        });

      } else {

        console.log('querying db for enemies');
        allEnemies[room] = {};
        for (var i = 0, _len = enemies.length; i < _len; i++) {

          var monsterId = data.enemies[i].id;
          
          allEnemies[room][monsterId] = {};

          for (var j = 0, _len2 = enemies[i].count; j < _len2; j++) {
            allEnemies[room][monsterId][j] = {};
            allEnemies[room][monsterId][j].position = data.positions[monsterId][j];
          }
        }

        var callbacksFired = 0;

        for (var i = 0, _len = enemies.length; i < _len; i++) {

          var count = enemies[i].count;
          var enemyId = enemies[i].id;

          getEnemyData(enemyId).then(function(result){

            pushInfo(allEnemies[room][enemyId], {
              health: result.health,
              name: result.name,
              _id: result._id,
              png: result.png,
              speed: result.speed,
              xp: result.xp
            });

            callbacksFired++;
            if (callbacksFired === _len) {

              io.in(room).emit(room, {
                user: user,
                others: getOtherUsersInRoom(room, user),
                x: x,
                y: y,
                enemies: allEnemies[room]
              });

            }
          });
        }
      }
    });

    socket.on('leave', function(data) {
      var user = data.user;
      var mapId = data.mapId;

      rooms[mapId]--;

      io.in(mapId).emit('leave', {
        user: user
      });

      socket.leave(mapId);
      console.log(user + ' left ' + mapId);
      
    });

    socket.on('move', function(data) {

      var emitter = data.user;

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

      var message = data.message.message;
      var user = data.message.user;

      console.log('recieved message ' + message);
      io.emit('message', {
        message: message,
        user: user
      })

    });

  });

};


var getEnemyData = function(enemyId) {
  return Enemy.findByIdAsync(enemyId);
};

var moveEnemies = function() {

  var nums = [];
  
  for (var room in rooms) {
    if (rooms[room] && allEnemies[room]) {
      for (var dbId in allEnemies[room]) {
          for (var id in allEnemies[room][dbId]){
            nums.push(Math.floor(Math.random() * 4));
          }
      }
      io.in(room).emit('move enemies',{
        param: 'move dem enemies!',
        nums: nums 
      });
    }
  }

};


var enemyTimer = setInterval(moveEnemies, 2500);


var pushInfo = function(enemies, data) {

  for (var key in enemies) {
    enemies[key].health = data.health;
    enemies[key].name = data.name;
    enemies[key]._id = data._id;
    enemies[key].png = data.png;
    enemies[key].speed = data.speed;
    enemies[key].xp = data.xp;
   }

};

var extend = function(from, to) {

  to = to || {};

  for (var key in from) {
    to[key] = from[key];
  }

  return to;

};

var getOtherUsersInRoom = function(room, user) {
  var res = [];
  var obj = {};

  for (var otherUser in users) {

    // users[otherUser].room is sometimes an object ! (dont know why)
    var fixed = JSON.stringify(users[otherUser].room).replace(/"/g,'');

    if (fixed === room && otherUser !== user) {
      
      obj = users[otherUser];
      obj.user = otherUser;
      res.push(obj);
      
    }
  }

  return res;
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


