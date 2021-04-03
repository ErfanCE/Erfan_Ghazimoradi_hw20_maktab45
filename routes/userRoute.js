const express = require('express');
const router = express.Router();
const userControll = require('../controllers/userController');


// main
router.get('/', userControll);

// users
router.get('/users', userControll);


module.exports = router;