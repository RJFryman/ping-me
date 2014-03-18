/* jshint expr:true */

'use strict';

process.env.DBNAME = 'airbnb-test';
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
      var u1 = new User({email:'julius@nomail.com', password:'1234'});
      expect(u1.email).to.equal('julius@nomail.com');
      expect(u1.password).to.equal('1234');
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
});
