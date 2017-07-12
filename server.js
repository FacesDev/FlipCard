const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const models = require('./models')
const session = require('express-session');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const usersController = require('./controllers/users-controller');
const cardsController = require('./controllers/cards-controller');
const application = express();

application.engine('mustache', mustache());
application.set('views', './views');
application.set('view engine', 'mustache');
application.use(express.static(__dirname + '/public'));
application.use(bodyParser.urlencoded({ extended: true }));
application.use(bodyParser.json());
application.use(cookieParser());
application.use(expressValidator());
application.use(session({
    secret: "secretkey",
    saveUninitialized: true,
    resave: false,
}));
application.use(usersController);

module.exports = application;
application.listen(3000);