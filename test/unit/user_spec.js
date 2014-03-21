/* jshint expr:true */

'use strict';

process.env.DBNAME = 'ping-me-test';
var expect = require('chai').expect;
var User;
var Mongo = require('mongodb');

describe('User', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      var u1 = new User({email:'julius@nomail.com', password:'1234'});
      u1.register(function(err){
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new User object', function(done){
      var u1 = new User({username:'rjfryman', email:'julius@nomail.com', password:'1234'});
      expect(u1.username).to.equal('rjfryman');
      expect(u1.email).to.equal('julius@nomail.com');
      expect(u1.password).to.equal('1234');
      expect(u1.friends).to.have.length(0);
      expect(u1.friends).to.be.instanceof(Array);
      done();
    });
  });

  describe('#register', function(){
    it('should register a new User object', function(done){
      var u1 = new User({email:'rfjulius@nomail.com', password:'1234'});
      u1.register(function(err, body){
        expect(err).to.not.be.ok;
        expect(u1.password).to.have.length(60);
        expect(u1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
    it('should not register a new user', function(done){
      var u1 = new User({email:'julius@nomail.com', password:'1234'});
      u1.register(function(err){
        expect(u1._id).to.be.undefined;
        done();
      });
    });
  });
  describe('.insert', function(){
    it('should find a user by email', function(done){
      var email = 'julius@nomail.com';
      var password = '1234';
      User.login(email, password, function(user){
        expect(user.email).to.equal('julius@nomail.com');
        done();
      });
    });

    it('should not allow an incorrect email', function(done){
      var email = 'robert@yesmail.com';
      var password = '1234';
      User.login(email, password, function(user){
        expect(user).to.be.null;
        done();
      });
    });

    it('should not allow an incorrect password', function(done){
      var email = 'julius@nomail.com';
      var password = '4321';
      User.login(email, password, function(user){
        expect(user).to.be.null;
        done();
      });
    });
  });
  describe('.findById', function(){
    it('should find user by Email', function(done){
      var u1 = new User({email:'rjfryman@nomail.com', password:'1234'});
      u1.register(function(err){
        User.findById(u1._id.toString(), function(record){
          expect(u1.email).to.equal('rjfryman@nomail.com');
          expect(record.email).to.equal('rjfryman@nomail.com');
          expect(record._id).to.deep.equal(u1._id);
          done();
        });
      });
    });
    it('should not find a user by id', function(done){
      User.findById('123456789012', function(record){
        expect(record).to.be.null;
        done();
      });
    });
  });
  describe('.findByEmail', function(){
    it('should find user by Email', function(done){
      var u1 = new User({email:'rjfryman@nomail.com', password:'1234'});
      u1.register(function(err){
        var email = u1.email;
        User.findByEmail(email, function(record){
          expect(record.email).to.equal(email);
          done();
        });
      });
    });
    it('should not return an email PRIVACY', function(done){
      var u1 = new User({email:'rjfryman@nomail.com', password:'1234'});
      u1.register(function(err){
        var email = 'rjfryman@yesmail.com';
        User.findByEmail(email, function(record){
          expect(record).to.be.null;
          done();
        });
      });
    });
  });
  describe('#addFriend', function(){
    it('should add a friend to friend array', function(done){
      var u1 = new User({email:'julius@nomail.com', password:'1234'});
      var u2 = new User({email:'robert@nomail.com', password:'1234'});
      u1.register(function(err){
        u2.register(function(err){
          u1.addFriend(u2._id, function(){
            expect(u1.friends).to.have.length(1);
            expect(u1.friends).to.be.instanceof(Array);
            done();
          });
        });
      });
    });
  });

});
