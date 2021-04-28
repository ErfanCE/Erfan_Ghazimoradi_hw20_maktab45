const Blogger = require('../models/blogger-model');
const Article = require('../models/article-model');
const { body, validationResult } = require('express-validator');

const usernameRegex = /^(?=.{1,30}$)(?![.])(?!.*[.]{2})((?=.*[A-Z])|(?=.*[a-z]))[a-zA-Z0-9._]+(?!.*\.$)$/;
const passwordRegex = /^((?=.*\d)|(?=.*\W)|(?=.*_))(?=.*[a-zA-Z]).{8,}$/;
const titleRegex = /^(?=.{1,}$)(?![.])(?!.*[.]{2})((?=.*[A-Z])|(?=.*[a-z]))[a-zA-Z0-9._]+(?!.*\.$)$/;
const phoneRegex = /^(\+98|0)?9\d{9}$/;


// !phonenumber pattern bugs

// signup validation rules
const signup = () => {
    return [
        body('firstname')
            .notEmpty().withMessage('firstname required.')
            .bail()
            .isLength({max: 30}).withMessage('firstname must be maximum length of 30.'),
        body('lastname')
            .notEmpty().withMessage('lastname required.')
            .bail()
            .isLength({max: 30}).withMessage('lastname must be maximum length of 30.'),
        body('username')
            .custom(requestUsername => {
                return Blogger.findOne({username: requestUsername}).then(isDuplicate => {
                    if (isDuplicate) return Promise.reject(`username ${requestUsername} is not available, try again.`);
                });
            })
            .notEmpty().withMessage('username required.')
            .bail()
            .isLength({max: 30}).withMessage('username must be maximum length of 30.')
            .bail()
            .matches(/^(?![.])/).withMessage('username can\'t start with a period.')
            .bail()
            .matches(/^(?!.*[.]{2})/).withMessage('username can\'t have more than one period in a row.')
            .bail()
            .matches(/.*[^.]$/).withMessage('username can\'t end with a period.')
            .bail()
            .matches(/^((?=.*[A-Z])|(?=.*[a-z]))/).withMessage('username must be cotain at least one letter.')
            .bail()
            .matches(/^[a-zA-Z0-9._]+$/).withMessage('username cotain letters, numbers, _ and period.')
            .bail()
            .matches(usernameRegex, 'g').withMessage('invalid username.'),
        body('password')
            .notEmpty().withMessage('password required.')
            .bail()
            .isLength({min: 8}).withMessage('password must be at least 8 characters long.')
            .bail()
            .matches(/((?=.*\d)|(?=.*\W)|(?=.*_))(?=.*[a-zA-Z])/, 'g').withMessage('password must be mix of letter, numbers or special characters.')
            .bail()
            .matches(passwordRegex, 'g').withMessage('wrong password pattern.'),
        body('gender')
            .notEmpty().withMessage('gender required.')
            .bail()
            .isIn(['male', 'female', 'unset']).withMessage('invalid gender.'),
        body('phoneNumber')
            .custom(requestPhoneNumber => {
                return Blogger.findOne({phoneNumber: requestPhoneNumber}).then(isDuplicate => {
                    if (isDuplicate) return Promise.reject(`Another account is using ${requestPhoneNumber}.`);
                });
            })
            .notEmpty().withMessage('phoneNumber required.')
            .bail()
            .matches(phoneRegex, 'g').withMessage('invalid phoneNumber.')
    ];
};

// update blogger validation rules
const update = () => {
    return [
        body('firstname')
            .notEmpty().withMessage('firstname required.')
            .bail()
            .isLength({max: 30}).withMessage('firstname must be maximum length of 30.'),
        body('lastname')
            .notEmpty().withMessage('lastname required.')
            .bail()
            .isLength({max: 30}).withMessage('lastname must be maximum length of 30.'),
        body('username')
            .custom((reqUsername, {req})=> {
                const currentUsername = req.session.blogger.username;

                if (reqUsername !== currentUsername) {
                    return Blogger.find({$and: [{username: reqUsername}, {username: {$ne: currentUsername}}]}).then(result => {
                        if (result.length !== 0) return Promise.reject(`username ${reqUsername} isn\'t available, try another.`);
                    });
                }

                return true;
            })
            .notEmpty().withMessage('username required.')
            .bail()
            .isLength({max: 30}).withMessage('username must be maximum length of 30.')
            .bail()
            .matches(/^(?![.])/).withMessage('username can\'t start with a period.')
            .bail()
            .matches(/^(?!.*[.]{2})/).withMessage('username can\'t have more than one period in a row.')
            .bail()
            .matches(/.*[^.]$/).withMessage('username can\'t end with a period.')
            .bail()
            .matches(/^((?=.*[A-Z])|(?=.*[a-z]))/).withMessage('username must be cotain at least one letter.')
            .bail()
            .matches(/^[a-zA-Z0-9._]+$/).withMessage('username cotain letters, numbers, _ and period.')
            .bail()
            .matches(usernameRegex, 'g').withMessage('invalid username.'),
        body('gender')
            .notEmpty().withMessage('gender required.')
            .bail()
            .isIn(['male', 'female', 'unset']).withMessage('invalid gender.'),
        body('phoneNumber')
            .custom((requestPhoneNumber, {req})=> {
                const currentPhoneNumber = req.session.blogger.phoneNumber;

                if (requestPhoneNumber !== currentPhoneNumber) {
                    return Blogger.find({$and: [{phoneNumber: requestPhoneNumber}, {phoneNumber: {$ne: currentPhoneNumber}}]}).then(result => {
                        if (result.length !== 0) return Promise.reject(`phoneNumber ${requestPhoneNumber} is registerd already, try another.`);
                    });
                }

                return true;
            })
            .notEmpty().withMessage('phoneNumber required.')
            .bail()
            .matches(phoneRegex, 'g').withMessage('invalid phoneNumber.')
    ];
};

// create article validation rules
const testValid = (request) => {
    const reqBody = request.body;

    const errors = [];

    if (!reqBody.title) errors.push('title required.');
    else if (!reqBody.title.match(titleRegex)) errors.push('title invalid format');

    if (!reqBody.description) errors.push('description required.');

    if (!reqBody.content) errors.push('content required.');

    return errors;
};

// update article validation rules
const updateArticle = () => {
    return [
        body('title')
            .custom((reqTitle, { req }) => {
                const currentTitle = req.params.articleTitle;
                
                if (reqTitle !== currentTitle) {
                    return Article.find({$and: [{blogger: req.session.blogger.username}, {title: reqTitle}, {title: {$ne: currentTitle}}]}).then(result => {
                        if (result.length !== 0) return Promise.reject(`The title ${reqTitle} already exists on this account.`);
                    });
                }

                return true;
            })
            .notEmpty().withMessage('title required')
            .bail()
            .matches(/^(?![.])/).withMessage('title can\'t start with a period.')
            .bail()
            .matches(/^(?!.*[.]{2})/).withMessage('title can\'t have more than one period in a row.')
            .bail()
            .matches(/.*[^.]$/).withMessage('title can\'t end with a period.')
            .bail()
            .matches(/^((?=.*[A-Z])|(?=.*[a-z]))/).withMessage('title must be cotain at least one letter.')
            .bail()
            .matches(/^[a-zA-Z0-9._]+$/).withMessage('title cotain letters, numbers, _ and period.')
            .bail()
            .matches(titleRegex, 'g').withMessage('invalid title.'),
        body('description')
            .notEmpty().withMessage('description required'),
        body('content')
            .notEmpty().withMessage('content required')
    ]
};


// signup validator
const validator = (request, response, next) => {
    const errors = validationResult(request);
    const extractedErrors = [];

    if (errors.isEmpty()) return next();

    errors.array().map((err) => extractedErrors.push(err.msg));

    // send error
    request.flash('signup', extractedErrors);
    return response.redirect('/authentication/signup');
};

// update blogger validator
const validator2 = (request, response, next) => {
    const errors = validationResult(request);
    const extractedErrors = [];

    if (errors.isEmpty()) return next();

    errors.array().map((err) => extractedErrors.push(err.msg));

    // send error
    request.flash('update', extractedErrors);
    response.send(extractedErrors);
};

// update article validator
const validator3 = (request, response, next) => {
    const errors = validationResult(request);
    const extractedErrors = [];

    if (errors.isEmpty()) return next();

    errors.array().map((err) => extractedErrors.push(err.msg));

    // send error
    request.flash('update-article', extractedErrors);
    response.send(extractedErrors);
};


module.exports = { signup, update, updateArticle, testValid, validator, validator2, validator3 };