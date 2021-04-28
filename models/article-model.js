const mongoose = require('mongoose');


const ArticleSchema = new mongoose.Schema({
    blogger: {
        ref: 'bloggers',
        type: String,
        required: true,
    },
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        maxLength: 2147483647,
    },
    picture: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model(process.env.ARTICLE_COLLECTION, ArticleSchema);