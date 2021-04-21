const express = require('express');
const router = express.Router();
const authentication = require('../controllers/authentication-controller');
const authorization = require('../controllers/authorization-controller');
const validation = require('../controllers/validation-controller');


// signup page
router.get('/signup', authorization.authorized, authentication.signupPage);

// register blogger
router.post('/signup', validation.signup(), validation.validator, authentication.signup);

// login page
router.get('/login', authorization.authorized, authentication.loginPage);

// login blogger
router.post('/login', authentication.login);

// logout blogger
router.get('/logout', authentication.logout);


module.exports = router;