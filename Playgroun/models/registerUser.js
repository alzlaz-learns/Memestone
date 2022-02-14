const Sequelize = require('sequelize');
const db = require('../config/databaseConf');
var bcrypt = require('bcrypt');

const regUsers = db.define('users', {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    },
    user_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_pass: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_email: {
        type: Sequelize.STRING,
        allowNull: false
    }

});

regUsers.prototype.checkPass = function(password) {

    return bcrypt.compareSync(password, this.password);
    // if (password == this.user_pass){
    //     console.log('passwords match!')
    //     return true;
    // }
    // console.log('passwords match fail')
    // return false;
};

regUsers.beforeCreate((user, options) => {
    console.log(`${options}`);
    
	const salt = bcrypt.genSaltSync();
    // console.log(`${salt}`);
    // console.log(`${user.user_pass}`);
	user.user_pass = bcrypt.hashSync(user.user_pass, salt);
});



regUsers.sync()
    .then(() => console.log("users table synchronized"))
    .catch(error => {
        console.log(error);
    });



module.exports = regUsers;