const express = require('express');
const db = require('../models/db');
const router = express.Router();


router.get('/user', function (req, res) {
  res.send({ type: 'GET' });
});

router.post('/user', function (req, res) {
  res.send({ type: 'POST' });
});

router.put('/user/:id', function (req, res) {
  res.send({ type: 'PUT' });
});

router.delete('/user/:id', function (req, res) {
  res.send({ type: 'DELETE' });
});

module.exports = router;