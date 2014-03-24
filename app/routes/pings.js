'use strict';

var Ping = require('../models/ping');

exports.create = function(req, res){
  req.body.senderId = req.session.userId;
  var ping = new Ping(req.body);
  ping.insert(function(){
    res.redirect('/');
  });
};

exports.destroy = function(req, res){
  Ping.deleteById(req.params.id, function(){
    res.redirect('/');
  });
};

exports.show = function(req, res){
  Ping.findById(req.params.id, function(ping){
    res.render('pings/show', {ping:ping, title:'Ping'});
  });
};
