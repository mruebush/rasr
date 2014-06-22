'use strict';

var Promise = require('bluebird');
var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    Player = mongoose.model('Player'),
    Enemy = mongoose.model('Enemy'),
    Screen = mongoose.model('Screen'),
    path = require('path');


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

exports.populateEnemy = function(req, res) {

  var screen;
  var mapId = req.body.mapId;
  var count = req.body.count;
  var positions = req.body.positions;

  console.log(positions);

  // The name of the enemy to add
  var enemyName = req.body.enemy;

  Screen.findByIdAsync(mapId)
  .then(function(results) {

    screen = results;
    
    return Enemy.findAsync({
      name: enemyName
    });

  }).then(function(results) {

    var enemyId = results[0]._id;

    screen.enemies = screen.enemies || {};
    screen.enemies[enemyId] = screen.enemies[enemyId] || {};

    screen.enemies[enemyId].count = count;
    screen.enemies[enemyId].positions = positions;

    return screen.saveAsync();

    
  }).then(function(result){
    console.log(result);
  })
  .catch(function(err) {
    console.log('error in populateEnemy', err);
    res.end('Error');
  });
  
};

exports.makeEnemy = function(req, res) {
  // Expects name, mapId, png, speed and health 
  var enemyData = req.body;
  // console.log(req.body);
  // console.log(enemyData);

  new Enemy(enemyData).saveAsync().then(function(result) {
    if (result) {
      console.log (result);
      res.end('Created');
    } else {
      res.end('Internal server error, bad query');
    }
  }).catch(function(err) {
    console.log('error in makeEnemy', err);
    res.end('Enemy exists');
  });

};


exports.getPlayer = function(req, res) {
  var name = req.user.name;
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
  var map = JSON.parse(req.body.map);
  delete map._id;
  var screenId = req.param('screenId');
  console.log('updating MAP: ', typeof map);
  // JSON.parse(map);

  Screen.findByIdAndUpdate(screenId, map, function(err, result) {
    if (err) {
      console.log('You fucked uppp', err);
      res.send(500);
    } else {
      console.log('Updated map');
      res.send(200);
    }
  });
};

exports.saveTileSet = function(req, res) {
  // var data = req.body.data;
  var fileName = req.body.name;
  var filePath = path.join(__dirname, 'app/assets/tilemaps/tiles/', fileName);
  req.pipe(filePath);

  req.on('end', function() {
    console.log('uploaded?', filePath);
    res.send('uploaded!');
  });

  // fs.readFileAsync(req.body.data)
  // .then(function(data) {
  //   var newPath = __dirname + "/uploads/uploadedFileName";
  //   return fs.writeFileAsync(newPath, data, function (err) {
  //     res.redirect("back");
  //   });
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

