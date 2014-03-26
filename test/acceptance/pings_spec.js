/* jshint expr:true */

'use strict';

process.env.DBNAME = 'ping-me-test';
var request = require('supertest');
var app = require('../../app/app');
var expect = require('chai').expect;
var User, u, u1;
var Ping, p;
var cookie;

describe('user', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      Ping = require('../../app/models/ping');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      u = new User({username:'test', email:'test@nomail.com', password:'1234'});
      u1 = new User({username:'test1', email:'test1@nomail.com', password:'1234'});
      u.register(function(){
        u1.register(function(){
          p = new Ping({senderId:u._id.toString(), lat:50, lng:50, recipientId:u1._id.toString()});
          p.insert(function(){
            console.log(cookie);
            request(app)
            .post('/login')
            .field('email', 'test@nomail.com')
            .field('password', '1234')
            .end(function(err, res){
              cookie = res.headers['set-cookie'];
              console.log(cookie);
              done();
            });
          });
        });
      });
    });
  });

  describe('GET /', function(){
    it('should display the home page', function(done){
      request(app)
      .get('/')
      .expect(200, done);
    });
  });

  describe('POST /ping', function(){
    it('should create a new ping', function(done){
      request(app)
      .post('/ping')
      .set('cookie', cookie)
      .field('senderId', u._id.toString())
      .field('lat', 50)
      .field('lng', 50)
      .field('recipientId', u1._id.toString())
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('DEL /ping/:id', function(){
    it('should delete a ping', function(done){
      request(app)
      .del('/ping/')
      .set('cookie', cookie)
      .field('role', 'host')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('GET /ping/:id', function(){
    it('should display a ping page', function(done){
      request(app)
      .get('/ping/'+p._id)
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Ping');
        done();
      });
    });
  });
});

