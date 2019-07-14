const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');

const router = require('./router');
const errorHandler = require('./lib/error');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/user', router.user);
app.use(errorHandler);

module.exports = app;
