'use strict'

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Player Schema
 */

var PlayerSchema = new Schema({
  userId: {type: Schema.ObjectId, ref: 'Screen'},
  username: String,
  x: {type: Number, min: 0, max: 800, default: 200},
  y: {type: Number, min: 0, max: 800, default: 200},
  png: {type: String, default: 200},
  mapId: {type: Schema.ObjectId, ref: 'Screen', default: mongoose.Types.ObjectId('53a21e6d43d080e226718dec')}
});

module.exports = mongoose.model('Player', PlayerSchema);