const express = require('express');
const router = express.Router();
const explore = require('../controllers/explore-controller');


router.get('/', explore.articles);

router.get('/:username/:articleTitle', explore.article);


module.exports = router;