const express = require('express');
const {engine} = require('express-handlebars');

const body_parser = require('body-parser');

const path = require('path');

var User = require('./models/registerUser');

//need to add stuff
//test db connection
const db = require("./config/databaseConf");
const { appendFile } = require('fs');
const { setServers } = require('dns');
const { userInfo } = require('os');
db.authenticate()
    .then(() => console.log("DB connection successful"))
    .catch(error => console.log(`DB connection error: ${error}`));


//server setup
const server = express();


//handlebars
server.engine('handlebars', engine());
server.set('view engine', 'handlebars');
server.set('views', './views');


//body parser
server.use(body_parser.urlencoded({extended:false}));

//set static
// server.use(express.static(path.join(__dirname, 'public')));

//routes
// server.get('/', (req, res) => res.render('register', {layout: 'lander'}));

//on arrival redirects to login page
server.get('/', (req, res) => res.redirect('/login'));

//route for user registration
server.route('/register').get((req, res)=>{
    res.render('register',{layout:'lander'});
}).post((req, res) => {
    User.create({
        user_name: req.body.user_name,
        user_pass: req.body.user_pass,
        user_email: req.body.user_email

    }).then(user  => {
        //test logging
        console.log('new user: %s \n password: %s \n email: %s \n', req.body.user_name, req.body.user_pass, req.body.user_email);
        //todo add information for session for token
        res.redirect('/login');
    }).catch(error =>{
        res.redirect('/register')
        console.log(`failure: ${error}`);
    });
   
});


//route for user login
server.route('/login')
.get((req, res)=>{
    res.render('login',{layout:'lander'});
}).post((req, res)=>{
    var userName = req.body.user_name;
    var userPass = req.body.user_pass;

    User.findOne({where: {user_name: userName} 
    }).then(function (user){
        if(!user){//check if user exists
            //login if user doesnt exist redirect to login page
            console.log(`hey scrub lord ${user} aint a real name... just like your hopes and dreams`);
            res.redirect('/login');
        }else if (!user.checkPass(userPass)){ //function in ./model/registerUser.js user to check if password exist in database
            //login if password doesnt exist redirect to login 
            console.log(`wow! the most legit password one that doesnt exist ${userPass}`);
            res.redirect('/login');
        }else{//success
            console.log('rainbow shits success!');
        }
    });
});




const PORT = process.env.PORT || 8080;
server.listen(PORT, console.log(`server listening on port ${PORT}`));