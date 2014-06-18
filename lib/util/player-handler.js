var Promise = require('bluebird');

module.exports = function(db) {
  var methods = {};
  Promise.promisifyAll(db);

  methods.getPlayer = function(req, res) {
    var username = req.param('username');
    db.Player.findOneAsync({username: username})
    .then(function(foundPlayer) {
      res.send(foundPlayer);
    })
    .catch(function(err) {
      methods.handleError(err, res);
    });
  };

  methods.handleError = function(err, res) {
    console.log(err);
    res.send(500, err);
  };

  methods.newPlayer = function(req, res) {
    var username = req.body.username;
    var png = req.body.png;
    var mapId = '53a1fe2ac155305023324f05';

    var player = new db.Player({
      username: username,
      x: 20,
      y: 20,
      png: png,
      mapId: mapId
    });

    player.save(function(a,b) {
      console.log(a);
      console.log(b);
    });

  };

  return methods;
};