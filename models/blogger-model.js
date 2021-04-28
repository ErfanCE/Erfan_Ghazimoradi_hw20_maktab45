const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const BloggerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        maxLength: 30,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        maxLength: 30,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'unset']
    },
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['admin', 'blogger'],
        default: 'blogger'
    }
});


// encrypt blogger password
BloggerSchema.pre('save', function(next) {
    const blogger = this;

    // new blogger created or password changed
    if (blogger.isNew || blogger.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            // send error to save 
            if (err) return next(err);

            bcrypt.hash(blogger.password, salt, (err, hash) => {
                if (err) return next(err);

                blogger.password = hash;
                return next();
            });
        });
    } else return next();
});


module.exports = mongoose.model(process.env.BLOGGER_COLLECTION, BloggerSchema);