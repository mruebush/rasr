var Promise = require('bluebird');
var sampleScreens = require('./sampleScreens')();
var sampleEnemies = require('./sampleEnemies');
var mongoose = require('mongoose');
var Screen = mongoose.model('Screen');
var Enemy = mongoose.model('Enemy');
var screenHandler = require('../controllers/screens')
var enemyHandler = require('../controllers/enemies')
var Player = mongoose.model('Player');

Promise.promisifyAll(Enemy);
Promise.promisifyAll(Screen);


module.exports = function() {
  var methods = {};

  var firstPlacedScreenId;

  // POPULATE WORLD FOR FIRST TIME
  methods.populateWorld = function(req, res) {

    var screen1 = sampleScreens.screen1;
    var screen2 = sampleScreens.screen2;
    var screen3 = sampleScreens.screen3;
    var screen4 = sampleScreens.screen4;
    var screen5 = sampleScreens.screen5;
    var screen6 = sampleScreens.screen6;
    var screen7 = sampleScreens.screen7;
    var screen8 = sampleScreens.screen8;
    var screen9 = sampleScreens.screen9;

    return Enemy.removeAsync()
    .then(function() {
      return Screen.removeAsync();
    })
    .then(function() {
      return enemyHandler.makeEnemy(sampleEnemies.enemy1);
    })
    .then(function() {
      return Screen.createAsync(screen1)
    })
    .then(function(createdScreen) {
      console.log(createdScreen._id)
      return enemyHandler.populateEnemy(sampleEnemies.enemyOnScreen1, createdScreen._id)
    })
    .then(function(createdScreenId) {
      return screenHandler.createWorld('right', screen2, createdScreenId, req, res);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return screenHandler.createWorld('down', screen3, createdScreenId, req, res);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return screenHandler.createWorld('left', screen4, createdScreenId, req, res);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return screenHandler.createWorld('left', screen5, createdScreenId, req, res);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return screenHandler.createWorld('up', screen6, createdScreenId, req, res);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return screenHandler.createWorld('up', screen7, createdScreenId, req, res);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return screenHandler.createWorld('right', screen8, createdScreenId, req, res);
    })
    .then(function(createdScreenId) {
      console.log(createdScreenId);
      return screenHandler.createWorld('right', screen9, createdScreenId, req, res);
    })
    .then(function(createdScreenId) {
      res.send({id: createdScreenId}, 200);
    })
    // then create player
    .catch(function(err) {
      methods.handleError(err, res);
    })
  };

  methods.handleError = function(err, res) {
    console.log(err);
    res.send(err);
  };

  return methods;

};