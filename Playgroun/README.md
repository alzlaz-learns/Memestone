setup for backend

cd backend

node install

setup for frontend

cd frontend

cd node install

startup
# for now
in two seperate terminals

cd backend

on first run in server.js comment out
db.sequelize.sync();

then uncomment db.sequelize.sync(force:true);
to create all necessary tables

node server.js

quit session then

node server.js

cd frontend

npm start


links used for setup

file upload
https://www.bezkoder.com/node-js-express-file-upload/