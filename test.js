const mysql = require('mysql');

const keys = require('./config/keys');

/*const connection = mysql.createConnection(keys);*/

/*connection.connect((err) => {
  if (err) {
    return console.error('error: ' + err.message);
  }
 
  console.log('Connected to the MySQL server.');
});*/

const pool = mysql.createPool(keys);
