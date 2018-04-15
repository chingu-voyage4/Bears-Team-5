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

function articleSeed(id) {
  return new Promise(function (resolve) {
    db.query(
      `SET FOREIGN_KEY_CHECKS = 0;
        DELETE FROM \`article\`;
        INSERT INTO \`article\` (user_id, title, body, category, date, slug) VALUES (?, ?, ?, ?, ?, ?);
        INSERT INTO \`article\` (user_id, title, body, category, date, slug) VALUES (?, ?, ?, ?, ?, ?);
        SET FOREIGN_KEY_CHECKS = 1;`,
      [id, 'programming lessons and tips', 'abcdefg', 'technology', '2014-04-16', 'programming-lessons-and-tips-ab18981', id, 'dance moves', 'lorem ipsum', 'culture', '2017-05-22', 'dance moves-e51687c'], function (err, results) {
        if (err) throw err;
        resolve();
      }
    );
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

function getArticleId() {
  return new Promise(function (resolve) {
    db.query(
      'SELECT `article_id` FROM `article` WHERE `title`=?', ['programming lessons and tips'], function (err, results) {
        if (err) throw err;
        resolve(results[0].article_id);
      }
    );
  });
}

describe('post follow handler', function () {
  var userId;
  var articleId;
  var token;
  before(function (done) {
    seed()
      .then(getUserId)
      .then(function (response) {
        return new Promise(function (resolve) {
          userId = response;
          token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: "3h"
          });
          resolve(userId);
        });
      })
      .then((response) => articleSeed(response))
      .then(getArticleId).then(function (response) {
        return new Promise(function (resolve) {
          articleId = response;
          resolve();
        });
      })
      .then(done);
  });

  it('responds with 201 when submitting correct info', function (done) {
    db.query(
      'SELECT `user_id` FROM `user` WHERE `username`=?', ['doe'], function (err, results) {
        if (err) throw err;
        const newUserId = results[0].user_id;
        request(app).post(`/api/follows/`)
          .set({
            Authorization: `Bearer ${token}`
          })
          .send({
            followedid: newUserId
          })
          .expect(201)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) done(err);
            expect(res.body).to.have.property('msg');
            expect(res.body.msg).to.equal('successful');
            db.query('SELECT * FROM `follow` WHERE `user_id`=? AND `followed_user_id`=?', [userId, newUserId], function (error, results) {
              if (error) throw error;
              expect(results.length > 0);
              done();
            });
          });
      });
  });

  it('responds with 422 when follow already exists', function (done) {
    db.query(
      'SELECT `user_id` FROM `user` WHERE `username`=?', ['doe'], function (err, results) {
        if (err) throw err;
        const newUserId = results[0].user_id;
        request(app).post(`/api/follows/`)
          .set({
            Authorization: `Bearer ${token}`
          })
          .send({
            followedid: newUserId
          })
          .expect(422)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) done(err);
            expect(res.body).to.have.property('msg');
            expect(res.body.msg).to.equal('missing or invalid info');
            done();
          });
      });
  });

  it('responds with 422 when missing followed user id, and body contains error msg(s)', function (done) {
    request(app).post(`/api/follows/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
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

  it('responds with 422 when followed user id is invalid, and body contains error msg(s)', function (done) {
    request(app).post(`/api/follows/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        followedid: "incorrect351325"
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

  it('responds with 422 when followed user id is same as user id', function (done) {
    request(app).post(`/api/follows/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        followedid: userId
      })
      .expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        done();
      });
  });
});