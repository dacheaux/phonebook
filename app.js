const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const hbs = require('hbs');
const expressValidator = require('express-validator');
const mysql = require('mysql');

const form = require('./views/form.hbs');
const search = require('./views/search.hbs');
const table = require('./views/table.hbs');
const indexRouter = require('./routes/index');

const keys = require('./config/keys');
const app = express();
const connection = mysql.createConnection(keys);
console.log(connection, keys)

connection.query(`CREATE DATABASE IF NOT EXISTS ${keys.name}`, err => {
  if (err) throw err;
  connection.query(`USE ${keys.name}`, err => {
    if (err) throw err;
    connection.query(
      `CREATE TABLE IF NOT EXISTS users (
    id int(11) NOT NULL AUTO_INCREMENT,
    firstname varchar(100),
    lastname varchar(100),
    telephone varchar(18),
    PRIMARY KEY (id)
    )`,
      err => {
        if (err) throw err;
      }
    );
  });
});

hbs.registerPartial('form', form);
hbs.registerPartial('search', search);
hbs.registerPartial('table', table);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(expressValidator());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
