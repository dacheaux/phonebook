const { validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const mysql = require('mysql');

const keys = require('../config/keys');

const pool = mysql.createPool(keys);
let users = [];

exports.pbGet = function(req, res, next) {
  pool.getConnection((err, connection) => {
    console.log('\nConnected to the MySQL server.');
    connection.query(
      `SELECT * FROM users`,
      (error, results, fields) => {
        console.log(error);
        console.log('\nr e s u l t s ', results);
        users = JSON.parse(JSON.stringify(results));
        console.log('J S O N ', JSON.stringify(results));
        connection.release();
        res.render('index', { title: 'Phone Book', users });
      }
    );

    if (err) {
      throw err;
    }
  });
};

exports.addNew = function(req, res, next) {
  const { firstname, lastname, telephone } = req.body;
  pool.getConnection((err, connection) => {
    console.log('Connected to the MySQL server.');
    connection.query(
      `INSERT INTO users (first_name, last_name, telephone_number)
       VALUES ('${firstname}', '${lastname}', '${telephone}');`,
      (error, results, fields) => {
        console.log(error);
        console.log(results);
        connection.release();
        res.redirect('/');
      }
    );

    if (err) {
      throw err;
    }
  });
};

exports.delete = (req, res, next) => {
  console.log('delete');
  pool.getConnection((err, connection) => {
    console.log('Connected to the MySQL server.');
    connection.query(
      `DELETE FROM users
       WHERE id = '${req.params.id}'`,
      (error, results, fields) => {
        console.log(error);
        console.log(results);
        connection.release();
        res.redirect('/');
      }
    );

    if (err) {
      throw err;
    }
  });
}
