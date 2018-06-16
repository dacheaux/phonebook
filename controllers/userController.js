const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const mysql = require('mysql');

const keys = require('../config/keys');

const pool = mysql.createPool({ ...keys, database: 'phonebook', multipleStatements: true });
let users = [],
  msg = '';

exports.pbGet = (req, res, next) => {
  if (req.app.locals.users) {
    users = req.app.locals.users;
    users = users.map(u => ({ ...u, link: `delete/${u.id}` }));
    res.render('index', { users });
    req.app.locals.users = null;
    req.app.locals.msg = '';
    return;
  }
  pool.getConnection((err, connection) => {
    connection.query(`SELECT * FROM users`, (error, results, fields) => {
      users = JSON.parse(JSON.stringify(results));
      users = users.map(u => ({ ...u, link: `delete/${u.id}` }));
      msg = req.app.locals.msg ? `Error: ${req.app.locals.msg}` : '';
      req.app.locals.msg = '';
      connection.release();
      res.render('index', { users, msg });
    });

    if (err) {
      throw err;
    }
  });
};

exports.pbAdd = [
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
  body('telephone')
    .isMobilePhone('any')
    .withMessage('Enter valid telephone number.'),
  sanitizeBody('firstname')
    .trim()
    .escape(),
  sanitizeBody('lastname')
    .trim()
    .escape(),
  sanitizeBody('telephone')
    .trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.app.locals.msg = errors.array()[0].msg;
      res.redirect('/');
      return;
    } else {
      const { firstname, lastname, telephone } = req.body;
      pool.getConnection((err, connection) => {
        connection.query(
          `INSERT INTO users (firstname, lastname, telephone)
           VALUES ('${firstname}', '${lastname}', '${telephone}');`,
          (error, results, fields) => {
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

exports.pbDelete = (req, res, next) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `DELETE FROM users WHERE id = '${req.params.id}';
       SET @num := 0;
       UPDATE users SET id = @num := (@num+1);
       ALTER TABLE users AUTO_INCREMENT = 1;`,
      (error, results, fields) => {
        connection.release();
        res.redirect('/');
      }
    );

    if (err) {
      throw err;
    }
  });
};
