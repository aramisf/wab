const sha512 = require('crypto-js/sha512');
const { APP_SECRET } = require('../config/secrets');

const hash = str => sha512(`${ APP_SECRET }${ str }${ APP_SECRET }`).toString();

module.exports = hash;
