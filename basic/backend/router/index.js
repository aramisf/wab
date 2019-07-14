const { Router } = require('express');
const pool = require('../db');
const router = new Router();

const userRoutes = require('./userRoutes');

module.exports = {
  user: userRoutes(router, pool),
}
