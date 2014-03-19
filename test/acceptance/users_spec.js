/* jshint expr:true */

'use strict';

process.env.DBNAME = 'ping-me-test';
var request = require('supertest');
var app = require('../../app/app');
var expect = require('chai').expect;
var User, u;

describe('user', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      u = new User({email:'test@nomail.com', password:'1234'});
      u.register(function(){
        done();
      });
    });
  });

  describe('GET /register', function(){
    it('should display the register page', function(done){
      request(app)
      .get('/register')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        done();
      });
    });
  });
  describe('POST /register', function(){
    it('should allow a user to register', function(done){
      request(app)
      .post('/register')
      .field('email', 'robert.fryman@gmail.com')
      .field('password', '1234')
      .field('role', 'host')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });

    it('should not allow a duplicate email to register', function(done){
      request(app)
      .post('/register')
      .field('email', 'test@nomail.com')
      .field('password', '1234')
      .field('role', 'host')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        done();
      });
    });
  });

  describe('GET /auth', function(){
    it('should display the auth page', function(done){
      request(app)
      .get('/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Login');
        done();
      });
    });
  });


  describe('POST /login', function(){
    it('should login registered user', function(done){
      request(app)
      .post('/login')
      .field('email', 'test@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });

    it('should not login unregistered user by email', function(done){
      request(app)
      .post('/login')
      .field('email', 'test@yesmail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should not login user with wrong password', function(done){
      request(app)
      .post('/login')
      .field('email', 'test@nomail.com')
      .field('password', '4321')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });
  describe('GET /users/:id', function(){
    it('should redirect to the show page', function(done){
      request(app)
      .get('/users/'+u._id)
      .expect(200, done);
    });
  });
  describe('POST /users/:id/:friend', function(){
    it('should add friend and redirect to user show page', function(done){
      request(app)
      .post('/users/'+u._id+'/'+u._id)
      .expect(302, done);
    });
  });

});

