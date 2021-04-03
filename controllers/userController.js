const User = require('../models/userModel');


const userControll = (request, response) => {
    User.find({}, (error, users) => {
        // error handling
        if (error) return response.status(500).json({
            message: error.message,
            client: 'internal server error'
        });

        return response.status(200).send(users);
    });
};


module.exports = userControll;