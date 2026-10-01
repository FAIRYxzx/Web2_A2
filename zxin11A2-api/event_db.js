//Load the .env environment variable configuration file
require('dotenv').config();
const mysql = require('mysql2');

// Create database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true
});

const promisePool = pool.promise();

module.exports = promisePool;
