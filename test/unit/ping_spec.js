/* jshint expr:true */

'use strict';

process.env.DBNAME = 'ping-me-test';
var expect = require('chai').expect;
var User;
var Ping;
var Mongo = require('mongodb');
var u1, u2;

describe('Ping', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      Ping = require('../../app/models/ping');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      u1 = new User({username:'julius', email:'julius@nomail.com', password:'1234'});
      u1.register(function(err){
        u2 = new User({uesrname:'rjfryman', email:'rjfryman@nomail.com', password:'1234'});
        u2.register(function(err){
          done();
        });
      });
    });
  });

  describe('new', function(){
    it('should create a new Ping object', function(done){
      var p1 = new Ping({senderId:u1._id.toString(), lat:50, lng:50, recipientId:u2._id.toString()});
      expect(p1.senderId).to.be.instanceof(Mongo.ObjectID);
      expect(p1.senderId).to.deep.equal(u1._id);
      expect(p1.recipientId).to.be.instanceof(Mongo.ObjectID);
      expect(p1.recipientId).to.deep.equal(u2._id);
      expect(p1.senderCoord).to.deep.equal([50,50]);
      done();
    });
  });

  describe('#insert', function(){
    it('should insert a new Ping into the db', function(done){
      var p1 = new Ping({senderId:u1._id.toString(), lat:50, lng:50, recipientId:u2._id.toString()});
      p1.insert(function(){
        expect(p1._id.toString()).to.have.length(24);
        expect(p1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a single ping by the id in the db', function(done){
      var p1 = new Ping({senderId:u1._id.toString(), lat:50, lng:50, recipientId:u2._id.toString()});
      p1.insert(function(){
        var id = p1._id.toString();
        Ping.findById(id, function(record){
          expect(record._id.toString()).to.equal(id);
          done();
        });
      });
    });
  });

  describe('deleteById', function(){
    it('should find and delete item by id', function(done){
      var p1 = new Ping({senderId:u1._id.toString(), lat:50, lng:50, recipientId:u2._id.toString()});
      p1.insert(function(){
        var id = p1._id.toString();
        Ping.deleteById(id, function(count){
          expect(count).to.equal(1);
          done();
        });
      });
    });
  });

  describe('findByRecipientId', function(){
    it('should find all pings by recipiet ID', function(done){
      var p1 = new Ping({senderId:u1._id.toString(), lat:50, lng:50, recipientId:u2._id.toString()});
      p1.insert(function(){
        var p2 = new Ping({senderId:u2._id.toString(), lat:50, lng:50, recipientId:u1._id.toString()});
        p2.insert(function(){
          var id = u1._id.toString();
          Ping.findByRecipientId(id, function(records){
            expect(records).to.be.length(1);
            expect(records[0].senderCoord).be.deep.equal([50,50]);
            done();
          });
        });
      });
    });
  });
});

