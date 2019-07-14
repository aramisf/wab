module.exports = function(router, pool) {
  router.get('/all', (req, res, next) => {
    pool.query('SELECT * FROM users', (q_err, q_res) => {
      if (q_err) return next(q_err);

      res.json(q_res.rows);
    });
  });

  router.get('/:id', (req, res, next) => {
    console.log('REQ:', req.params, req.query)
    // try to inject some SQL
    //pool.query(`SELECT * FROM users WHERE username_hash = ${req.params.id}`, (q_err, q_res) => {
    pool.query('SELECT * FROM users WHERE username_hash = $1', [ req.params.id ], (q_err, q_res) => {
      if (q_err) return next(q_err);

      res.json(q_res.rows);
    });
  });

  return router;
}
