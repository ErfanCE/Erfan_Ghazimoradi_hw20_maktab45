// blogger profile page permission
const profile = (request, response, next) => {
    // blogger authorized
    if (request.cookies.user_sid && request.session.blogger) return next();

    return response.redirect('/authentication/login');
};

// login page permission
const authorized = (request, response, next) => {
    // blogger not authorized
    if (!request.session.blogger) return next();

    return response.redirect(`/${request.session.blogger.username}`);
};


module.exports = { profile, authorized };