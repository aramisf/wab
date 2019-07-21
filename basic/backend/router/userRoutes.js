const hash = require('../lib/crypto');
const Session = require('../lib/session');

const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;

const COOKIE_LIFETIME = process.env.PRODUCTION ? Date.now() + 5 * DAY : HOUR;

const session_handler = (username, res, pool) => {
  const session = new Session(username);
  const session_str = session.toString();

  return new Promise( (resolve, reject) => {
    pool.query(
      'UPDATE users SET session_id = $1 WHERE username_hash = $2',
      [session.id, hash(username)],
      (q_err, q_res) => {
        if (q_err) return reject(q_err);


        // http://expressjs.com/en/api.html#res.cookie
        res.cookie('session_str', session_str, {
          //secure: true, // use https (in production)
          httpOnly: true, // disallow js clients to access the cookie data
          //expire: Date.now() + COOKIE_LIFETIME,
          maxAge: COOKIE_LIFETIME,
        });
        resolve();
      }
    );
  });
};


module.exports = function(router, pool) {
  router.get('/all', (req, res, next) => {
    pool.query('SELECT * FROM users', (q_err, q_res) => {
      if (q_err) return next(q_err);

      res.json(q_res.rows);
    });
  });

  router.get('/:id', (req, res, next) => {
    // try to inject some SQL
    //console.log('REQ:', req.params, req.query)
    //pool.query(`SELECT * FROM users WHERE username_hash = ${req.params.id}`, (q_err, q_res) => {
    pool.query(
      'SELECT * FROM users WHERE username_hash = $1',
      [ req.params.id ],
      (q_err, q_res) => {
        if (q_err) return next(q_err);

        res.json(q_res.rows);
      });
  });

  router.post('/new', (req, res, next) => {
    const { username, password } = req.body;
    const username_hash = hash(username);

    pool.query(
      'SELECT * FROM users WHERE username_hash = $1',
      [username_hash],
      (q0_err, q0_res) => {
        if (q0_err) return next(q0_err);

        if (q0_res.rows.length === 0) {
          pool.query(
            'INSERT INTO users(username_hash, password_hash) VALUES($1, $2)',
            [username_hash, hash(password)],
            (q1_err, q1_res) => {
              if (q1_err) return next(q1_err);

              session_handler(username, res, pool)
                .then(_ => {
                  res.json({ msg: 'Successfully created user!' });
                })
                .catch(err => next(err));
            }
          )
        } else {
          res.status(409).json({
            type: 'error',
            msg: 'This username has been taken'
          });
        }
      }
    )
  });

  return router;
}
