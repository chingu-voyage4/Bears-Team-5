const express = require('express');
const db = require('../models/db');
const { body, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('/user', function (req, res) {
  // TODO
  res.send({ type: 'GET' });
});

router.post(
  '/register', [
    body('username', 'username must be between 4 to 15 characters long, and can only contain alphanumerics, underscores and dashes.')
      .exists().isLength({ min: 4, max: 15 }).matches(/^[A-Za-z0-9_-]+$/i),

    body('username').custom((value) => {
      return new Promise(function (resolve, reject) {
        db.query('SELECT `username` FROM `user` WHERE `username` = ?', [value], function (err, results) {
          if (err) throw err;
          if (results.length > 0) reject(new Error('this username is already in use.'));
          resolve(results);
        });
      });
    }),

    body('email', 'e-mail must be a valid e-mail address.').exists().isEmail(),

    body('email').trim().custom((value) => {
      return new Promise(function (resolve, reject) {
        db.query('SELECT `email` FROM `user` WHERE `email` = ?', [value], function (err, results) {
          if (err) throw err;
          if (results.length > 0) reject(new Error('this email is already in use.'));
          resolve(results);
        });
      });
    }),

    body('password', 'password must be at least 8 characters long, and include one lowercase character, one uppercase character, a number, and a special character.').exists().isLength({ min: 8 }).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/i),

    body('confirmpassword', 'passwords must match').exists().custom((value, { req }) => {
      return req.body.password === req.body.confirmpassword;
    })],
  (req, res) => {
    const errorFormatter = ({ msg, param }) => {
      return { msg, param };
    };

    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
      res.status(422).json({ msg: 'missing or invalid info', errors: errors.array({ onlyFirstError: true }) });
    } else {
      const saltRounds = 10;
      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        db.query('INSERT INTO `user` (username, password, email) VALUES (?, ?, ?)', [req.body.username, hash, req.body.email], function (error, results) {
          if (error) throw error;
          const userId = results.insertId;
          const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: "3h"
        });
          res.status(201).json({
            msg: 'successful',
            token: `Bearer ${token}`
      });
        });
      });
    }
  }
);

router.post('/login', function (req, res) {
  if (req.body.username && req.body.password) {
    db.query('SELECT `password`, `user_id` FROM `user` WHERE `username` = ?', [req.body.username], function (err, results) {
      if (err) throw err;
      if (results.length === 1) {
        const hashedPassword = results[0].password.toString();
        bcrypt.compare(req.body.password, hashedPassword, function (err, compareResult) {
          if (err) { return badInfo() }
          if (compareResult) {
            const userId = results[0].user_id;
            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
              expiresIn: "3h"
            });
            res.status(200).json({
              msg: 'successful',
              token: `Bearer ${token}`
            });
          } else { return badInfo() }
        });
      } else { return badInfo() }
    });
  } else { return badInfo() }

  function badInfo() {
    return res.status(422).json({ msg: 'invalid username or password' });
  }
});
});

module.exports = router;
