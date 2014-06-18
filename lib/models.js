var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

module.exports = function(app) {
  var models = {};

  // var config = require('./config/config');
  // var db = mongoose.connect(config.mongo.uri, config.mongo.options);

  var playerSchema = new Schema({
    username: String,
    x: {type: Number, min: 0, max: 800},
    y: {type: Number, min: 0, max: 800},
    mapId: {type: Schema.ObjectId, ref: 'Screen'}
  });

  var screenSchema = new Schema({
    height: {type: Number, default: 24},
    width: {type: Number, default: 32},
    layers: Array,
    orientation: {type: String, default: 'orthogonal'},
    properties: Object,
    tileheight: {type: Number, default: 40},
    tilewidth: {type: Number, default: 40},
    tilesets: [Schema.Types.Mixed],
    version: {type: Number, default: 1},
    upScreen: {type: Schema.ObjectId, ref: 'Screen'},
    rightScreen: {type: Schema.ObjectId, ref: 'Screen'},
    downScreen: {type: Schema.ObjectId, ref: 'Screen'},
    leftScreen: {type: Schema.ObjectId, ref: 'Screen'}
  });

  models.mongoose = mongoose;
  // models.User = mongoose.model('User', userSchema);
  models.Player = mongoose.model('Player', playerSchema);
  models.Screen = mongoose.model('Screen', screenSchema);

  return models;
};