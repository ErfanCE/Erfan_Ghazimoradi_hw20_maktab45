const express = require('express');
const router = express.Router();
const accountRoute = require('./account-route');
const exploreRoute = require('./explore-route');
const authorization = require('../controllers/authorization-controller');
const authenticationRoute = require('./authentication-route');


// root: blogger profile
router.get('/', (request, response) => response.redirect('/explore'));

// authentication
router.use('/authentication', authenticationRoute);

// account
router.use('/account', authorization.profile, accountRoute);

// explore
router.use('/explore', exploreRoute);


module.exports = router;