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

  it('body contains 2 different slugs when submitting two articles with the same title', function (done) {
    var slug1;
    var slug2;
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
        slug1 = res.body.slug;

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
          .end(function (err2, res2) {
            if (err2) done(err2);
            expect(res2.body).to.have.property('msg');
            expect(res2.body.msg).to.equal('successful');
            expect(res2.body).to.have.property('slug');
            expect(res2.body.slug.length > 0, 'slug string length is above 0');
            slug2 = res2.body.slug;
            expect(slug1).to.not.equal(slug2);
            done();
          });
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


describe('get single article handler', function () {
  var userId;
  var token;
  before(function (done) {
    seed().then(getUserId).then(function (response) {
      return new Promise(function (resolve) {
        userId = response;
        token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
          expiresIn: "3h"
        });
        resolve(userId);
      });
    }).then((response) => articleSeed(response)).then(done);
  });

  it('responds with 200 and body contains personal:false if no JWT is included', function (done) {
    request(app).get(`/api/articles/dance moves-e51687c`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('article');
        expect(res.body.article.length === 8, 'slug string length is equal to 8, it includes all article info');
        done();
      });
  });

  it('responds with 200 and body contains personal:false if the JWT of someone else is included', function (done) {
    request(app).get(`/api/articles/dance moves-e51687c`)
      .set({
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTIxMTk4MzUzLCJleHAiOjE1MjEyMDkxNTN9.ue9Ef8qBH4kQmnbngoWvjUm9fQhuvHV9l_BoHP2uVoc'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('article');
        expect(res.body.article.length === 8, 'slug string length is equal to 8, it includes all article info');
        expect(res.body.article.personal).to.be.false;
        done();
      });
  });

  it('responds with 200 and body contains personal:true if the JWT of the owner is included', function (done) {
    request(app).get(`/api/articles/dance moves-e51687c`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('article');
        expect(res.body.article.length === 8, 'slug string length is equal to 8, it includes all article info');
        expect(res.body.article.personal).to.be.true;
        done();
      });
  });

  it('responds with 404 if article doesnt not exist, and body contains error', function (done) {
    request(app).get(`/api/articles/economics-101-e13q9we`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('article not found');
        done();
      });
  });
});

describe('update article handler', function () {
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

  it('responds with 401 when missing JWT in request headers, and body contains Auth failed msg', function (done) {
    request(app).patch(`/api/articles/`)
      .send({
        article_id: articleId,
        newtitle: "python tutorial"
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
    request(app).patch(`/api/articles/`)
      .set({
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTIxMTk4MzUzLCJleHAiOjE1MjEyMDkxNTN9.ue9Ef8qBH4kQmnbngoWvjUm9fQhuvHV9l_BoHP2uVoc'
      })
      .send({
        article_id: articleId,
        newtitle: "python tutorial"
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

  it('responds with 422 when request body contains no info fields at all, and body contains error msg(s)', function (done) {
    request(app).patch(`/api/articles/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        article_id: articleId
      }).expect(422)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('missing or invalid info');
        done();
      });
  });

  it('responds with 422 when submitting an empty title, and body contains error msg(s)', function (done) {
    request(app).patch(`/api/articles/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        article_id: articleId,
        newtitle: "",
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
    request(app).patch(`/api/articles/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        article_id: articleId,
        newbody: "",
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
    request(app).patch(`/api/articles/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        article_id: articleId,
        newcategory: "ES6",
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
    request(app).patch(`/api/articles/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        article_id: articleId,
        newimage: "bcraw",
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

  it('responds with 422 when missing article id, and body contains error msg(s)', function (done) {
    request(app).patch(`/api/articles/`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        newtitle: "python machine learning"
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

  it('responds with 401 when updating an article you do not own, and body contains error msg(s)', function (done) {
    db.query(
      'SELECT `user_id` FROM `user` WHERE `username`=?', ['doe'], function (err, results) {
        if (err) throw err;
        const newUserId = results[0].user_id;
        const newToken = jwt.sign({ id: newUserId }, process.env.JWT_SECRET, {
          expiresIn: "3h"
        });

        request(app).patch(`/api/articles/`)
          .set({
            Authorization: `Bearer ${newToken}`
          })
          .send({
            article_id: articleId,
            newtitle: "python machine learning"
          })
          .expect(401)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) done(err);
            expect(res.body).to.have.property('msg');
            expect(res.body.msg).to.equal('auth failed');
            done();
          });
      }
    );
  });

  it('responds with 200 when trying to change title with correct info, and body contains changed fields. DB updated', function (done) {
    db.query('SELECT `title` FROM `article` WHERE `article_id`=?', [articleId], function (err, results) {
      if (err) throw err;
      request(app).patch(`/api/articles/`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          article_id: articleId,
          newtitle: "python tutorial"
        }).expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) done(err);
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('successful');
          expect(res.body.article).to.have.property('title');
          expect(res.body.article.title).to.equal('python tutorial');
          db.query('SELECT `title` FROM `article` WHERE `article_id`=?', [articleId], function (error, updatedResults) {
            if (error) throw error;
            expect(results[0].title.toString() !== updatedResults[0].title.toString())
            done();
          });
        });
    });
  });

  it('responds with 200 when trying to change body with correct info, and body contains changed fields. DB updated', function (done) {
    db.query('SELECT `body` FROM `article` WHERE `article_id`=?', [articleId], function (err, results) {
      if (err) throw err;
      request(app).patch(`/api/articles/`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          article_id: articleId,
          newbody: "this is a python tutorial now, wow!"
        }).expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) done(err);
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('successful');
          expect(res.body.article).to.have.property('body');
          expect(res.body.article.body).to.equal('this is a python tutorial now, wow!');
          db.query('SELECT `body` FROM `article` WHERE `article_id`=?', [articleId], function (error, updatedResults) {
            if (error) throw error;
            expect(results[0].body.toString() !== updatedResults[0].body.toString())
            done();
          });
        });
    });
  });

  it('responds with 200 when trying to change category with correct info, and body contains changed fields. DB updated', function (done) {
    db.query('SELECT `category` FROM `article` WHERE `article_id`=?', [articleId], function (err, results) {
      if (err) throw err;
      request(app).patch(`/api/articles/`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          article_id: articleId,
          newcategory: 'culture'
        }).expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) done(err);
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('successful');
          expect(res.body.article).to.have.property('category');
          expect(res.body.article.category).to.equal('culture');
          db.query('SELECT `category` FROM `article` WHERE `article_id`=?', [articleId], function (error, updatedResults) {
            if (error) throw error;
            expect(results[0].category.toString() !== updatedResults[0].category.toString())
            done();
          });
        });
    });
  });

  it('responds with 200 when trying to change image with correct info, and body contains changed fields. DB updated', function (done) {
    db.query('SELECT `image` FROM `article` WHERE `article_id`=?', [articleId], function (err, results) {
      if (err) throw err;
      request(app).patch(`/api/articles/`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          article_id: articleId,
          newimage: 'https://imagesworld.com/free/test.svg'
        }).expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) done(err);
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('successful');
          expect(res.body.article).to.have.property('image');
          expect(res.body.article.image).to.equal('https://imagesworld.com/free/test.svg');
          db.query('SELECT `image` FROM `article` WHERE `article_id`=?', [articleId], function (error, updatedResults) {
            if (error) throw error;
            expect(results[0].image.toString() !== updatedResults[0].image.toString())
            done();
          });
        });
    });
  });

  it('responds with 200 when trying to change multiple fields with correct info, and body contains changed fields. DB updated', function (done) {
    db.query('SELECT `image`, `body`, `title` FROM `article` WHERE `article_id`=?', [articleId], function (err, results) {
      if (err) throw err;
      request(app).patch(`/api/articles/`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          article_id: articleId,
          newimage: 'https://imagesworld.com/free/freedom.png',
          newtitle: 'ES6 cheatsheet',
          newbody: '<i>this is a useful es6 cheatsheet</i>'
        }).expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) done(err);
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('successful');
          expect(res.body.article).to.have.property('image');
          expect(res.body.article).to.have.property('body');
          expect(res.body.article).to.have.property('title');
          expect(res.body.article.image).to.equal('https://imagesworld.com/free/freedom.png');
          expect(res.body.article.title).to.equal('ES6 cheatsheet');
          expect(res.body.article.body).to.equal('<i>this is a useful es6 cheatsheet</i>');
          db.query('SELECT `image`, `body`, `title` FROM `article` WHERE `article_id`=?', [articleId], function (error, updatedResults) {
            if (error) throw error;
            expect(results[0].image.toString() !== updatedResults[0].image.toString())
            expect(results[0].body.toString() !== updatedResults[0].body.toString())
            expect(results[0].title.toString() !== updatedResults[0].title.toString())
            done();
          });
        });
    });
  });

  describe('delete article handler', function () {
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

    it('responds with 401 when missing JWT in request headers, and body contains Auth failed msg', function (done) {
      request(app).delete(`/api/articles/`)
        .send({
          article_id: articleId,
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
      request(app).delete(`/api/articles/`)
        .set({
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTIxMTk4MzUzLCJleHAiOjE1MjEyMDkxNTN9.ue9Ef8qBH4kQmnbngoWvjUm9fQhuvHV9l_BoHP2uVoc'
        })
        .send({
          article_id: articleId,
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

    it('responds with 422 when missing article id, and body contains error msg(s)', function (done) {
      request(app).delete(`/api/articles/`)
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

    it('responds with 401 when deleting an article you do not own, and body contains error msg(s)', function (done) {
      db.query(
        'SELECT `user_id` FROM `user` WHERE `username`=?', ['doe'], function (err, results) {
          if (err) throw err;
          const newUserId = results[0].user_id;
          const newToken = jwt.sign({ id: newUserId }, process.env.JWT_SECRET, {
            expiresIn: "3h"
          });

          request(app).delete(`/api/articles/`)
            .set({
              Authorization: `Bearer ${newToken}`
            })
            .send({
              article_id: articleId,
            })
            .expect(401)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
              if (err) done(err);
              expect(res.body).to.have.property('msg');
              expect(res.body.msg).to.equal('auth failed');
              done();
            });
        }
      );
    });

    it('responds with 200 when deleting a personal article, and body contains success msg', function (done) {
      request(app).delete(`/api/articles/`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          article_id: articleId,
        }).expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) done(err);
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('successful');
          db.query('SELECT `title` FROM `article` WHERE `article_id`=?', [articleId], function (error, results) {
            if (error) throw error;
            expect(results.length === 0);
            done();
          });
        });
    });


  });


})