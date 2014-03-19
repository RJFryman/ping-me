'use strict';

var bcrypt = require('bcrypt');
var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var _ = require('lodash');


module.exports = User;

function User(data){
  this.email = data.email;
  this.password = data.password;
  this.friends = [];
  this.friendReq = [];
  this.friendPnd = [];
}

User.prototype.register = function(fn){
  var self = this;
  hashPassword(self.password, function(hashedPwd){
    self.password = hashedPwd;
    insert(self, function(err){
      if(self._id){
        fn();
      }else{
        fn();
      }
    });
  });
};

User.login = function(email, password, fn){
  findByEmailAndPassword(email, password, function(record){
    if(record){
      fn(record);
    }else{
      fn(null);
    }
  });
};

User.prototype.addFriend = function(id, fn){
  this.friends.push(id);
  update(this, function(err){
    fn(err);
  });
};

User.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  users.findOne({_id:_id}, function(err, record){
    if(record){
      fn(_.extend(record, User.prototype));
    }else{
      fn(null);
    }
  });
};

User.findByEmail = function(email, fn){
  users.findOne({email:email}, function(err, record){
    fn(record);
  });
};

function update(user, fn){
  users.update({_id:user._id}, user, function(err, count){
    fn(err);
  });
}

function findByEmailAndPassword(email, password, fn){
  users.findOne({email:email}, function(err, record){
    if(record){
      bcrypt.compare(password, record.password, function(err, result){
        if(result){
          fn(record);
        }else{
          fn(null);
        }
      });
    }else{
      fn(null);
    }
  });

}

function insert(user, fn){
  users.findOne({email:user.email}, function(err, userFound){
    if(!userFound){
      users.insert(user, function(err, record){
        fn(err);
      });
    }else{
      fn();
    }
  });
}

function hashPassword(password, fn){
  bcrypt.hash(password, 8, function(err, hash){
    fn(hash);
  });
}

