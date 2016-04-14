var passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
    express = require('express'),
    session = require('express-session'),
    app = express();

passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
 
// producao
//var TWITTER_CONSUMER_KEY = "zaVcAG6LqlamR3DB9mf6eXBHd";
//var TWITTER_CONSUMER_SECRET = "O1QSHNrRwo7dOWccMRihgfuY8JEv23u7HUdigflDxC95icv4U4";

// dev
var TWITTER_CONSUMER_KEY = "9wPf6wLAOu2S6Ew289wgyYBtj";
var TWITTER_CONSUMER_SECRET = "LmVR6WUYKxcEAWqsZu1u94sYcJVtWgc7MKGDhNLPxGvg5FaS7L";
 
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    //producao
    //callbackURL: "http://admin.dolcebistro.com.br/auth/twitter/callback"
    //dev
    callbackURL: "http://127.0.0.1:8080/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    // NOTA: Voce tera, provavelmente, que associar o usuario do Twitter
    //       com um registro do usuario no seu banco de dados.
    var user = profile;
    return done(null, user);
  }
));
 
 
app.get('/', function(req, res){
    res.send('<html><body>Ola mundo<br/><a href="/login">Login</a></body></html>');
  });
 
app.get('/account',
  ensureLoggedIn('/login'),
  function(req, res) {
    res.send('<html><body>Ola '+ req.user.username+'.<br/><a href="/logout">Logout</a></body></html> ');
    console.log(req.user);
  });
   
app.get('/logout',
  function(req, res) {
    req.logout();
    res.redirect('/login');
  });
