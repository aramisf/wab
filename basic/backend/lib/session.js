const uuid = require('uuid/v4');
const hash = require('./crypto');

class Session {
  constructor(username) {
    this.username = username;
    this.id = uuid();
  }

  toString() {
    return Session.dataToString(this.username, this.id);
  }

  static userData(username, id) {
    return `${username}|${id}`;
  }

  static dataToString(username, id) {
    const user_data = Session.userData(username, id);
    return `${user_data}|${hash(user_data)}`;
  }

  static parse(session_str) {
    const session_data = session_str.split('|');
    return {
      username: session_data[0],
      id: session_data[1],
      session_hash: session_data[2]
    };
  }

  static verify(session_str) {
    const { username, id, session_hash } = Session.parse(session_str);
    const user_data = Session.userData(username, id);

    return hash(user_data) === session_hash;
  }
}
module.exports = Session;
