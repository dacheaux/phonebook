const mysql = require('mysql');
const keys = require('../config/keys');

const pool = mysql.createPool({ ...keys, database: 'phonebook' });

exports.pbSearch = (req, res, next) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `SELECT * FROM users WHERE lastname LIKE '%${req.body.search}%';`,
      (error, results, fields) => {
        req.app.locals.users = JSON.parse(JSON.stringify(results));
        connection.release();
        res.redirect('/');
      }
    );

    if (err) {
      throw err;
    }
  });
};
