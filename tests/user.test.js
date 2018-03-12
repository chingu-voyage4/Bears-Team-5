const { expect } = require('chai');
const request = require('supertest');
const app = require('../server');
const db = require('../models/db');

// clear and seed user table
const seed = function () {
  return new Promise(function (resolve) {
    db.query(
      `DELETE FROM \`user\`;
      INSERT INTO \`user\` (username, password, email) VALUES (?, ?, ?);
      INSERT INTO \`user\` (username, password, email) VALUES (?, ?, ?);`,
      ['john', 'Aa@123456', 'john@test.com', 'doe', 'Aa@123456', 'doe@test.com'], function (err) {
        if (err) throw err;
        resolve();
      }
    );
  });
};

describe('user POST handler', function () {
  before(function (done) {
    seed().then(done);
  });

  it('responds with 201 when submitting correct info', function (done) {
    request(app).post('/api/user/')
      .send({
        username: 'sarah',
        password: 'qQ@123456789',
        confirmpassword: 'qQ@123456789',
        email: 'sarah@test.com'
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('successful');
        done();
      });
  });

  it('responds with 422 when submitting an already used username and provide an error msg', function (done) {
    request(app).post('/api/user/')
      .send({
        username: 'john',
        password: 'qQ@123456789',
        confirmpassword: 'qQ@123456789',
        email: 'john333@test.com'
      })
      .expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('failed');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when submitting an already used email and provide an error msg', function (done) {
    request(app).post('/api/user/')
      .send({
        username: 'alex',
        password: 'qQ@123456789',
        confirmpassword: 'qQ@123456789',
        email: 'john@test.com'
      })
      .expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('failed');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when username is invalid', function (done) {
    request(app).post('/api/user/')
      .send({
        username: 'alex*@',
        password: 'qQ@123456789',
        confirmpassword: 'qQ@123456789',
        email: 'alex@test.com'
      })
      .expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('failed');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when email is invalid', function (done) {
    request(app).post('/api/user/')
      .send({
        username: 'alex',
        password: 'qQ@123456789',
        confirmpassword: 'qQ@123456789',
        email: '@test.com'
      })
      .expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('failed');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when password is invalid', function (done) {
    request(app).post('/api/user/')
      .send({
        username: 'ali',
        password: '1234',
        confirmpassword: '1234',
        email: 'ali@test.com'
      })
      .expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('failed');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when passwords don\'t match', function (done) {
    request(app).post('/api/user/')
      .send({
        username: 'ali',
        password: 'Aa@123456789',
        confirmpassword: 'Aa@123456',
        email: 'ali@test.com'
      })
      .expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('failed');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when the request is missing required info', function (done) {
    request(app).post('/api/user/')
      .send({
        username: 'ali',
        password: 'Aa@123456789',
      })
      .expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('failed');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });
});
