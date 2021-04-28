const express = require('express');
const router = express.Router();
const authorization = require('../controllers/authorization-controller');
const authenticationRoute = require('./authentication-route');
const accountRoute = require('./account-route');
const articlesRoute = require('./articles-route');


// root: blogger profile
router.get('/', (request, response) => response.redirect('/articles'));

// authentication
router.use('/authentication', authenticationRoute);

// account
router.use('/account', authorization.profile, accountRoute);

// article
router.use('/articles', articlesRoute);


module.exports = router;