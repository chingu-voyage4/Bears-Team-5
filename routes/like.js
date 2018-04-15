const express = require('express');
const db = require('../models/db');
const { body, validationResult } = require('express-validator/check');
const auth = require('./middleware/auth');

const router = express.Router();

router.post('/likes', [auth,
  body('article_id', 'article id is missing or invalid').exists().isNumeric()]
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
        connection.query('SELECT * FROM `like` WHERE `article_id`=? AND `user_id`=?', [req.body.article_id, req.authData.id], function (err, results) {
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
          connection.query('INSERT INTO `like` (user_id, article_id) VALUES (?, ?); UPDATE `article` SET likes=likes+1 WHERE `article_id`=?;',
            [req.authData.id, req.body.article_id, req.body.article_id], function (err, results) {
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

router.delete('/likes', [auth,
  body('article_id', 'article id is missing or invalid').exists().isNumeric()]
  , function (req, res) {
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
        connection.query('SELECT * FROM `like` WHERE `article_id`=? AND `user_id`=?', [req.body.article_id, req.authData.id], function (err, results) {
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
          connection.query('DELETE FROM `like` WHERE `user_id`=? AND `article_id`=? ; UPDATE `article` SET likes=likes-1 WHERE `article_id`=?;',
            [req.authData.id, req.body.article_id, req.body.article_id], function (err, results) {
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
