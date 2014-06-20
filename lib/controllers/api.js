'use strict';

var Promise = require('bluebird');
var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    Player = mongoose.model('Player'),
    Screen = mongoose.model('Screen');

Promise.promisifyAll(Player);
Promise.promisifyAll(Screen);

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
  var name = req.param('name');
  console.log('getPlayer', name);
  return Player.findOneAsync({username: name})
  .then(function(foundPlayer) {
    console.log('found player', foundPlayer);
    if (foundPlayer) {
      // check to make sure player has valid mapId
      return Screen.findByIdAsync(foundPlayer.mapId)
      .then(function(foundScreen) {
        if (!foundScreen) {
          // update player with new mapId
          return Screen.findAsync()
          .then(function(screens) {
            var mapId = screens[0]._id;
            return Player.findOneAndUpdateAsync(
              {username: name}, 
              {mapId: mapId})
            .then(function(updatedPlayer) {
              console.log('updated!', updatedPlayer);
              res.send(updatedPlayer);
            })
            .catch(function(err) {
              handleError(err, res);
            })
          })
        } else {
          // player already has valid mapId
          res.send(foundPlayer);
        }
      })
    } else {
      // didn't find player...
      handleError(err, res);
    }
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

  Screen.findAsync()
  .then(function(screen) {
    var mapId = screen[0]._id;
    var player = new Player({
      username: user,
      mapId: mapId,
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
  });

};

var handleError = function(err, res) {
  console.log(err);
  res.send(500, err);
};

