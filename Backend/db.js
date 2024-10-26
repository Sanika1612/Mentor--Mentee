require('dotenv').config({ path: './.env' });

const mysql = require('mysql2');

// console.log('DB Host:', process.env.DB_HOST);
// console.log('DB User:', process.env.DB_USER);
// console.log('DB Password:', process.env.DB_PASSWORD);
// console.log('DB Name:', process.env.DB_NAME);
// console.log("HEllo",process.env.TEST);
// console.log("THis is env", process.env);
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'Project',
    password: 'Sanika@123',
    database: 'mentorwave',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

module.exports = connection;
