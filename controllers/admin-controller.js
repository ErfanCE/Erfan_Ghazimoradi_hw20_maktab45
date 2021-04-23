const Blogger = require('../models/blogger-model');


// create blogger admin 
const createAdmin = () => {
    Blogger.findOne({role: 'admin'}, (err, admin) => {
        if (err) return console.log(err.message);

        // check for admin
        if (admin) return console.log('[+] Admin already created.');

        new Blogger({
            firstname: 'Erfan',
            lastname: 'Ghazimoradi',
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD,
            gender: 'male',
            phoneNumber: process.env.ADMIN_PHONE,
            role: 'admin'
        }).save(err => {
            if (err) return console.log(err.message);

            return console.log('[+] Admin created successfully.');
        });
    });
};


module.exports = { createAdmin };