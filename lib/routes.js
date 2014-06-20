'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    screens = require('./controllers/screens'),
    session = require('./controllers/session'),
    middleware = require('./middleware'),
    buildWorld = require('./util/buildWorld-handler')();

/**
 * Application routes
 */
module.exports = function(app, db) {

  // Server API Routes
  app.route('/api/awesomeThings')
    .get(api.awesomeThings);
  
  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);

  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id')
    .get(users.show)
    // .put(users.);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  // POPULATE A WORLD WITH A PLAYER IN THE CENTER
  // app.get('/populateWorld', buildWorld.populateScreen);
  // app.get('/populatePlayer', buildWorld.populatePlayer);
  app.route('/populateAll')
    .get(buildWorld.populateAll);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // app.post('/supersecret', api.newPlayer);

  // get player position and screen, get screen to be on at beginning of game
  app.get('/player/me', api.getPlayer);
  app.get('/screen/:screenId', screens.getScreen);

  // Map editor API route
  app.put('/save/:screenId', api.saveScreen);
  // Map editor new tileset route
  app.post('/tileset', api.saveTileSet); 

  app.post('/makeuser', api.newPlayer);
  
  // get next screen player moves to.
  app.get('/move/:direction/:currentScreenId', screens.moveScreen);

  // builds screen next to "currentScreenId"
  app.get('/make/:direction/:currentScreenId', screens.createPlacedScreen);
  app.post('/make/enemy', api.makeEnemy);
  app.post('/populate-enemy', api.populateEnemy);
  // app.delete('/screen/:screenId', screens.deleteScreen);
  
  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);

};