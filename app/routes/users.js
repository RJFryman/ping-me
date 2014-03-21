'use strict';

var User = require('../models/user');

exports.fresh = function(req, res){
  res.render('users/fresh');
};

exports.create = function(req, res){
  var user = new User(req.body);
  user.register(function(){
    if(user._id){
      res.redirect('/');
    }else{
      res.render('users/fresh');
    }
  });
};

exports.auth = function(req, res){
  res.render('users/auth');
};

exports.login = function(req, res){
  User.login(req.body.email, req.body.password, function(user){
    if(user){
      req.session.regenerate(function(){
        req.session.userId = user._id.toString();
        req.session.save(function(){
          res.redirect('/');
        });
      });
    }else{
      req.session.destroy(function(){
        res.render('users/auth');
      });
    }
  });
};

exports.show = function(req, res){
  User.findById(req.params.id, function(user){
    res.render('users/show', { user:user});
  });
};

exports.friend = function(req, res){
  User.findById(req.params.id, function(user){
    user.addFriend(req.params.friend, function(){
      res.redirect('users/show/'+req.params.id);
    });
  });
};
