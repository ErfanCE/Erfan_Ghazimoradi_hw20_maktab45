const express = require('express');
const router = express.Router();
const article = require('../controllers/article-controller');
const articleRoute = require('./article-route');


// blogger profile
router.get('/', article.articles);

router.get('/:articleID', article.articleByTitle);

module.exports = router;