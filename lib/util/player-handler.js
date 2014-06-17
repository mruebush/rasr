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

  return methods;
};