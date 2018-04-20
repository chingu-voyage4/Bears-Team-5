const express = require('express');
const db = require('../models/db');
const { body, validationResult } = require('express-validator/check');
const auth = require('./middleware/auth');
const router = express.Router();

router.post('/follows', [auth,
  body('followedid', 'followed user id must be a valid existing user id').exists().isNumeric().custom((value) => {
    return new Promise(function (resolve, reject) {
      db.getConnection(function (err, connection) {
        if (err) {
          reject(new Error('internal server error'));
          return;
        }
        connection.query('SELECT `username` FROM `user` WHERE `user_id`=?', [value], function (err, results) {
          if (err) {
            reject(new Error('internal server error'));
            connection.release();
            return;
          }
          if (results.length === 0) reject(new Error('user id is missing or invalid'));
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
      if (req.authData.id === req.body.followedid) {
        return res.status(422).json({ msg: 'missing or invalid info' });
      }
      db.getConnection(function (err, connection) {
        if (err) {
          res.status(500).json({ msg: 'internal server error' });
          return;
        }
        connection.query('SELECT * FROM `follow` WHERE `user_id`=? AND `followed_user_id`=?', [req.authData.id, req.body.followedid], function (err, results) {
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
            [req.authData.id, req.body.followedid], function (err, results) {
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
    }
  });

router.delete('/follows', [auth,
  body('followedid', 'followed user id must be a valid existing user id').exists().isNumeric().custom((value) => {
    return new Promise(function (resolve, reject) {
      db.getConnection(function (err, connection) {
        if (err) {
          reject(new Error('internal server error'));
          return;
        }
        connection.query('SELECT `username` FROM `user` WHERE `user_id`=?', [value], function (err, results) {
          if (err) {
            reject(new Error('internal server error'));
            connection.release();
            return;
          }
          if (results.length === 0) reject(new Error('user id is missing or invalid'));
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
        connection.query('SELECT * FROM `follow` WHERE `user_id`=? AND `followed_user_id`=?', [req.authData.id, req.body.followedid], function (err, results) {
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
            [req.authData.id, req.body.followedid], function (err, results) {
              if (err) {
                res.status(500).json({ msg: 'internal server error' });
                connection.release();
                return;
              }
              connection.release();
              res.status(200).json({ msg: 'successful' })
            });
        })
      })
    }
  });


module.exports = router;
