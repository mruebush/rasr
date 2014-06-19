var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EnemySchema = new Schema({
  name: String,
  mapId: {type: Schema.ObjectId, ref: 'Screen', default: mongoose.Types.ObjectId('539cd0a29f9d7bb80c057556')},
  png: String,
  speed: {type: Number, default: 200},
  health: Number
});

module.exports = mongoose.model('Enemy', EnemySchema);