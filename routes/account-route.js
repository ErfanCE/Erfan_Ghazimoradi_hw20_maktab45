const express = require('express');
const router = express.Router();
const account = require('../controllers/account-controller');
const authorization = require('../controllers/authorization-controller');
const validation = require('../controllers/validation-controller');



// blogger profile
router.get('/', authorization.profile, account.profile);

// update profile
router.patch('/', authorization.profile, validation.update(), validation.validator2, account.edit);

// delete account
router.delete('/', authorization.profile, account.remove);


module.exports = router;