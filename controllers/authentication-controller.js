const path = require('path');
const bcrypt = require('bcrypt');
const Blogger = require('../models/blogger-model');


// render signup page
const signupPage = (request, response, next) => {
    response.render(path.join(__dirname, '../', 'views', 'authentication', 'signup-page.ejs'), {
        signupResult: request.flash('signup'),
        status: 'signup'
    });
};

// signup blogger
const signup = (request, response, next) => {
    new Blogger({
        firstname: request.body.firstname.trim(),
        lastname: request.body.lastname.trim(),
        username: request.body.username.trim(),
        password: request.body.password,
        gender: request.body.gender,
        phoneNumber: request.body.phoneNumber.trim(),
    }).save((err, blogger) => {
        if (err) return console.log(err);

        console.log(blogger.username + ' registered.');
        response.redirect('/authentication/login');
    });
};

// render login page
const loginPage = (request, response, next) => {
    response.render(path.join(__dirname, '../', 'views', 'authentication', 'login-page.ejs'), {
        message: request.flash('info'),
        status: 'login'
    });
};

// login blogger
const login = (request, response, next) => {
    Blogger.findOne({username: request.body.username}, (err, blogger) => {
        if (err) return console.log(err);

        // check username
        if (!blogger) {
            request.flash('info', 'The username you entered doesn\'t belong to an account.');
            return response.redirect('/authentication/login');
        }

        // check password
        bcrypt.compare(request.body.password, blogger.password, (err, isMatch) => {
            if (err) return console.log(err.message);

            // username password not match
            if (!isMatch) {
                // front error message
                request.flash('info', 'username and password doesn\'t match!');

                return response.redirect('/authentication/login');
            }

            // blogger info session
            request.session.blogger = blogger;

            return response.redirect('/account');
        });
    });
};

// logout blogger
const logout = (request, response, next) => {
    response.clearCookie('user_sid');
    response.redirect('/');
};


module.exports = { signupPage, signup, loginPage, login, logout };