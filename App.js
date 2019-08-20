// npm install mongodb mongoose connect-flash express-messages

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({ debug: process.env.DEBUG })
}

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require("passport");
const flash = require('express-flash');
const session = require('express-session');
const expressLayout = require('express-ejs-layouts');
const app = express();
const Joi = require('joi');
// Joi.objectId = require('joi-objectid')(Joi);

const indexRouter = require('./routes/index');
const detailsRouter = require('./routes/details');
const manageRouter = require('./routes/manage');
const categoryRouter = require('./routes/category');
require('./config/passport')(passport);


app.set('view engine','ejs');
app.set('views', __dirname + '/views');
app.set('layout','layouts/layout');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressLayout);
app.use(express.static("public"));
app.use(express.json());

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Express Messages Middleware
app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//route middleware
app.use('/', indexRouter);
app.use('/', detailsRouter);
app.use('/', manageRouter);
app.use('/category', categoryRouter);

//database
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', ()=> console.log('connected to mongoose'));





const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));