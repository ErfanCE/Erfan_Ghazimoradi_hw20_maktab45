const path = require('path');
const Blogger = require('../models/blogger-model');


// render profile page
const profile = (request, response, next) => {
    Blogger.findById(request.session.blogger._id, (err, blogger) => {
        if (err) return console.log(err.message);

        response.render(path.join(__dirname, '../', 'views', 'account', 'profile-page.ejs'), { blogger });
    });
};

// update blogger profile
const edit = (request, response, next) => {
    Blogger.findByIdAndUpdate(request.session.blogger._id, request.body, {new: true}, (err, blogger) => {
        if (err) return console.log(err.message);

        // update session
        request.session.blogger = blogger;
        
        return response.send('updated');
    });
};

// delete blogger account
const remove = (request, response, next) => {
    Blogger.findByIdAndDelete(request.session.blogger._id, (err, blogger) => {
        if (err) return console.log(err.message);

        response.clearCookie('user_sid');
        return response.send('deleted');
    });
};


module.exports = { profile, edit, remove };