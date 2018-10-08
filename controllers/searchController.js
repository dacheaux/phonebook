const mysql = require('mysql');
const keys = require('../config/keys');

const pool = mysql.createPool({ ...keys, database: `${keys.database}` });

exports.pbSearch = (req, res, next) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `SELECT * FROM users WHERE lastname LIKE '%${req.body.search}%';`,
      (error, results, fields) => {
        req.app.locals.users = JSON.parse(JSON.stringify(results));
        req.app.locals.msg = `(${req.app.locals.users.length}) Search results for term: ${req.body.search}`
        connection.release();
        res.redirect('/');
      }
    );

    if (err) {
      throw err;
    }
  });
};
