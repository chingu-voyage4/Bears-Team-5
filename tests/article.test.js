const { expect } = require('chai');
const request = require('supertest');
const app = require('../server');
const db = require('../models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// clear and seed user table
function seed() {
  return new Promise(function (resolve) {
    bcrypt.hash('Aa@123456', 10, function (err, hash) {
      if (err) throw err;
      db.query(
        `SET FOREIGN_KEY_CHECKS = 0;
        DELETE FROM \`user\`;
        INSERT INTO \`user\` (username, password, email) VALUES (?, ?, ?);
        INSERT INTO \`user\` (username, password, email) VALUES (?, ?, ?);
        SET FOREIGN_KEY_CHECKS = 1;`,
        ['john', hash, 'john@test.com', 'doe', hash, 'doe@test.com'], function (err) {
          if (err) throw err;
          resolve();
        }
      );
    });

  });
};

function getUserId() {
  return new Promise(function (resolve) {
    db.query(
      'SELECT `user_id` FROM `user` WHERE `username`=?', ['john'], function (err, results) {
        if (err) throw err;
        resolve(results[0].user_id);
      }
    );
  });
};


describe('post article handler', function () {
  var userId;
  var token;
  before(function (done) {
    seed().then(getUserId).then(response => {
      userId = response;
      token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "3h"
      });
      return done();
    });
  });

  it('responds with 201 when submitting correct info, and body contains slug', function (done) {
    request(app).post(`/api/articles/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        title: "javascript tutorial",
        body: "today we will learn more about ES6 syntax",
        category: "technology",
        date: "2018-01-18",
        image: "http://images.com/files/image.png"
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('successful');
        expect(res.body).to.have.property('slug');
        expect(res.body.slug.length > 0, 'slug string length is above 0');
        done();
      });
  });

  it('responds with 401 when JWT is invalid, and body contains Auth failed msg', function (done) {
    request(app).post(`/api/articles/`)
      .set({
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTIxMTk4MzUzLCJleHAiOjE1MjEyMDkxNTN9.ue9Ef8qBH4kQmnbngoWvjUm9fQhuvHV9l_BoHP2uVoc'
      })
      .send({
        title: "javascript tutorial",
        body: "today we will learn more about ES6 syntax",
        category: "technology",
        date: "2018-01-18",
        image: "http://images.com/files/image.png"
      })
      .expect(401)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('auth failed');
        done();
      });
  });

  it('responds with 401 when missing JWT in request headers, and body contains Auth failed msg', function (done) {
    request(app).post(`/api/articles/`)
      .send({
        title: "javascript tutorial",
        body: "today we will learn more about ES6 syntax",
        category: "technology",
        date: "2018-01-18",
        image: "http://images.com/files/image.png"
      })
      .expect(401)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('auth failed');
        done();
      });
  });

  it('responds with 422 when submitting an empty title, and body contains error msg(s)', function (done) {
    request(app).post(`/api/articles/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        title: "",
        body: "today we will learn more about ES6 syntax",
        category: "technology",
        date: "2018-01-18",
        image: "http://images.com/files/image.png"
      })
      .expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when submitting an empty article body, and body contains error msg(s)', function (done) {
    request(app).post(`/api/articles/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        title: "javascript tutorial",
        body: "",
        category: "technology",
        date: "2018-01-18",
        image: "http://images.com/files/image.png"
      })
      .expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when submitting an incorrect category, and body contains error msg(s)', function (done) {
    request(app).post(`/api/articles/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        title: "javascript tutorial",
        body: "today we will learn more about ES6 syntax",
        category: "1234",
        date: "2018-01-18",
        image: "http://images.com/files/image.png"
      })
      .expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when submitting an incorrect date, and body contains error msg(s)', function (done) {
    request(app).post(`/api/articles/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        title: "javascript tutorial",
        body: "today we will learn more about ES6 syntax",
        category: "1234",
        date: "2018-13-49",
        image: "http://images.com/files/image.png"
      })
      .expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when submitting an invalid image url, and body contains error msg(s)', function (done) {
    request(app).post(`/api/articles/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        title: "javascript tutorial",
        body: "today we will learn more about ES6 syntax",
        category: "1234",
        date: "2018-01-18",
        image: "image.png"
      })
      .expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when missing required fields, and body contains error msg(s)', function (done) {
    request(app).post(`/api/articles/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        category: "1234",
        date: "2018-01-18",
        image: "image.png"
      })
      .expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

});