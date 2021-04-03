const mongoose = require('mongoose');

// collection name (lowercase & plural)
const collectionName = process.env.USER_COLLECTION;

// primary schema
const primitiveSchema = {
    required: true,
    lowercase: true,
    trim: true
};

const UserSchema = new mongoose.Schema({
    userProp: {
        ...primitiveSchema,
        type: String,
        unique: [true, 'userProp-duplicate'],
        minLength: [2, 'userProp-length'],
        validate(value) {
            // dont start with number
            if (!isNaN(value[0])) throw new Error('userProp-type');
        }
    }
});


module.exports = mongoose.model(collectionName, UserSchema);