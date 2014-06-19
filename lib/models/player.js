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
  mapId: {type: Schema.ObjectId, ref: 'Screen', default: mongoose.Types.ObjectId('539cd0a29f9d7bb80c057556')}
});

module.exports = mongoose.model('Player', PlayerSchema);