const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Article = require('../models/article-model');
const validation = require('../controllers/validation-controller');


// article picture storage
const articlePictureStorage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'images', 'articles'))
    }, 
    filename: (request, file, cb) => {

        if (!request.body.title) cb(null, `${request.session.blogger.username}-${request.params.articleTitle}-${Date.now()}-${file.originalname}`)
        else cb(null, `${request.session.blogger.username}-${request.body.title}-${Date.now()}-${file.originalname}`);
    }
});

// article picture file filter
const articlePictureFileFilter = (request, file, cb) => {
    if (file.mimetype.match(/^image\/(png|jpe?g|webp)$/i)) cb(null, true);
    else cb(new Error('invalid-file-type'), false);
};

// setup article picture upload
const articlePictureUpload = multer({
    storage: articlePictureStorage,
    fileFilter: articlePictureFileFilter,
    limits: {
        file: 1, 
        fileSize: 5 * 1024 * 1024
    }
});


// upload article creation picture
const articlePicture = (request, response, next) => {
    const upload = articlePictureUpload.single('picture');
    const errors = [];

    upload(request, response, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.field === 'picture' && err.code === 'LIMIT_FILE_SIZE') return response.send('limit-size');
            
            console.log('multer error: ' + err.message);
            return response.status(400).send('bad request!');
        } else if (err) {
            if (err.message.includes('invalid-file-type')) return response.send('file-type');

            console.log('elseif error: ' + err.message);

        } else {

            validation.testValid(request).forEach(err => errors.push(err));

            if (!request.file) errors.push('picture required');

            Article.findOne({blogger: request.session.blogger.username, title: request.body.title}, (err, article) => {
                if (err) return console.log('find duplicate title ' + err);

                if (article) errors.push('duplicate title');

                if (errors.length > 0) return response.send(errors);

                new Article({
                    blogger: request.session.blogger.username,
                    title: request.body.title,
                    description: request.body.description,
                    content: request.body.content,
                    picture: request.file.filename
                }).save(err => {
                    if (err) return console.log('save article: ' + err);
            
                    return response.send('create');
                });
            });
        }
    });
};

// change article picture
const changePicture = (request, response, next) => {
    const upload = articlePictureUpload.single('picture');

    upload(request, response, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.field === 'picture' && err.code === 'LIMIT_FILE_SIZE') return response.send('limit-size');
            
            console.log('multer error: ' + err.message);
            return response.status(400).send('bad request!');
        } else if (err) {
            if (err.message.includes('invalid-file-type')) return response.send('file-type');

            console.log('elseif error: ' + err.message);
            return response.status(400).send('bad request!');
        } else {
            if (!request.file) return response.send('not-chosen');

            Article.findOneAndUpdate({blogger: request.session.blogger.username, title: request.params.articleTitle}, {picture: request.file.filename}, (err, article) => {
                if (err) return console.log('update article picture: ' + err.message);

                fs.unlink(path.join(__dirname, '..', 'public', 'images', 'articles', article.picture), err => {
                    if (err) return console.log('unlink article picture');

                    return response.send('changed');
                });
            });
        }
    });
};


module.exports = { articlePicture, changePicture };