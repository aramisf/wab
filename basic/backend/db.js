const { Pool } = require('pg');
const db_config = require('./config/db_config');

const pool = new Pool(db_config);
module.exports = pool;

