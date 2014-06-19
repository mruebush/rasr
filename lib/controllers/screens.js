var Promise = require('bluebird');
var sampleScreens = require('../util/sampleScreens')();
var mongoose = require('mongoose');
var Screen = mongoose.model('Screen');

var boardWidth = 32;
var boardHeight = 24;

Promise.promisifyAll(Screen);

var oppositeDirections = {
  left: 'right',
  right: 'left',
  up: 'down',
  down: 'up'
};

exports.moveScreen = function(req, res) {
  var direction = req.param('direction');
  var currentObjectId = req.param('currentScreenId');
  Screen.findById(currentObjectId).populate(direction+'Screen')
  .exec(function(err, currentScreen) {
    if (err) {
      handleError(err, res);
    } else {
      var toSend = currentScreen[direction+'Screen'];
      if (toSend) {
        res.send(toSend)
      } else {
        res.send({error: 'no screen in that direction'});
      }
    }
  })
};

exports.createPlacedScreen = function(req, res, worldCreation) {
  // FOR world creation - third argument passed in
  if (worldCreation) {
    var direction = req;
    var newScreen = res;
    var currentObjectId = worldCreation;
  } else {
    var direction = req.param('direction');
    var newScreen = req.body.newScreen;
    var currentObjectId = mongoose.Types.ObjectId(req.param('currentScreenId'));
  }

  var adjacentDirections = {
    'up': 'right',
    'right': 'down',
    'down': 'left',
    'left': 'up'
  }

  // create new screen
  return Screen.createAsync(newScreen)
  .then(function(createdScreen) {
    return exports.addDirectionReference(direction, currentObjectId, createdScreen._id)
  })
  // go around the horn, adding all necessary references
  .then(function(createdScreenId) {
    return exports.placementHelper(currentObjectId, createdScreenId, direction, adjacentDirections[direction]);
  })
  .catch(function(err) {
    handleError(err, res);
  });
};

exports.peripheralRefs = function(fromScreenId, toScreenId, doneDir, toGoDir) {
  return Screen.findByIdAsync(fromScreenId)
  .then(function(foundScreen) {
    if (foundScreen[toGoDir + 'Screen']) {
      return foundScreen.populateAsync(toGoDir + 'Screen');
    } else {
      return new Promise(function(onResolved, onRejected) {
        onRejected(toScreenId);
      });
    }
  })
  .then(function(foundScreen) {
    var connectionScreenId = foundScreen[toGoDir + 'Screen'][doneDir + 'Screen']
    if (connectionScreenId) {
      return exports.addDirectionReference(toGoDir, toScreenId, connectionScreenId)
    } else {
      return new Promise(function(onResolved, onRejected) {
        onRejected(toScreenId);
      })
    }
  })
}

exports.placementHelper = function(fromScreenId, toScreenId, doneDir, toGoDir) {
  // will have to circle two ways around toScreenId
  var toGoOppositeDirection = oppositeDirections[toGoDir];
  // boolean to decrease number of calls to database
  var backsideConnection = false

  return exports.peripheralRefs(fromScreenId, toScreenId, doneDir, toGoDir) // should return (connectionScreenId, toScreenId)
  .then(function(peripheralScreenId) {
    return exports.peripheralRefs(peripheralScreenId, toScreenId, toGoOppositeDirection, doneDir) // should return (endPeriph, toScreenId)
  })
  .catch(function() {
    // if first loop around failed, catch failure and continue it along then chain
    return new Promise(function(onResolved, onRejected) {
      onResolved(null); // make it clear that no endPeriph found on first go around
    })
  })
  .then(function(endPeripheralScreenId) {
    // if peripheralScreenId and backsideConnection already made,
    // no need to check all the way around when circling opposite way around.
    if (endPeripheralScreenId) {
      backsideConnection = true;
    }
    return exports.peripheralRefs(fromScreenId, toScreenId, doneDir, toGoOppositeDirection);
  })
  .then(function(peripheralScreenId) {
    // no need to check backsideConnection if that has already been hooked up
    if (!backsideConnection) {
      return exports.peripheralRefs(peripheralRefs, fromScreenId, toGoDir, doneDir);
    } else {
      return new Promise(function(onResolved, onRejected) {
        onResolved(toScreenId);
      })
    }
  })
  // catch onRejected's from above, and return our toScreenId back to where we started.
  .catch(function() {
    return new Promise(function(onResolved, onRejected) {
      onResolved(toScreenId);
    })
  })
};


exports.addDirectionReference = function(direction, fromScreenId, toScreenId) {
  // exports.checkDirection(direction, fromScreenId)
  return Screen.findByIdAsync(fromScreenId)
  .then(function(foundScreen) {
    if (!foundScreen[direction + 'Screen']) {
      var update = {}
      update[direction + 'Screen'] = toScreenId;
      return Screen.findByIdAndUpdateAsync(fromScreenId, update)
    }
  })
  .then(function(screened) {
    direction = oppositeDirections[direction];
    return Screen.findByIdAsync(toScreenId)
  })
  .then(function(foundScreen) {
    if (!foundScreen[direction + 'Screen']) {
      // add reverse reference as well
      var property = direction + 'Screen';
      var update = {}
      update[direction + 'Screen'] = fromScreenId;
      return Screen.findByIdAndUpdateAsync(toScreenId, update);
    }
  })
  .then(function() {
    return new Promise(function(onResolved, onRejected) {
      onResolved(toScreenId, fromScreenId);
    });
  })
  .catch(function(err) {
    handleError(err, res);
  });

};

exports.getScreen = function(req, res) {
  var screenId = req.param('screenId');
  Screen.findByIdAsync(screenId)
  .then(function(foundScreen) {
    console.log(foundScreen);
    res.send(foundScreen);
  })
  .catch(function(err) {
    console.log('didnt find it', err);
    handleError(err, res);
  });
};

exports.deleteScreen = function(req, res) {
  var screenId = req.body.screenId;

  Screen.findByIdAndRemove(screenId)
  .then(function(deletedScreen) {
    res.send({success: true, deletedScreen: deletedScreen});
  })
  .catch(function(err) {
    handleError(err, res);
  })
};

handleError = function(err, res) {
  console.log(err);
  res.send(500, err);
};
