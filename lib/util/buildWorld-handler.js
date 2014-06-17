var Promise = require('bluebird');
var sampleScreens = require('./sampleScreens')();

module.exports = function(db) {
  var methods = {};

  var screenHandler = require('./screen-handler.js')(db);
  var firstPlacedScreenId;

  // POPULATE WORLD FOR FIRST TIME
  methods.populateScreen = function(req, res) {

    var screen1 = sampleScreens.screen1;
    var screen2 = sampleScreens.screen2;
    var screen3 = sampleScreens.screen3;
    var screen4 = sampleScreens.screen4;
    var screen5 = sampleScreens.screen5;
    var screen6 = sampleScreens.screen6;
    var screen7 = sampleScreens.screen7;
    var screen8 = sampleScreens.screen8;
    var screen9 = sampleScreens.screen9;

    return db.Screen.removeAsync().
    then(function() {
      return db.Screen.createAsync(screen1)
    })
    .then(function(createdScreen) {
      firstPlacedScreenId = createdScreen._id
      return screenHandler.createPlacedScreen('right', screen2, createdScreen._id);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return screenHandler.createPlacedScreen('down', screen3, createdScreenId);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return screenHandler.createPlacedScreen('left', screen4, createdScreenId);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return screenHandler.createPlacedScreen('left', screen5, createdScreenId);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return screenHandler.createPlacedScreen('up', screen6, createdScreenId);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return screenHandler.createPlacedScreen('up', screen7, createdScreenId);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return screenHandler.createPlacedScreen('right', screen8, createdScreenId);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return screenHandler.createPlacedScreen('right', screen9, createdScreenId);
    })
    // then create player
    .catch(function(err) {
      methods.handleError(err, res);
    })
  };

  methods.populatePlayer = function(req, res) {
    return db.Player.removeAsync()
    .then(function(foundScreens) {
      return db.Player.createAsync({
        username: 'test',
        x: 200,
        y: 200,
        // placing created player on first placed screen
        mapId: firstPlacedScreenId
      });
    })
    .catch(function(err) {
      methods.handleError(err, res);
    })
  };

  methods.populateAll = function(req, res) {
    methods.populateScreen(req, res)
    .then(function() {
      methods.populatePlayer(req, res);
    })
    .then(function(createdPlayer) {
      res.send(createdPlayer);
    })
    .catch(function(err) {
      methods.handleError(err, res);
    });
  };

  methods.handleError = function(err, res) {
    console.log(err);
    res.send(err);
  };

  return methods;

};