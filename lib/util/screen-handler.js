var Promise = require('bluebird');
var sampleScreens = require('./sampleScreens')();

module.exports = function(db) {
  var boardWidth = 32;
  var boardHeight = 24;

  Promise.promisifyAll(db);

  var methods = {};

  var oppositeDirections = {
    left: 'right',
    right: 'left',
    up: 'down',
    down: 'up'
  };

  methods.moveScreen = function(req, res) {
    var direction = req.param('direction');
    var currentObjectId = req.param('currentScreenId');
    db.Screen.findById(currentObjectId).populate(direction+'Screen')
    .exec(function(err, currentScreen) {
      if (err) {
        methods.handleError(err, res);
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

  methods.createPlacedScreen = function(req, res, worldCreation) {
    // FOR world creation - third argument passed in
    if (worldCreation) {
      var direction = req;
      var newScreen = res;
      var currentObjectId = worldCreation;
    } else {
      var direction = req.param('direction');
      var newScreen = req.body.newScreen;
      var currentObjectId = db.mongoose.Types.ObjectId(req.param('currentScreenId'));
    }

    var adjacentDirections = {
      'up': 'right',
      'right': 'down',
      'down': 'left',
      'left': 'up'
    }

    // create new screen
    return db.Screen.createAsync(newScreen)
    .then(function(createdScreen) {
      return methods.addDirectionReference(direction, currentObjectId, createdScreen._id)
    })
    // go around the horn, adding all necessary references
    .then(function(createdScreenId) {
      return methods.placementHelper(currentObjectId, createdScreenId, direction, adjacentDirections[direction]);
    })
    .catch(function(err) {
      methods.handleError(err, res);
    });
  };

  methods.peripheralRefs = function(fromScreenId, toScreenId, doneDir, toGoDir) {
    return db.Screen.findByIdAsync(fromScreenId)
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
        return methods.addDirectionReference(toGoDir, toScreenId, connectionScreenId)
      } else {
        return new Promise(function(onResolved, onRejected) {
          onRejected(toScreenId);
        })
      }
    })
  }

  methods.placementHelper = function(fromScreenId, toScreenId, doneDir, toGoDir) {
    // will have to circle two ways around toScreenId
    var toGoOppositeDirection = oppositeDirections[toGoDir];
    // boolean to decrease number of calls to database
    var backsideConnection = false

    return methods.peripheralRefs(fromScreenId, toScreenId, doneDir, toGoDir) // should return (connectionScreenId, toScreenId)
    .then(function(peripheralScreenId) {
      return methods.peripheralRefs(peripheralScreenId, toScreenId, toGoOppositeDirection, doneDir) // should return (endPeriph, toScreenId)
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
      return methods.peripheralRefs(fromScreenId, toScreenId, doneDir, toGoOppositeDirection);
    })
    .then(function(peripheralScreenId) {
      // no need to check backsideConnection if that has already been hooked up
      if (!backsideConnection) {
        return methods.peripheralRefs(peripheralRefs, fromScreenId, toGoDir, doneDir);
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


  methods.addDirectionReference = function(direction, fromScreenId, toScreenId) {
    // methods.checkDirection(direction, fromScreenId)
    return db.Screen.findByIdAsync(fromScreenId)
    .then(function(foundScreen) {
      if (!foundScreen[direction + 'Screen']) {
        var update = {}
        update[direction + 'Screen'] = toScreenId;
        return db.Screen.findByIdAndUpdateAsync(fromScreenId, update)
      }
    })
    .then(function(screened) {
      direction = oppositeDirections[direction];
      return db.Screen.findByIdAsync(toScreenId)
    })
    .then(function(foundScreen) {
      if (!foundScreen[direction + 'Screen']) {
        // add reverse reference as well
        var property = direction + 'Screen';
        var update = {}
        update[direction + 'Screen'] = fromScreenId;
        return db.Screen.findByIdAndUpdateAsync(toScreenId, update);
      }
    })
    .then(function() {
      return new Promise(function(onResolved, onRejected) {
        onResolved(toScreenId, fromScreenId);
      });
    })
    .catch(function(err) {
      methods.handleError(err, res);
    });

  };

  methods.getScreen = function(req, res) {
    var screenId = req.param('screenId');
    console.log('screenId: ', screenId);
    db.Screen.findByIdAsync(screenId)
    .then(function(foundScreen) {
      res.send(foundScreen);
    })
    .catch(function(err) {
      methods.handleError(err, res);
    });
  };

  methods.deleteScreen = function(req, res) {
    var screenId = req.body.screenId;

    db.Screen.findByIdAndRemove(screenId)
    .then(function(deletedScreen) {
      res.send({success: true, deletedScreen: deletedScreen});
    })
    .catch(function(err) {
      methods.handleError(err, res);
    })
  };

  methods.handleError = function(err, res) {
    console.log(err);
    res.send(500, err);
  };

  return methods;
};
