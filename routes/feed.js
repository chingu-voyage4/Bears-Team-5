const express = require('express');
const db = require('../models/db');
const { query, validationResult } = require('express-validator/check');
const auth = require('./middleware/auth');
const optionalAuth = require('./middleware/optionalAuth');
const moment = require('moment');

const router = express.Router();

router.get('/feeds', optionalAuth, [
  query('category', 'category must be a valid category').optional().custom((value) => {
    return ['technology', 'culture', 'entrepreneurship', 'creativity', 'self', 'politics', 'media', 'productivity', 'design', 'popular', 'other']
      .includes(value.toLowerCase());
  }),
  query('followed', 'followed must be a boolean value').optional().isBoolean(),
  query('maxcount', 'maxcount must be a valid integer').optional().isInt().custom((value) => value > 0)
],
  function (req, res) {
    const errorFormatter = ({ msg, param }) => {
      return { msg, param };
    };

    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
      res.status(422).json({ msg: 'missing or invalid info', errors: errors.array({ onlyFirstError: true }) });
    } else {
      const maxcount = req.query.maxcount || 20;
      const followed = (typeof req.query.followed !== "undefined") && req.query.followed && req.authData ? true : false;
      var idArr;
      var query;

      db.getConnection(function (err, connection) {
        if (err) {
          res.status(500).json({ msg: 'internal server error' });
          return;
        }
        if (followed) {
          connection.query('SELECT `followed_user_id` FROM `follow` WHERE `user_id`=?', [req.authData.id], function (err, followedResults) {
            if (err) {
              res.status(500).json({ msg: 'internal server error' });
              connection.release();
              return;
            }
            idArr = followedResults.map((value) => `'${value.followed_user_id}'`).join(',');
            query = req.query.category ? `SELECT * FROM \`article\` WHERE \`user_id\` IN ${followed ? ('( ' + idArr + ' )') : ''} category='${req.query.category}' LIMIT ${maxcount}`
              : `SELECT * FROM \`article\` WHERE \`user_id\` IN ${followed ? ('( ' + idArr + ' )') : ''} LIMIT ${maxcount}`;
            return finishQuery();

          });
        } else {
          query = req.query.category ? `SELECT \`article_id\`, \`title\`, \`body\`, \`category\`, \`date\`, \`likes\`, \`image\` FROM \`article\` WHERE category='${req.query.category}' LIMIT ${maxcount}`
            : `SELECT \`article_id\`, \`title\`, \`body\`, \`category\`, \`date\`, \`likes\`, \`image\` FROM \`article\` LIMIT ${maxcount}`;
          return finishQuery();
        }

        function finishQuery() {
          connection.query(query, function (err, results) {
            if (err) {
              console.log(err);
              res.status(500).json({ msg: 'internal server error' });
              connection.release();
              return;
            }
            connection.release();
            results = results.map((value) => {
              value.date = moment.parseZone(value.date).format('YYYY-MM-DD');
              delete value.user_id;
              return value;
            })
              .sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
              });
            return res.status(200).json({ articles: results });
          });
        }
      });
    }
  }
)

module.exports = router;