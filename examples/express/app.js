/* ====
    [Packages] - Packages required.
==== */

const express = require('express');
const passport = require('passport');
const util = require('util');

const cookieParser = require('cookie-parser');
const session = require('express-session');

/* ====
    [Packages] - Require our passport packages.
==== */

const BnetStrategy = require('passport-bnet').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

/* ====
    [Vars] - SECRET(s) / ID(s) for our strategies. 
      GITUHB_? -> for our Github strategy.
      BNET_? -> for our BNET strategy.
==== */

const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;
const BNET_ID = process.env.BNET_ID;
const BNET_SECRET = process.env.BNET_SECRET;

/* ====
    [Express] - Setup our express server.
==== */

const app = express();

/* ====
    [Passport] - Serialize / Deserialize our user when requests are made.
==== */

passport.serializeUser( function(user, done) { done(null, user);  });
passport.deserializeUser( function(obj, done) { done(null, obj); } );

/* ====
    [Github-Strategy] - Use the `GitHubStrategy` within the passport.
==== */

passport.use(
  new GitHubStrategy(
    { clientID: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      callbackURL: "https://localhost/auth/github/callback" },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    })
);

/* ====
    [BNET-Strategy] - Use the `BnetStrategy` within the passport.
==== */

passport.use(
  new BnetStrategy(
    { clientID: BNET_ID,
      clientSecret: BNET_SECRET,
      scope: "wow.profile sc2.profile",
      callbackURL: "https://localhost/auth/bnet/callback" },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    })
);

/* ====
    [Express] - Init and configure express.
    [Passport] - Init passport. Use -> passport.session() middleware, to support persistent login sessions (recommended).
==== */

app.use(cookieParser());
app.use(session({ secret: 'blizzard', saveUninitialized: true, resave: true }));

app.use(passport.initialize());
app.use(passport.session());

/* ====
    [Express] - Setup our routes for our strategies.
==== */

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), function(req, res){ res.redirect('/'); });

app.get('/auth/bnet', passport.authenticate('bnet'));
app.get('/auth/bnet/callback', passport.authenticate('bnet', { failureRedirect: '/' }), function(req, res){ res.redirect('/'); });

/* ====
    [Express] - Setup our 'logged in successfully' / 'need to log in' route.
      req.isAuthenticated() -> Indicator.
==== */

app.get('/', function(req, res) {
  if (req.isAuthenticated()) {
    var output = '<h1>Express OAuth Test</h1>' + req.user.id + '<br>';
      if (req.user.battletag) {
        output += req.user.battletag + '<br>';
      }
    output += '<a href="/logout">Logout</a>';
    res.send(output);
  } else {
    res.send('<h1>Express OAuth Test</h1>' + '<a href="/auth/github">Login with Github</a><br>' + '<a href="/auth/bnet">Login with Bnet</a>');
  }
});

/* ====
    [Express] - Setup our 'logout' route.
      req.isAuthenticated() -> Indicator if our user logged in or not.
==== */

app.get('/logout', function(req, res) {
  if (req.isAuthenticated()) {
    req.logout();
    res.redirect('/');
  } else {
    res.redirect('/');
});

/* ====
    [Express] - 'Start' our server.
==== */

const server = app.listen(3000, function() { console.log('[Blizzard-OAuth] Listening on port %d', server.address().port); });

/* ====
    [DONE] - DONE.
==== */
