const express = require('express');
const passport = require('passport');
const sessions = require('express-session');

const app = express();

// express-session 
app.use(sessions({secret: 'cats'}));
app.use(passport.initialize());
app.use(passport.session());
require('./auth.js');

// function to check weather a user loggedIn or not! 
function isLoggedIn (req, res, next) {
    req.user ? next() : res.sendStatus(401)
}

// requests 
app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authentication With Google</a>')
});

app.get('/protected', isLoggedIn ,(req, res) => {
    res.send(`Hello ${req.user.displayName}`)
});

app.get('/auth/google',
    passport.authenticate('google', {scope:['email', 'profile']})
);

app.get('/google/callback', passport.authenticate('google',{
    successRedirect: '/protected',
    failureRedirect: '/auth/failure'
}));

app.get('/auth/failure', (req, res) => {
    res.send('Something went wrong!')
});


// server port 
app.listen(5000, () => {
    console.log('Server is upto 5000')
})