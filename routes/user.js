const express = require('express');
const db = require('../models/db');
const { body, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

const router = express.Router();



router.get('/users', auth, function (req, res) {
  // TODO
  res.send({ type: 'GET' });
});

router.post(
  '/register', [
    body('username', 'username must be between 4 to 15 characters long, and can only contain alphanumerics, underscores and dashes.')
      .exists().isLength({ min: 4, max: 15 }).matches(/^[A-Za-z0-9_-]+$/i),

    body('username').custom((value) => {
      return new Promise(function (resolve, reject) {
        db.getConnection(function (err, connection) {
          if (err) {
            reject(new Error('internal server error'));
            return;
          }
          connection.query('SELECT `username` FROM `user` WHERE `username` = ?', [value], function (err, results) {
            if (err) {
              reject(new Error('internal server error'));
              connection.release();
              return;
            }
            if (results.length > 0) reject(new Error('this username is already in use.'));
            connection.release();
            resolve(results);
          });
        });
      });
    }),

    body('email', 'e-mail must be a valid e-mail address.').exists().isEmail(),

    body('email').trim().custom((value) => {
      return new Promise(function (resolve, reject) {
        db.getConnection(function (err, connection) {
          if (err) {
            reject(new Error('internal server error'));
            return;
          }
          connection.query('SELECT `email` FROM `user` WHERE `email` = ?', [value], function (err, results) {
            if (err) {
              reject(new Error('internal server error'));
              connection.release();
              return;
            }
            if (results.length > 0) reject(new Error('this email is already in use.'));
            connection.release();
            resolve(results);
          });
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
      if (errors.array().find((err => err.msg === 'internal server error'))) {
        return res.status(500).json({ msg: 'internal server error' });
      } else {
        res.status(422).json({ msg: 'missing or invalid info', errors: errors.array({ onlyFirstError: true }) });
      }
    } else {
      const saltRounds = 10;
      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        db.getConnection(function (err, connection) {
          if (err) {
            res.status(500).json({ msg: 'internal server error' });
            return;
          }
          connection.query('INSERT INTO `user` (username, password, email) VALUES (?, ?, ?)', [req.body.username, hash, req.body.email], function (error, results) {
            if (err) {
              res.status(500).json({ msg: 'internal server error' });
              connection.release();
              return;
            }
            const userId = results.insertId;
            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
              expiresIn: "3h"
            });
            connection.release();
            res.status(201).json({
              msg: 'successful',
              token: `Bearer ${token}`
            });
          });
        });
      });
    }
  }
);

router.post('/login', function (req, res) {
  if (req.body.username && req.body.password) {
    db.getConnection(function (err, connection) {
      if (err) {
        res.status(500).json({ msg: 'internal server error' });
        return;
      }
      connection.query('SELECT `password`, `user_id` FROM `user` WHERE `username` = ?', [req.body.username], function (err, results) {
        if (err) {
          res.status(500).json({ msg: 'internal server error' });
          connection.release();
          return;
        }
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
    });
  } else { return badInfo() }

  function badInfo() {
    return res.status(422).json({ msg: 'invalid username or password' });
  }
});

router.patch('/users/', [auth,
  body('newusername', 'username must be between 4 to 15 characters long, and can only contain alphanumerics, underscores and dashes.')
    .optional().isLength({ min: 4, max: 15 }).matches(/^[A-Za-z0-9_-]+$/i),

  body('newusername').optional().custom((value) => {
    return new Promise(function (resolve, reject) {
      db.getConnection(function (err, connection) {
        if (err) {
          reject(new Error('internal server error'));
          return;
        }
        connection.query('SELECT `username` FROM `user` WHERE `username` = ?', [value], function (err, results) {
          if (err) {
            reject(new Error('internal server error'));
            connection.release();
            return;
          }
          if (results.length > 0) reject(new Error('this username is already in use.'));
          connection.release();
          resolve(results);
        });
      });
    });
  }),

  body('newemail', 'e-mail must be a valid e-mail address.').optional().isEmail(),

  body('newemail').optional().trim().custom((value) => {
    return new Promise(function (resolve, reject) {
      db.getConnection(function (err, connection) {
        if (err) {
          reject(new Error('internal server error'));
          return;
        }
        connection.query('SELECT `email` FROM `user` WHERE `email` = ?', [value], function (err, results) {
          if (err) {
            reject(new Error('internal server error'));
            connection.release();
            return;
          }
          if (results.length > 0) reject(new Error('this email is already in use.'));
          connection.release();
          resolve(results);
        });
      });
    });
  }),

  body('newpassword', 'password must be at least 8 characters long, and include one lowercase character, one uppercase character, a number, and a special character.').optional().isLength({ min: 8 }).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/i),

  body('confirm_new_password', 'passwords must match').optional().custom((value, { req }) => {
    return req.body.newpassword === req.body.confirm_new_password;
  }),

  body('avatar', 'avatar must be a valid direct URL of an image').optional().isURL()
], function (req, res) {
  db.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ msg: 'internal server error' });
      return;
    }
    connection.query('SELECT `username` FROM `user` WHERE `user_id`=?', [req.authData.id], function (err, results) {
      if (err) {
        res.status(500).json({ msg: 'internal server error' });
        connection.release();
        return;
      }
      if (results.length !== 0) {
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
        }
        var updatedFields = [];
        var updatedPassword = false;
        // all fields must be checked on the frontend for changes after being served by GET request
        function updatePassword() {
          return new Promise(function (resolve, reject) {
            if (req.body.password && req.body.newpassword && req.body.confirm_new_password) {
              connection.query('SELECT `password` FROM `user` WHERE `user_id` = ?', [req.authData.id], function (err, results) {
                if (err) {
                  res.status(500).json({ msg: 'internal server error' });
                  connection.release();
                  return;
                }
                if (results.length === 1) {
                  const hashedPassword = results[0].password.toString();
                  bcrypt.compare(req.body.password, hashedPassword, function (err, compareResult) {
                    if (err) { reject('missing or invalid info') }
                    if (compareResult) {
                      const saltRounds = 10;
                      bcrypt.hash(req.body.newpassword, saltRounds, function (err, hash) {
                        connection.query('UPDATE `user` SET `password`=? WHERE `user_id`=?', [hash, req.authData.id], function (error) {
                          if (error) throw error;
                          updatedPassword = true;
                          resolve();
                        });
                      });
                    } else { reject('missing or invalid info') }
                  });
                } else { reject('missing or invalid info') }
              });
            } else { resolve() }
          })
        }
        function updateEmail() {
          return new Promise(function (resolve) {
            if (req.body.newemail) {
              connection.query('UPDATE `user` SET `email`=? WHERE `user_id`=?', [req.body.newemail, req.authData.id], function (error) {
                if (error) {
                  res.status(500).json({ msg: 'internal server error' });
                  connection.release();
                  return;
                }
                updatedFields.push('`email`');
                resolve();
              });
            } else {
              resolve();
            }
          })
        }
        function updateUsername() {
          return new Promise(function (resolve) {
            if (req.body.newusername) {
              connection.query('UPDATE `user` SET `username`=? WHERE `user_id`=?', [req.body.newusername, req.authData.id], function (error) {
                if (error) {
                  res.status(500).json({ msg: 'internal server error' });
                  connection.release();
                  return;
                }
                updatedFields.push('`username`');
                resolve();
              });
            } else {
              resolve();
            }
          })
        }
        function updateBio() {
          return new Promise(function (resolve) {
            if (req.body.bio) {
              connection.query('UPDATE `user` SET `bio`=? WHERE `user_id`=?', [req.body.bio, req.authData.id], function (error) {
                if (error) {
                  res.status(500).json({ msg: 'internal server error' });
                  connection.release();
                  return;
                }
                updatedFields.push('`bio`');
                resolve();
              });
            } else {
              resolve();
            }
          })
        }
        function updateAvatar() {
          return new Promise(function (resolve) {
            if (req.body.avatar) {
              connection.query('UPDATE `user` SET `avatar`=? WHERE `user_id`=?', [req.body.avatar, req.authData.id], function (error) {
                if (error) {
                  res.status(500).json({ msg: 'internal server error' });
                  connection.release();
                  return;
                }
                updatedFields.push('`avatar`');
                resolve();
              });
            } else {
              resolve();
            }
          })
        }

        updatePassword().then(updateEmail).then(updateUsername).then(updateAvatar).then(updateBio).then(() => {
          if (updatedFields.length > 0) {
            updatedFields = updatedFields.join(",");
            // SQLi security threat
            const query = 'SELECT ' + updatedFields + ' FROM `user` WHERE `user_id`=' + req.authData.id;
            connection.query(query, function (error, results) {
              if (error) {
                res.status(500).json({ msg: 'internal server error' });
                connection.release();
                return;
              }
              results[0].changed_password = updatedPassword;
              return res.status(200).send({ msg: 'successful', user: results[0] });
            });
          }
          if (updatedPassword && updatedFields.length === 0) {
            return res.status(200).send({ msg: 'successful', user: { changed_password: updatedPassword } });
          }
          if (!updatedPassword && updatedFields.length === 0) {
            throw new Error('missing or invalid info');
          }
        }).catch(function () {
          return res.status(422).send({ msg: 'missing or invalid info' });
        });

      } else {
        return res.status(401).send({ msg: 'auth failed' });
      }
    })
  });


});

module.exports = router;
