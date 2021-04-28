const fs = require('fs');
const path = require('path');
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
            avatar: 'default-avatar.png',
            phoneNumber: process.env.ADMIN_PHONE,
            role: 'admin'
        }).save(err => {
            if (err) return console.log(err.message);

            return console.log('[+] Admin created successfully.');
        });
    });
};

// setup directories
const setupDirectories = () => {
    fs.access(path.join(__dirname, '..', 'public', 'images', 'articles'), err => {
        if (err) {
            fs.mkdir(path.join(__dirname, '..', 'public', 'images', 'articles'), err => {
                if (err) return console.log('Create directories ' + err.message);

                return console.log('[+] Directories are created.');
            });
        } else return console.log('[+] directories are setup.');
    })
};


module.exports = { createAdmin, setupDirectories };