const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const models = require('../models')
const session = require('express-session');
const crypto = require('crypto');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const router = express.Router();
router.use(express.static(__dirname + '/public'));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());
router.use(expressValidator());

router.use(session({
    secret: "secretkey",
    saveUninitialized: true,
    resave: false,
}));

function hashPassword(password){
const secret = 'abcdefg';
const hash = crypto.createHmac('sha256', secret)
    .update(password)
    .digest('hex');
return hash
};


router.get('/', async (request, response) => {

    response.render("login");
});

router.post('/', async (request, response) => {

    request.checkBody('username', 'No Username Provided. ').notEmpty();
    request.checkBody('username', 'Must be less than 100 characters. ').matches(/^.{0,100}$/, "i");
    request.checkBody('password', 'No password was provided.  ').notEmpty();
    request.checkBody('password', "Password must be valid").matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, "i");
    var errors = request.validationErrors();
    if (errors) {
        var model = { errors: errors };
        request.session.isAuthenticated = false;
        response.render('login', model);
    } else {
        var user = await models.users.findOne({
            where: {
                username: request.body.username,
                password: hashPassword(request.body.password)
            }
        })
        if (!user) {
            request.session.isAuthenticated = false;
            response.render("login");

        } else {
            request.session.user_name = request.body.username;
            request.session.password = hashPassword(request.body.password);
            request.session.display = request.body.username;
            request.session.userId = user.id;
            
            console.log(request.session.userId)
            request.session.isAuthenticated = true;
            response.redirect('/home');
        }
    }
});

router.get('/signup', (request, response) => {
    response.render('signup');
});
router.post('/signup', (request, response) => {
    request.checkBody('username', 'No Username Provided. ').notEmpty();
    request.checkBody('username', 'Must be less than 100 characters. ').matches(/^.{0,100}$/, "i");
    request.checkBody('password', 'No password was provided.  ').notEmpty();
    request.checkBody('password', "Password must be valid").matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, "i");
    request.checkBody('confirm', 'No confirmation was provided.  ').notEmpty();
    request.checkBody('confirm', "Confirmation must be valid").matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, "i");
    var errors = request.validationErrors();
    var model = { errors: errors };
    if (errors) {
        response.render('signup', model);
    }
    else {
        var user = {
            username: request.body.username,
            password: hashPassword(request.body.password),
        };
        request.session.user_name = request.body.username;
        request.session.isAuthenticated = true;
        models.users.create(user);
        response.redirect('home');
    }
});

router.get('/home', async (request, response) => {
    if (request.session.isAuthenticated == true) {
        var result = await models.decks.all();
        var display = request.session.user_name;
        request.session.deckId = "";
        var model = { result: result, display: display };
        response.render("home", model);
    } else {
        response.redirect('/');
    }
});
router.post('/home', (request, response) => {
    response.render("home");
});
router.get('/logout', (request, response) => {
    request.session.destroy();
    response.redirect('/');
});

router.get('/new_deck', (request, response) => {
    if (request.session.isAuthenticated == true) {
        response.render("new_deck");
    } else {

        response.redirect('/');
    }
});
router.post('/new_deck', async (request, response) => {
    var deck = {
        userId: request.session.userId,
        name: request.body.deck
    };
    let result = await models.decks.create(deck);

    response.redirect('/home');
});

router.get('/new_card', (request, response) => {
    if (request.session.isAuthenticated == true) {
            response.render("new_card");
    } else {

        response.redirect('/');
    }
});
router.post('/new_card', async (request, response) => {
    
    var card = {
        question: request.body.question,
        answer: request.body.answer,
        author: request.session.user_name,
        deckId: request.session.deckId
    };
    let id = request.session.deckId;
    let result = await models.cards.create(card);

    response.redirect('/home');
});

router.get('/manage_cards/:Id', async (request, response) => {
    if (request.session.isAuthenticated == true) {
        var result = await models.cards.all({ where: { deckId: request.params.id } });
        var display = request.session.user_name;
        var model = { result: result, display: display };
        response.render("manage_cards", model);
    } else {
        response.redirect('/');
    }
});

router.post('/manage_cards', async (request, response) => {
    var card = request.body.cards;
    var result = await models.cards.create(card);
    response.json(result);
});

router.post('/manage_cards/:Id', async (request, response) => {
    console.log("id: ", request.params.Id)
    var result = await models.cards.destroy({ where: { id: request.params.Id } });
    response.redirect('/home');
});
router.get('/:id', async function (request, response) {

        var result = await models.cards.all({ where: { deckId: request.params.id } });
        var display = request.session.user_name;
        request.session.deckId = request.params.id;
        console.log('id', request.session.deckId);
        var model = { result: result, display: display };
        response.render('manage_cards', model);
    });

module.exports = router;