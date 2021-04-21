const path = require('path');
const Blogger = require('../models/blogger-model');


// render profile page
const profile = (request, response, next) => {
    const activeBlogger = request.session.blogger;

    Blogger.findById(activeBlogger._id, (err, blogger) => {
        if (err) return console.log(err.message);

        response.render(path.join(__dirname, '../', 'views', 'account', 'profile.ejs'), { blogger });
    });
};

const edit = (request, response, next) => {
    const activeBlogger = request.session.blogger;
    
    Blogger.findByIdAndUpdate(activeBlogger._id, request.body, (err, blogger) => {
        if (err) return console.log(err.message);

        response.send('updated')
    });
};

const remove = (request, response, next) => {
    const activeBlogger = request.session.blogger;
    
    Blogger.findByIdAndDelete(activeBlogger._id, (err, blogger) => {
        if (err) return console.log(err.message);

        response.clearCookie('user_sid');
        response.send('deleted');
    });
};

module.exports = { profile, edit, remove };