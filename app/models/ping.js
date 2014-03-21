'use strict';

module.exports = Ping;
var pings = global.nss.db.collection('pings');
var Mongo = require('mongodb');

function Ping(data){
  this.senderId = Mongo.ObjectID(data.senderId);
  this.senderCoord = [data.lat*1 , data.lng *1];
  this.recipientId = Mongo.ObjectID(data.recipientId);
}

Ping.prototype.insert = function(fn){
  pings.insert(this, function(err, reocrds){
    fn();
  });
};

Ping.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  pings.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

Ping.deleteById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  pings.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

Ping.findByRecipientId = function(id, fn){
  var _id = Mongo.ObjectID(id);
  pings.find({recipientId:_id}).toArray(function(err, records){
    fn(records);
  });
};

