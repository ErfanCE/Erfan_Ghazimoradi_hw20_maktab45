const express = require('express');
const Router = express.Router();
const userRoute = require('./userRoute');


// root
Router.get('/', (request, response) => response.send('Root'));

// user route
Router.use('/user', userRoute);


module.exports = Router;