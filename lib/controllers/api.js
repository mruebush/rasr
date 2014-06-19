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
  var email = req.param('username');
  Player.findOneAsync({username: email})
  .then(function(foundPlayer) {
    res.send(foundPlayer);
  })
  .catch(function(err) {
    handleError(err, res);
  });
};

exports.saveScreen = function(req, res) {

  var map = req.body.map;

  var screenId = req.param('screenId');

  Screen.findByIdAndUpdateAsync(screenId, {    
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
  }).then(function(screen) {
    console.log('screen saved');
    console.log(screen);
  });


};

exports.newPlayer = function(req, res) {

  var user = req.body.user;
  var png = req.body.png || 'roshan';


  var player = new Player({
    username: user,
    mapId: '53a26a1aff86b197578b5de6',
    png: png,
    x: 200,
    y: 200
  });

  player.save(function(error, user) {
    if (error) {
      console.log(error); 
    } else { 
      console.log(user);
    }
    res.send(200);
  });
};


var handleError = function(err, res) {
  console.log(err);
  res.send(500, err);
};

