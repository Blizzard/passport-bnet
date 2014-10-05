var express = require('express');
var passport = require('passport');
var util = require('util');

var cookieParser = require('cookie-parser');
var session = require('express-session');

var BnetStrategy = require('passport-bnet').Strategy;
var GitHubStrategy = require('passport-github').Strategy;

var GITHUB_ID = process.env.GITHUB_ID;
var GITHUB_SECRET = process.env.GITHUB_SECRET;
var BNET_ID = process.env.BNET_ID;
var BNET_SECRET = process.env.BNET_SECRET;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Use the GitHubStrategy within Passport.
passport.use(
  new GitHubStrategy(
    { clientID: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      callbackURL: "https://local.test.battle.net/auth/github/callback" },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    })
);

// Use the BnetStrategy within Passport.
passport.use(
  new BnetStrategy(
    { clientID: BNET_ID,
      clientSecret: BNET_SECRET,
      scope: "wow.profile sc2.profile",
      callbackURL: "https://local.test.battle.net/auth/bnet/callback" },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    })
);

var app = express();

// configure Express
app.use(cookieParser());
app.use(session({ secret: 'blizzard',
                  saveUninitialized: true,
                  resave: true }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/' }),
        function(req, res){
          res.redirect('/');
        });

app.get('/auth/bnet',
        passport.authenticate('bnet'));

app.get('/auth/bnet/callback',
        passport.authenticate('bnet', { failureRedirect: '/' }),
        function(req, res){
          res.redirect('/');
        });

app.get('/', function(req, res) {
  if(req.isAuthenticated()) {
    var output = '<h1>Express OAuth Test</h1>' + req.user.id + '<br>';
    if(req.user.battletag) {
      output += req.user.battletag + '<br>';
      output += '<h3>World of Warcraft</h3>';
      for (key in req.user.wowcharacters) {
        char = req.user.wowcharacters[key];
        output += char.name +' ('+char.level+') '+char.guild+'@'+char.realm+'<br>';
      }
      output += '<h3>StarCraft2</h3>';
      for (key in req.user.sc2profile) {
        char = req.user.sc2profile[key];
        output += '<img src="'+char.avatar.url+'">'+char.displayName+'<br>';
      }
    }
    output += '<a href="/logout">Logout</a>';
    res.send(output);
  } else {
    res.send('<h1>Express OAuth Test</h1>' +
             '<a href="/auth/github">Login with Github</a><br>' +
             '<a href="/auth/bnet">Login with Bnet</a>');
  }
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
