const express = require('express');
const app = express();
const dotenv = require('dotenv');
const config = dotenv.config();
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const appRoutes = require('./routes/appRoutes');
const serverPort = process.env.PORT || 8000;
const serverHost = process.env.HOST;


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
    console.error('App starting error:', err.stack);
    process.exit(1);
});

// mongoose connection error handling
mongoose.connection.on('error', (error) => {
    console.log(error);
});

// mongoose connect status
mongoose.connection.once('open', () => {
    console.log('[+] Server Connected to Database Successfully.');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// request body parser (extended: true => support nested object)
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// request cookie parser
app.use(cookieParser());

// express session setup
app.use(session({
    key: 'user_sid',
    secret: 'sessionID',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 // expire after 1hr
    }
}));

// static public
app.use(express.static(path.join(__dirname, 'public')));


// clear empty cookie
app.use((request, response, next) => {
    // clear cookie if user session not exist
    if (request.cookies.user_sid && !request.session.user) response.clearCookie('user_sid');

    next();
});

// app routes
app.use('/', appRoutes);

// 404: Page not found
app.use('*', (request, response) => {
    response.render(path.join(__dirname, 'views', 'error', '404Page.ejs'));
});


app.listen(serverPort, (request, response) => {
    console.log(`Server is Running on ${serverHost}:${serverPort} ...`);
});