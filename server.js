'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./lib/config/config');
mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

// Passport Configuration
var passport = require('./lib/config/passport');

// Setup Express
var app = express();
var server = require('http').createServer(app);
require('./lib/config/express')(app);
require('./lib/routes')(app);

server.listen(config.port, function(){
  console.log('Server listening on port: ' + config.port);
});

require('./lib/controllers/socket').init(server);

// Expose app
exports = module.exports = app;
