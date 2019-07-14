const hash = require('../lib/crypto');

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
    pool.query('SELECT * FROM users WHERE username_hash = $1', [ req.params.id ], (q_err, q_res) => {
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

              res.json({ msg: 'Successfully created user!' });
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
