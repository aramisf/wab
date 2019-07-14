// The line below should only be needed if this file is required isolated from
// a full system run.
//require('dotenv').config();

module.exports = {
  user: process.env.PG_MY_USER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PG_MY_USER_PASSWORD,
}
