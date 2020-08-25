const mysql = require('mysql2')

module.exports = mysql.createConnection('mysql://root:rootroot@localhost/employee_db')