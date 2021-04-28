const express = require('express');
const router = express.Router();
const article = require('../controllers/article-controller');
const articlePicture = require('../controllers/article-picture-controller');
const validation = require('../controllers/validation-controller');


// blogger article page
router.get('/', article.articleDashboard);

// article detail
router.get('/:articleTitle', article.articleByTitle);

// create article
router.post('/', articlePicture.articlePicture);

// update article
router.patch('/:articleTitle', validation.updateArticle(), validation.validator3, article.articleEdit);

// remove article
router.delete('/:articleTitle', article.articleRemove);

// change article picture
router.put('/:articleTitle', articlePicture.changePicture);


module.exports = router;