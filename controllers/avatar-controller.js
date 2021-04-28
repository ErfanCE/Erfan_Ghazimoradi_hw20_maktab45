const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Blogger = require('../models/blogger-model');

const defaultAvatar = 'default-avatar.png';


// avatar storage
const avatarStorage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'images', 'avatars'));
    },
    filename: (request, file, cb) => {
        cb(null, `${request.session.blogger.username}-${Date.now()}-${file.originalname}`);
    }
});

// avatar file filter
const avatarFileFilter = (request, file, cb) => {
    if (file.mimetype.match(/^image\/(png|jpe?g|gif|webp)$/i)) cb(null, true);
    else cb(new Error('invalid-file-type'), false);
};

// setup avater upload
const avatarUpload = multer({
    storage: avatarStorage,
    fileFilter: avatarFileFilter,
    limits: {
        files: 1,
        fileSize: 1 * 1024 * 1024
    }
});

// upload changed avatar
const avatar = (request, response, next) => {
    const upload = avatarUpload.single('avatar');

    upload(request, response, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.field === 'avatar' && err.code === 'LIMIT_FILE_SIZE') return response.send('limit-size');
            
            console.log('multer error: ' + err.message);
            return response.status(400).send('bad request!');
        } else if (err) {
            if (err.message.includes('invalid-file-type')) return response.send('file-type');

            console.log('elseif error: ' + err.message);

        } else changeAvatar(request, response, next);
    });
};

// update avatar
const changeAvatar = (request, response, next) => {
    // if empty file send
    if (!request.file) return response.send('not-chosen');

    Blogger.findByIdAndUpdate(request.session.blogger._id, {avatar: request.file.filename}, {new: true}, (err, blogger) => {
        if (err) return console.log('update avatar: ' + err.message);

        // remove previous avatar and update profile avatar 
        if (request.session.blogger.avatar !== defaultAvatar) {
            fs.unlink(path.join(__dirname, '..', 'public', 'images', 'avatars', request.session.blogger.avatar), err => {
                if (err) return console.log('unlink avatar(update): ' + err.message);

                // update session 
                request.session.blogger = blogger;

                return response.send('avatar-change');
            });
        } else {
            request.session.blogger = blogger;

            return response.send('avatar-change');
        }
    });
};

// remove avatar
const removeAvatar = (request, response, next) => {
    if (request.session.blogger.avatar === defaultAvatar) return response.send('avatar-default')

    Blogger.findByIdAndUpdate(request.session.blogger._id, {avatar: defaultAvatar}, {new: true}, (err, blogger) => {
        if (err) return console.log('remove avatar: ' + err.message);
        
        fs.unlink(path.join(__dirname, '..', 'public', 'images', 'avatars', request.session.blogger.avatar), err => {
            if (err) return console.log('unlink avatar(remove) ' + err.message);

            request.session.blogger = blogger;

            return response.send('avatar-remove');
        });
    }); 
};


module.exports = { avatar, removeAvatar };