'use strict';

var Promise = require('bluebird');
var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    Player = mongoose.model('Player'),
    Screen = mongoose.model('Screen');

Promise.promisifyAll(Player);

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};


exports.getPlayer = function(req, res) {
  var email = req.param('email');
  Player.findOneAsync({username: email})
  .then(function(foundPlayer) {
    res.send(foundPlayer);
  })
  .catch(function(err) {
    handleError(err, res);
  });
};

exports.saveScreen = function(req, res) {

  // console.log(req.param('screenId'));
  // console.log(req.body);

  var map = req.body.map;

  var screenId = req.param('screenId');

  Screen.findByIdAndRemoveAsync(screenId)
  .then(function(result) {
    console.log('removed:');
    console.log(result);
    console.log('map', map);

    var screen = new Screen({
      height: map.height,
      width: map.width,
      layers: map.layers,
      orientation: map.orientation,
      properties: map.properties,
      tileheight: map.tileheight,
      tilewidth: map.tilewidth,
      tilesets: map.tilesets,
      version: map.version,
      upScreen: map.upScreen,
      rightScreen: map.rightScreen,
      downScreen: map.downScreen,
      leftScreen: map.leftScreen
    });

    screen.save(function(error, screen) {
      if (error) {
        console.log(error);
        res.send(500);
      } else {
        console.log(screen);
        res.send(202);
      }

    });

  });

};

// exports.test = function(req, res) {

//   var user = req.param('userId');
//   var png = req.body.png;

//   Player.findByIdAndRemoveAsync(user)
//   .then(function(result) {
//     console.log('removed ..');
//     console.log(result);

//     var player = new Player({
//       username: 'cilo',
//       mapId: '539cd0a29f9d7bb80c057556',
//       png: png,
//       x: 200,
//       y: 200
//     });

//     // console.log(player.save);
//     // console.log(Promise.promisify(player.save));

//     player.save(function(error, user) {
//       if (error) {
//         console.log(error); 
//       } else { 
//         console.log(user);
//       }
//       res.send(200);
//     });

//     // return Promise.promisify(player.save);
//   })
  // .then(function(data) {
  //   console.log(data);
  //   res.send(200);
  // });

// };

var handleError = function(err, res) {
  console.log(err);
  res.send(500, err);
};

// exports.newPlayer = function(user) {

//   var username = req.body.username;
//   var png = req.body.png;
//   var mapId = '539cd0a29f9d7bb80c057556';

//   var player = new Player({
//     username: username,
//     x: 20,
//     y: 20,
//     png: png,
//     mapId: mapId
//   });

//   player.save(function(a,b) {
//     console.log(a);
//     console.log(b);
//   });

// };