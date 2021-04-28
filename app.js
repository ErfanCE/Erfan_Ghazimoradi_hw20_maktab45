const express = require('express');
const app = express();
const dotenv = require('dotenv');
const config = dotenv.config();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const serverPort = process.env.PORT || 8000;
const serverHost = process.env.HOST;
const appRoutes = require('./routes/app-routes');
const admin = require('./controllers/admin-controller');


// dotenv config error handling
if (config.error) console.log(config.error);

// connect MongoDB
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    return app;
}).catch(err => {
    console.error('App starting error:', err);
    process.exit(1);
});

// mongoose connection error handling
mongoose.connection.on('error', (error) => {
    console.log(error);
});

// mongoose connect status
mongoose.connection.once('open', () => {
    console.log('[+] server connected to database successfully.');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// static public
app.use(express.static(path.join(__dirname, 'public')));

// request body parser (extended: true => support nested object)
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// request flash
app.use(flash());

// request cookie parser
app.use(cookieParser());

// express session setup
app.use(session({
    key: 'user_sid',
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 500 * 60 * 60 // expire after 0.5hr
    }
}));

// clear empty cookie
app.use((request, response, next) => {
    // clear cookie if blogger session not exist
    if (request.cookies.user_sid && !request.session.blogger) response.clearCookie('user_sid');

    next();
});

// create blogger admin
admin.createAdmin();

// setup directories 
admin.setupDirectories();

// app routes
app.use('/', appRoutes);

// 404: Page not found
app.use('*', (request, response) => {
    response.render(path.join(__dirname, 'views', 'error', '404-page.ejs'));
});


app.listen(serverPort, (request, response) => {
    console.log(`Server is Running on ${serverHost} :${serverPort} ...`);
});