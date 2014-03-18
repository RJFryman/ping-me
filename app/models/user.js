'use strict';

var bcrypt = require('bcrypt');
var users = global.nss.db.collection('users');


module.exports = User;

function User(data){
  this.email = data.email;
  this.password = data.password;
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

