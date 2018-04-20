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


describe('user registeration request handler', function () {
  before(function (done) {
    seed().then(done);
  });

  it('responds with 201 when submitting correct info, and body contains JWT', function (done) {
    request(app).post('/api/register/')
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
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('responds with 422 when submitting an already used username, and body contains error msg(s)', function (done) {
    request(app).post('/api/register')
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
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when submitting an already used email, and body contains error msg(s)', function (done) {
    request(app).post('/api/register')
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
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when username is invalid, and body contains error msg(s)', function (done) {
    request(app).post('/api/register')
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
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when email is invalid, and body contains error msg(s)', function (done) {
    request(app).post('/api/register')
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
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when password is invalid, and body contains error msg(s)', function (done) {
    request(app).post('/api/register')
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
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when passwords don\'t match, and body contains error msg(s)', function (done) {
    request(app).post('/api/register')
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
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when the request is missing required info, and body contains error msg(s)', function (done) {
    request(app).post('/api/register')
      .send({
        username: 'ali',
        password: 'Aa@123456789',
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

describe('user login request handler', function () {
  before(function (done) {
    seed().then(done);
  });

  it('responds with 200 when submitting correct info, and body contains JWT', function (done) {
    request(app).post('/api/login/')
      .send({
        username: 'john',
        password: 'Aa@123456'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('successful');
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('responds with 422 when submitting wrong username, and body contains incorrect info msg', function (done) {
    request(app).post('/api/login')
      .send({
        username: 'Ali123',
        password: 'qQ@123456789',
      }).expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('invalid username or password');
        done();
      });
  });

  it('responds with 422 when submitting wrong password, and body contains incorrect info msg', function (done) {
    request(app).post('/api/login')
      .send({
        username: 'john',
        password: '1234',
      }).expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('invalid username or password');
        done();
      });
  });
});

describe('user update info request handler', function () {
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

  it('responds with 401 when missing JWT in request headers, and body contains Auth failed msg', function (done) {
    request(app).patch(`/api/users/`)
      .send({
        username: 'john',
        password: 'Aa@123456'
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

  it('responds with 401 when JWT is invalid, and body contains Auth failed msg', function (done) {
    request(app).patch(`/api/users/`)
      .set({
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTIxMTk4MzUzLCJleHAiOjE1MjEyMDkxNTN9.ue9Ef8qBH4kQmnbngoWvjUm9fQhuvHV9l_BoHP2uVoc'
      })
      .send({
        username: 'john',
        password: 'Aa@123456'
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

  it('responds with 422 when trying to change password with missing required fields, and body contains error msg(s)', function (done) {
    request(app).patch(`/api/users/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        password: 'qQ@123456789',
      }).expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        done();
      });
  });

  it('responds with 422 when request body contains no info fields at all, and body contains error msg(s)', function (done) {
    request(app).patch(`/api/users/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
      }).expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        done();
      });
  });

  it('responds with 422 when trying to change password with wrong current password, and body contains error msg(s)', function (done) {
    request(app).patch(`/api/users/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        password: 'wrongpassword123',
        newpassword: 'Qq@123456',
        confirm_new_password: 'Qq@123456'
      }).expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        done();
      });
  });

  it('responds with 422 when trying to change password with invalid new password, and body contains error msg(s)', function (done) {
    request(app).patch(`/api/users/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        password: 'Aa@123456',
        newpassword: 'weak password',
        confirm_new_password: 'weak password'
      }).expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when trying to change password with invalid new password confirmation, and body contains error msg(s)', function (done) {
    request(app).patch(`/api/users/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        password: 'Aa@123456',
        newpassword: 'Qq@123456',
        confirm_new_password: 'Qq@123'
      }).expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 200 when trying to change password with correct info, and body contains changed fields. DB updated', function (done) {
    db.query('SELECT `password` FROM `user` WHERE `user_id`=?', [userId], function (err, results) {
      if (err) throw err;
      request(app).patch(`/api/users/`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          password: 'Aa@123456',
          newpassword: 'Qq@123456',
          confirm_new_password: 'Qq@123456'
        }).expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) done(err);
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('successful');
          expect(res.body.user).to.have.property('changed_password');
          expect(res.body.user.changed_password).to.be.true;
          db.query('SELECT `password` FROM `user` WHERE `user_id`=?', [userId], function (error, updatedResults) {
            if (error) throw error;
            expect(results[0].password.toString() !== updatedResults[0].password.toString())
            done();
          });
        });
    });
  });

  it('responds with 422 when trying to change email with invalid email, and body contains error msg(s)', function (done) {
    request(app).patch(`/api/users/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        newemail: "@wrong.com"
      }).expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when trying to change email with an already used email, and body contains error msg(s)', function (done) {
    request(app).patch(`/api/users/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        newemail: "doe@test.com"
      }).expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 200 when trying to change email with correct info, and body contains changed fields. DB updated', function (done) {
    db.query('SELECT `email` FROM `user` WHERE `user_id`=?', [userId], function (err, results) {
      if (err) throw err;
      request(app).patch(`/api/users/`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          newemail: "newemail@new.com"
        }).expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) done(err);
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('successful');
          expect(res.body.user).to.have.property('email');
          expect(res.body.user.email).to.equal('newemail@new.com');
          db.query('SELECT `email` FROM `user` WHERE `user_id`=?', [userId], function (error, updatedResults) {
            if (error) throw error;
            expect(results[0].email.toString() !== updatedResults[0].email.toString())
            done();
          });
        });
    });
  });

  it('responds with 422 when trying to change username with an already used username, and body contains error msg(s)', function (done) {
    request(app).patch(`/api/users/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        newusername: "doe"
      }).expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 422 when trying to change username with invalid username, and body contains error msg(s)', function (done) {
    request(app).patch(`/api/users/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        newusername: "*name$$"
      }).expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 200 when trying to change username with correct info, and body contains changed fields. DB updated', function (done) {
    db.query('SELECT `username` FROM `user` WHERE `user_id`=?', [userId], function (err, results) {
      if (err) throw err;
      request(app).patch(`/api/users/`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          newusername: "chris"
        }).expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) done(err);
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('successful');
          expect(res.body.user).to.have.property('username');
          expect(res.body.user.username).to.equal('chris');
          db.query('SELECT `username` FROM `user` WHERE `user_id`=?', [userId], function (error, updatedResults) {
            if (error) throw error;
            expect(results[0].username.toString() !== updatedResults[0].username.toString())
            done();
          });
        });
    });
  });

  it('responds with 200 when trying to change bio, and body contains changed fields. DB updated', function (done) {
    db.query('SELECT `bio` FROM `user` WHERE `user_id`=?', [userId], function (err, results) {
      if (err) throw err;
      request(app).patch(`/api/users/`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          bio: "hello, my name is chris."
        }).expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) done(err);
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('successful');
          expect(res.body.user).to.have.property('bio');
          expect(res.body.user.bio).to.equal('hello, my name is chris.');
          db.query('SELECT `bio` FROM `user` WHERE `user_id`=?', [userId], function (error, updatedResults) {
            if (error) throw error;
            expect(results[0].bio.toString() !== updatedResults[0].bio.toString())
            done();
          });
        });
    });
  });

  it('responds with 422 when trying to change avatar with invalid link, and body contains error msg(s)', function (done) {
    request(app).patch(`/api/users/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        avatar: "badlink/123"
      }).expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

  it('responds with 200 when trying to change avatar with valid link, and body contains changed fields. DB updated', function (done) {
    db.query('SELECT `avatar` FROM `user` WHERE `user_id`=?', [userId], function (err, results) {
      if (err) throw err;
      request(app).patch(`/api/users/`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          avatar: "http://images.com/images/avatar.png"
        }).expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) done(err);
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('successful');
          expect(res.body.user).to.have.property('avatar');
          expect(res.body.user.avatar).to.equal('http://images.com/images/avatar.png');
          db.query('SELECT `avatar` FROM `user` WHERE `user_id`=?', [userId], function (error, updatedResults) {
            if (error) throw error;
            expect(results[0].avatar.toString() !== updatedResults[0].avatar.toString())
            done();
          });
        });
    });
  });

  it('responds with 200 when trying to change multiple fields with correct info, and body contains changed fields. DB updated', function (done) {
    db.query('SELECT `avatar`,`email` FROM `user` WHERE `user_id`=?', [userId], function (err, results) {
      if (err) throw err;
      request(app).patch(`/api/users/`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          avatar: "http://images.com/new/2018.png",
          newemail: "supernew@mail.com"
        }).expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) done(err);
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('successful');
          expect(res.body.user).to.have.property('avatar');
          expect(res.body.user).to.have.property('email');
          expect(res.body.user.avatar).to.equal('http://images.com/new/2018.png');
          expect(res.body.user.email).to.equal('supernew@mail.com');
          db.query('SELECT `avatar`,`email` FROM `user` WHERE `user_id`=?', [userId], function (error, updatedResults) {
            if (error) throw error;
            expect(results[0].avatar.toString() !== updatedResults[0].avatar.toString()
              && results[0].email.toString() !== updatedResults[0].email.toString())
            done();
          });
        });
    });
  });

  it('responds with 422 when trying to change multiple fields with one having invalid info, and body contains error msg(s)', function (done) {
    request(app).patch(`/api/users/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        newemail: "badmail",
        bio: "correct bio.",
        newusername: "daniel"
      }).expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        expect(res.body.errors.length > 0, 'errors array length is above 0');
        done();
      });
  });

});





