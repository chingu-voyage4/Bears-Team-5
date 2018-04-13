const express = require('express');
const users = require('./routes/user');
const articles = require('./routes/article');
const bodyParser = require('body-parser');
const cors = require('cors');

if (process.env.NODE_ENV === 'production') { console.log = function () { }; }

const app = express();

app.use(bodyParser.json());
app.options('*', cors());
app.use('/api', users, articles);

app.listen(process.env.PORT || 4000, function () {
  console.log('listening for requests');
});

module.exports = app;
