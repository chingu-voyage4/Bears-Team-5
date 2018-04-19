const express = require('express');
const db = require('../models/db');
const { body, validationResult } = require('express-validator/check');
const auth = require('./middleware/auth');
const optionalAuth = require('./middleware/optionalAuth');
const slug = require('slug');
const shortid = require('shortid');
const moment = require('moment');

const router = express.Router();



router.get('/articles/:slug', [function (req, res, next) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ msg: 'internal server error' });
      return;
    }
    connection.query('SELECT * FROM `article` WHERE `slug` = ?', [req.params.slug], function (err, results) {
      if (err) {
        res.status(500).json({ msg: 'internal server error' });
        connection.release();
        return;
      }
      if (results.length === 0) {
        connection.release();
        res.status(404).json({ msg: 'article not found' });
        return;
      }
      results[0].date = moment.parseZone(results[0].date).format('YYYY-MM-DD');

      connection.query('SELECT `username`,`avatar` FROM `user` WHERE `user_id` = ?', [results[0].user_id], function (err, userResults) {
        if (err) {
          res.status(500).json({ msg: 'internal server error' });
          connection.release();
          return;
        }
        connection.release();
        results[0].username = userResults[0].username;
        results[0].avatar = userResults[0].avatar;
        delete results[0].user_id;
        req.results = results[0];
        next();
      });
    });
  })
}, optionalAuth, function (req, res) {
  if (req.authData) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({ msg: 'internal server error' });
        return;
      }
      connection.query('SELECT `user_id` FROM `article` WHERE `article_id` = ?', [req.results.article_id], function (err, results) {
        if (err) {
          res.status(500).json({ msg: 'internal server error' });
          connection.release();
          return;
        }
        connection.release();
        if (results[0].user_id === req.authData.id) {
          req.results.personal = true;
          return res.status(200).json({ article: req.results });
        }
      });
    });
  } else {
    req.results.personal = false;
    return res.status(200).json({ article: req.results });
  }
}])

router.post('/articles', [auth,
  body('title', 'title must not be empty and can not be more than 50 characters long').exists().isLength({ min: 1, max: 50 }),
  body('body', 'body can not be empty').exists().isLength({ min: 1 }),
  body('category', 'category must be a valid category').custom((value) => {
    return ['technology', 'culture', 'entrepreneurship', 'creativity', 'self', 'politics', 'media', 'productivity', 'design', 'popular', 'other']
      .includes(value.toLowerCase());
  }),
  body('date', 'date must be a valid date in the format of YYYY-MM-DD').matches(/^\s*((?:19|20)\d{2})\-(1[012]|0?[1-9])\-(3[01]|[12][0-9]|0?[1-9])\s*$/),
  body('image', 'image must be a valid direct URL of an image').optional().isURL()
],
  function (req, res) {
    const errorFormatter = ({ msg, param }) => {
      return { msg, param };
    };

    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
      res.status(422).json({ msg: 'missing or invalid info', errors: errors.array({ onlyFirstError: true }) });
    } else {
      const titleSlug = slug(req.body.title) + "-" + shortid.generate();

      db.getConnection(function (err, connection) {
        if (err) {
          res.status(500).json({ msg: 'internal server error' });
          return;
        }

        const query = (req.body.image) ? 'INSERT INTO `article` (user_id, title, body, category, date, slug, image) VALUES (?, ?, ?, ?, ?, ?, ?)' :
          'INSERT INTO `article` (user_id, title, body, category, date, slug) VALUES (?, ?, ?, ?, ?, ?)';
        const values = (req.body.image) ? [req.authData.id, req.body.title, req.body.body, req.body.category.toLowerCase(), req.body.date, titleSlug, req.body.image] :
          [req.authData.id, req.body.title, req.body.body, req.body.category.toLowerCase(), req.body.date, titleSlug];

        connection.query(query, values, function (err, results) {
          if (err) {
            res.status(500).json({ msg: 'internal server error' });
            connection.release();
            return;
          }
          connection.release();
          res.status(201).json({ msg: 'successful', slug: titleSlug });
        });
      });
    }
  });

router.patch('/articles', [auth,
  body('article_id', 'article id is missing or invalid').exists().isNumeric().custom((value) => {
    return new Promise(function (resolve, reject) {
      db.getConnection(function (err, connection) {
        if (err) {
          reject(new Error('internal server error'));
          return;
        }
        connection.query('SELECT `user_id` FROM `article` WHERE `article_id`=?', [value], function (err, results) {
          if (err) {
            reject(new Error('internal server error'));
            connection.release();
            return;
          }
          if (results.length === 0) reject(new Error('article id is missing or invalid'));
          connection.release();
          resolve(results);
        });
      });
    });
  }),
  body('newtitle', 'title must not be empty and can not be more than 50 characters long').optional().exists().isLength({ min: 1, max: 50 }),
  body('newbody', 'body can not be empty').optional().exists().isLength({ min: 1 }),
  body('newcategory', 'category must be a valid category').optional().custom((value) => {
    return ['technology', 'culture', 'entrepreneurship', 'creativity', 'self', 'politics', 'media', 'productivity', 'design', 'popular', 'other']
      .includes(value.toLowerCase());
  }),
  body('newimage', 'image must be a valid direct URL of an image').optional().isURL()
],
  function (req, res) {
    const errorFormatter = ({ msg, param }) => {
      return { msg, param };
    };

    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
      if (errors.array().find((err => err.msg === 'internal server error'))) {
        return res.status(500).json({ msg: 'internal server error' });
      } else {
        return res.status(422).json({ msg: 'missing or invalid info', errors: errors.array({ onlyFirstError: true }) });
      }
    } else {
      db.getConnection(function (err, connection) {
        if (err) {
          res.status(500).json({ msg: 'internal server error' });
          return;
        }
        connection.query('SELECT `user_id` FROM `article` WHERE `article_id`=?', [req.body.article_id], function (err, results) {
          if (err) {
            res.status(500).json({ msg: 'internal server error' });
            connection.release();
            return;
          }
          connection.release();
          if (results[0].user_id === req.authData.id) {
            var updatedFields = [];

            function updateTitle() {
              return new Promise(function (resolve) {
                if (req.body.newtitle) {
                  connection.query('UPDATE `article` SET `title`=? WHERE `article_id`=?', [req.body.newtitle, req.body.article_id], function (error) {
                    if (error) {
                      res.status(500).json({ msg: 'internal server error' });
                      connection.release();
                      return;
                    }
                    updatedFields.push('`title`');
                    resolve();
                  });
                } else {
                  resolve();
                }
              })
            }

            function updateBody() {
              return new Promise(function (resolve) {
                if (req.body.newbody) {
                  connection.query('UPDATE `article` SET `body`=? WHERE `article_id`=?', [req.body.newbody, req.body.article_id], function (error) {
                    if (error) {
                      res.status(500).json({ msg: 'internal server error' });
                      connection.release();
                      return;
                    }
                    updatedFields.push('`body`');
                    resolve();
                  });
                } else {
                  resolve();
                }
              })
            }

            function updateCategory() {
              return new Promise(function (resolve) {
                if (req.body.newcategory) {
                  connection.query('UPDATE `article` SET `category`=? WHERE `article_id`=?', [req.body.newcategory, req.body.article_id], function (error) {
                    if (error) {
                      res.status(500).json({ msg: 'internal server error' });
                      connection.release();
                      return;
                    }
                    updatedFields.push('`category`');
                    resolve();
                  });
                } else {
                  resolve();
                }
              })
            }

            function updateImage() {
              return new Promise(function (resolve) {
                if (req.body.newimage) {
                  connection.query('UPDATE `article` SET `image`=? WHERE `article_id`=?', [req.body.newimage, req.body.article_id], function (error) {
                    if (error) {
                      res.status(500).json({ msg: 'internal server error' });
                      connection.release();
                      return;
                    }
                    updatedFields.push('`image`');
                    resolve();
                  });
                } else {
                  resolve();
                }
              })
            }

            updateTitle().then(updateBody).then(updateCategory).then(updateImage).then(() => {
              if (updatedFields.length > 0) {
                updatedFields = updatedFields.join(",");
                const query = 'SELECT ' + updatedFields + ' FROM `article` WHERE `article_id`=' + req.body.article_id;
                connection.query(query, function (error, results) {
                  if (error) {
                    res.status(500).json({ msg: 'internal server error' });
                    connection.release();
                    return;
                  }
                  return res.status(200).send({ msg: 'successful', article: results[0] });
                });
              } else {
                return res.status(422).send({ msg: 'missing or invalid info' });
              }
            });
          } else {
            return res.status(401).send({ msg: 'auth failed' });
          }
        });
      });
    }
  }
);

router.delete('/articles', [auth,
  body('article_id', 'article id is missing or invalid').exists().isNumeric()],
  function (req, res) {
    const errorFormatter = ({ msg, param }) => {
      return { msg, param };
    };
    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
      res.status(422).json({ msg: 'missing or invalid info', errors: errors.array({ onlyFirstError: true }) });
    } else {
      db.getConnection(function (err, connection) {
        if (err) {
          res.status(500).json({ msg: 'internal server error' });
          return;
        }
        connection.query('SELECT `user_id` FROM `article` WHERE `article_id`=?', [req.body.article_id], function (err, results) {
          if (err) {
            res.status(500).json({ msg: 'internal server error' });
            connection.release();
            return;
          }

          if (results[0].user_id === req.authData.id) {
            connection.query('DELETE FROM `article` WHERE `article_id`=?', [req.body.article_id], function (err, results) {
              if (err) {
                res.status(500).json({ msg: 'internal server error' });
                connection.release();
                return;
              }
              connection.release();
              return res.status(200).send({ msg: 'successful' });
            });
          } else {
            connection.release();
            return res.status(401).send({ msg: 'auth failed' });
          }
        })
      });
    }
  });

module.exports = router;
