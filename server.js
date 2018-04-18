const express = require('express');
const users = require('./routes/user');
const articles = require('./routes/article');
const likes = require('./routes/like');
const follows = require('./routes/follow');
const feeds = require('./routes/feed');
const bodyParser = require('body-parser');
const cors = require('cors');

if (process.env.NODE_ENV === 'production') { console.log = function () { }; }

const app = express();

app.use(bodyParser.json());
app.options('*', cors());
app.use('/api', users, articles, likes, follows, feeds);

app.listen(process.env.PORT || 4000, function () {
  console.log('listening for requests');
});

module.exports = app;
