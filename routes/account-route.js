const express = require('express');
const router = express.Router();
const account = require('../controllers/account-controller');
const authorization = require('../controllers/authorization-controller');
const validation = require('../controllers/validation-controller');
const avatar = require('../controllers/multer-controller');


// blogger profile
router.get('/', account.profile);

// update profile
router.patch('/', authorization.profile, validation.update(), validation.validator2, account.edit);

// delete account
router.delete('/', account.remove);

// change avatar for blogger
router.put('/avatar', avatar.avatar);

router.delete('/avatar', avatar.removeAvatar);


module.exports = router;