const express = require('express');
const routes = require('./routes/api');
const bodyParser = require('body-parser');

const app = express();

/*if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}*/

app.use(bodyParser.json());
app.use('/api', routes);

app.listen(process.env.PORT || 4000, function () {
  console.log('listening for requests');
})