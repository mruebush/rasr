var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var EnemySchema = new Schema({
  name: 'Leviathan',
  mapId: {type: Schema.ObjectId, ref: 'Screen', default: mongoose.Types.ObjectId('539cd0a29f9d7bb80c057556')},
  png: 'leviathan.png',
  speed: {type: Number, default: 200},
  health: 5
});

module.exports = mongoose.model('Enemy', EnemySchema);