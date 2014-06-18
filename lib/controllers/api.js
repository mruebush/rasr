'use strict';

var Promise = require('bluebird');
var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    Player = mongoose.model('Player');

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