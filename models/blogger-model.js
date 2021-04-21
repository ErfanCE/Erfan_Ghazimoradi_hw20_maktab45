const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usernameRegex = /^(?=.{1,30}$)(?![.])(?!.*[.]{2})((?=.*[A-Z])|(?=.*[a-z]))[a-zA-Z0-9._]+(?!.*\.$)$/;
const passwordRegex = /^((?=.*\d)|(?=.*\W)|(?=.*_))(?=.*[a-zA-Z]).{8,}$/;
const phoneRegex = /^(\+98|0)?9\d{9}$/;


// primary schema
const primitiveSchema = {
    required: true,
    trim: true
};

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
        trim: true,
        validate(value) {
            if (!value.match(usernameRegex)) throw new Error('invalid username pattern.');
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!value.match(passwordRegex)) throw new Error('invalid password pattern.');
        }
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'unset']
    },
    avatar: {
        type: String
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!value.match(phoneRegex)) throw new Error('invalid phoneNumber pattern.')
        }
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