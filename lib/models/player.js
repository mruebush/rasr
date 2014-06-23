'use strict'

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Player Schema
 */

var PlayerSchema = new Schema({
  userId: {type: Schema.ObjectId, ref: 'Screen'},
  username: String,
  xp: {type: Number, default: 0},
  level: {type: Number, default: 1},
  dmg: {type: Number, default: 1},
  x: {type: Number, min: 0, max: 800, default: 200},
  y: {type: Number, min: 0, max: 800, default: 200},
  png: {type: String, default: 'roshan'} ,
  mapId: {type: Schema.ObjectId, ref: 'Screen'}
});

module.exports = mongoose.model('Player', PlayerSchema);