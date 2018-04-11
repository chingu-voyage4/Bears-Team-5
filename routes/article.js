const express = require('express');
const db = require('../models/db');
const { body, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const optionalAuth = require('./middleware/optionalAuth');
const slug = require('slug');
const shortid = require('shortid');
const moment = require('moment');

const router = express.Router();


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
        const values = (req.body.image) ? [req.authData.id, req.body.title, req.body.body, req.body.category, req.body.date, titleSlug, req.body.image] :
          [req.authData.id, req.body.title, req.body.body, req.body.category, req.body.date, titleSlug];

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

module.exports = router;
