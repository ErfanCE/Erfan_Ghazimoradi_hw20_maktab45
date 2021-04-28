const express = require('express');
const router = express.Router();
const article = require('../controllers/article-controller');
const articlePicture = require('../controllers/article-picture-controller');
const validation = require('../controllers/validation-controller');

// public: articles sort by creation date
router.get('/articles', article.articles);


// render blogger article page
router.get('/', article.articleDashboard);

// create article
router.post('/', articlePicture.articlePicture);


// read more
router.get('/:articleTitle', article.articleByTitle);

// update article
router.patch('/:articleTitle', validation.updateArticle(), validation.validator3, article.articleEdit);

// change article picture
router.put('/:articleTitle', articlePicture.changePicture);

// remove article
router.delete('/:articleTitle', article.articleRemove);


module.exports = router;