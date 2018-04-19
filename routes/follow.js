const express = require('express');
const db = require('../models/db');
const { body, validationResult } = require('express-validator/check');
const auth = require('./middleware/auth');
const router = express.Router();

router.post('/follows', [auth,
  body('username', 'username must be a valid existing user\'s username').exists().isLength({ min: 4, max: 15 }).custom((value) => {
    return new Promise(function (resolve, reject) {
      db.getConnection(function (err, connection) {
        if (err) {
          reject(new Error('internal server error'));
          return;
        }
        connection.query('SELECT `username` FROM `user` WHERE `username`=?', [value], function (err, results) {
          if (err) {
            reject(new Error('internal server error'));
            connection.release();
            return;
          }
          if (results.length === 0) reject(new Error('username is missing or invalid'));
          connection.release();
          resolve(results);
        });
      });
    });
  })]
  , function (req, res) {
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
        connection.query('SELECT `user_id` FROM `user` WHERE `username`=?', [req.body.username], function (err, userResults) {
          if (err) {
            res.status(500).json({ msg: 'internal server error' });
            connection.release();
            return;
          }
          if (userResults[0].user_id === req.authData.id) {
            connection.release();
            return res.status(422).json({ msg: 'missing or invalid info', });
          }
          connection.query('SELECT * FROM `follow` WHERE `user_id`=? AND `followed_user_id`=?', [req.authData.id, userResults[0].user_id], function (err, results) {
            if (err) {
              res.status(500).json({ msg: 'internal server error' });
              connection.release();
              return;
            }
            if (results.length > 0) {
              connection.release();
              res.status(422).json({ msg: 'missing or invalid info' });
              return;
            }
            connection.query('INSERT INTO `follow` (user_id, followed_user_id) VALUES (?, ?);',
              [req.authData.id, userResults[0].user_id], function (err, results) {
                if (err) {
                  res.status(500).json({ msg: 'internal server error' });
                  connection.release();
                  return;
                }
                connection.release();
                res.status(201).json({ msg: 'successful' })
              });
          })
        })
      })
    }
  });


router.delete('/follows', [auth,
  body('username', 'username must be a valid existing user\'s username').exists().isLength({ min: 4, max: 15 }).custom((value) => {
    return new Promise(function (resolve, reject) {
      db.getConnection(function (err, connection) {
        if (err) {
          reject(new Error('internal server error'));
          return;
        }
        connection.query('SELECT `username` FROM `user` WHERE `username`=?', [value], function (err, results) {
          if (err) {
            reject(new Error('internal server error'));
            connection.release();
            return;
          }
          if (results.length === 0) reject(new Error('username is missing or invalid'));
          connection.release();
          resolve(results);
        });
      });
    });
  })]
  , function (req, res) {
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
        connection.query('SELECT `user_id` FROM `user` WHERE `username`=?', [req.body.username], function (err, userResults) {
          if (err) {
            res.status(500).json({ msg: 'internal server error' });
            connection.release();
            return;
          }
          if (userResults[0].user_id === req.authData.id) {
            connection.release();
            return res.status(422).json({ msg: 'missing or invalid info', });
          }
          connection.query('SELECT * FROM `follow` WHERE `user_id`=? AND `followed_user_id`=?', [req.authData.id, userResults[0].user_id], function (err, results) {
            if (err) {
              res.status(500).json({ msg: 'internal server error' });
              connection.release();
              return;
            }
            if (results.length === 0) {
              connection.release();
              res.status(422).json({ msg: 'missing or invalid info' });
              return;
            }
            connection.query('DELETE FROM `follow` WHERE user_id=? AND followed_user_id=?',
              [req.authData.id, userResults[0].user_id], function (err, results) {
                if (err) {
                  res.status(500).json({ msg: 'internal server error' });
                  connection.release();
                  return;
                }
                connection.release();
                res.status(201).json({ msg: 'successful' })
              });
          })
        })
      })
    }
  });


module.exports = router;
