const mysql = require('mysql');

// Create connection
const dbConfig = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'uc_commerce',
});

// Connect
dbConfig.connect((error) => {
    if (error) {
        throw error;
    }

    console.log("Database connected.")
});

module.exports = dbConfig;