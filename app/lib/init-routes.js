'use strict';

var d = require('../lib/request-debug');
var initialized = false;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = require('../routes/home');
  var users = require('../routes/users');
  var pings = require('../routes/pings');

  app.get('/', d, home.index);
  app.get('/register', d, users.fresh);
  app.post('/register', d, users.create);
  app.get('/login', d, users.auth);
  app.post('/login', d, users.login);
  app.get('/users/:id', d, users.show);
  app.post('/users/:id/:friend', d, users.friend);
  app.post('/ping', d, pings.create);
  app.del('/ping', d, pings.destroy);
  app.get('/ping/:id', d, pings.show);
  console.log('Routes Loaded');
  fn();
}

