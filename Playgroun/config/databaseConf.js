const Sequelize = require('sequelize');

// // for local developement and testing
const HOST     = 'localhost';
const DATABASE = 'local_test';

// // for deployment
/*
const HOST     = '192.168.124.2'
const DATABASE = 'memestone'
*/
module.exports = new Sequelize(DATABASE, 'user1', 'password1', {
    host: HOST,
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    
    "define": {
        "timestamps": false
    }
});
