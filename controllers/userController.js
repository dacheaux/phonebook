const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const mysql = require('mysql');

const keys = require('../config/keys');

const pool = mysql.createPool({...keys, multipleStatements: true});
let users = [];

exports.pbGet = [
  (req, res, next) => {
    pool.getConnection((err, connection) => {
      console.log('\nConnected to the MySQL server.');
      connection.query(`SELECT * FROM users`, (error, results, fields) => {
        console.log(error);
        users = JSON.parse(JSON.stringify(results));
        connection.release();
        res.render('index', { title: 'Phone Book', users });
      });

      if (err) {
        throw err;
      }
    });
  }
];

exports.addNew = [
  body('firstname')
    .isLength({ min: 1 })
    .trim()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('lastname')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Last name must be specified.')
    .isAlphanumeric()
    .withMessage('Last name has non-alphanumeric characters.'),
  body('telephone').isMobilePhone('any'),
  sanitizeBody('firstname')
    .trim()
    .escape(),
  sanitizeBody('lastname')
    .trim()
    .escape(),
  sanitizeBody('telephone')
    .trim()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect('/');
      return;
    } else {
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
    }
  }
];

exports.delete = (req, res, next) => {
  console.log('delete');
  pool.getConnection((err, connection) => {
    console.log('Connected to the MySQL server.');
    connection.query(
      `DELETE FROM users WHERE id = '${req.params.id}';
       SET @num := 0;
       UPDATE users SET id = @num := (@num+1);
       ALTER TABLE users AUTO_INCREMENT = 1;`,
      (error, results, fields) => {
        console.log(error);
        connection.release();
        res.redirect('/');
      }
    );

    if (err) {
      throw err;
    }
  });
};
