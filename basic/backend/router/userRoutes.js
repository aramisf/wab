const hash = require('../lib/crypto');
const Session = require('../lib/session');

const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;

const COOKIE_LIFETIME = process.env.PRODUCTION ? Date.now() + 5 * DAY : HOUR;

const set_session_cookie = (session_str, res) => {
  // http://expressjs.com/en/api.html#res.cookie
  res.cookie('session_str', session_str, {
    secure: process.ENV === 'production', // use https (in production)
    httpOnly: true, // disallow js clients to access the cookie data
    //expire: Date.now() + COOKIE_LIFETIME,
    maxAge: COOKIE_LIFETIME,
  });
};

const set_session = ({ username, res, pool, session_id }) => {
  let session, session_str;

  if (session_id) {
    session_str = Session.dataToString(username, session_id);
  }
  else {
    session = new Session(username);
    session_str = session.toString();
  }

  return new Promise( (resolve, reject) => {

    if (session_id) {
      set_session_cookie(session_str, res);
      resolve();
    }

    else {
      pool.query(
        'UPDATE users SET session_id = $1 WHERE username_hash = $2',
        [session.id, hash(username)],
        (q_err, q_res) => {
          if (q_err) return reject(q_err);

          set_session_cookie(session_str, res);
          resolve();
        }
      );
    }
  });
};


module.exports = function(router, pool) {
  router.get('/all', (req, res, next) => {
    pool.query('SELECT * FROM users', (q_err, q_res) => {
      if (q_err) return next(q_err);

      res.json(q_res.rows);
    });
  });

  // Experimental
  //router.get('/:id', (req, res, next) => {
  //  // try to inject some SQL
  //  //console.log('REQ:', req.params, req.query)
  //  //pool.query(`SELECT * FROM users WHERE username_hash = ${req.params.id}`, (q_err, q_res) => {
  //  pool.query(
  //    'SELECT * FROM users WHERE username_hash = $1',
  //    [ req.params.id ],
  //    (q_err, q_res) => {
  //      if (q_err) return next(q_err);

  //      res.json(q_res.rows);
  //    });
  //});

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

              set_session({ username, res, pool })
                .then(_ => {
                  res.json({ msg: 'Successfully created user!' });
                })
                .catch(err => next(err));
            }
          )
        }

        else {
          res.status(409).json({
            type: 'error',
            msg: 'This username has been taken'
          });
        }
      }
    )
  });

  router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    const username_hash = hash(username);

    pool.query(
      'SELECT * FROM users WHERE username_hash = $1',
      [username_hash],
      (q_err, q_res) => {
        if (q_err) return next(q_err);

        const user = q_res.rows[0];

        if (user && user.password_hash === hash(password)) {

          const { session_id } = user;
          set_session({ username, res, pool, session_id })
            .then(() => {
              res.json({ msg: 'Successful login!' });
            })
            .catch(err => next(err));
        }

        else {
          res.status(400).json({
            type: 'error',
            msg: 'Incorrect username or password!'
          });
        }
      }
    )
  });

  router.get('/logout', (req, res, next) => {
    const { session_str } = req.cookies;
    if (!session_str) {
      res.status(400).json({
        type: 'error',
        msg: 'Not logged in!'
      });
    }

    // NOTE: branching conditionals because res.status (above) does not
    // immediately return from the function. You could also return the `res`
    // call on the conditional above, and remove the branching
    else {
      const { username } = Session.parse(session_str);

      pool.query(
        'UPDATE users SET session_id = NULL WHERE username_hash = $1',
        [ hash(username) ],
        (q_err, q_res) => {
          if (q_err) return next(q_err);

          res.clearCookie('session_str');
          res.json({ msg: 'Successful logout!' });
        }
      );
    }
  });

  router.get('/authenticated', (req, res, next) => {
    const { session_str } = req.cookies;

    if (!session_str) {
      return res.json({ authenticated: false });
    }

    const { username, id } = Session.parse(session_str);

    pool.query(
      'SELECT * FROM users WHERE username_hash = $1',
      [ hash(username) ],
      (q_err, q_res) => {
        if (q_err) return next(q_err);
        if(q_res.rows.length === 0) return next(new Error('Not a valid username'));

        res.json({
          authenticated: Session.verify(session_str) && q_res.rows[0].session_id === id
        });
      }
    );
  });

  return router;
}