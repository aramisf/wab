const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const router = require('./router');

const app = express();

app.use(bodyParser.json());

app.use(cors());
app.use('/user', router.user);

// Error handler
app.use((err, req, res, next) => {
  if (err && !err.statusCode) err.statusCode = 500;

  res.status(err.statusCode).json({
    type: 'error', msg: err.message
  });
});

module.exports = app;
