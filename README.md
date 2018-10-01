# Passport Bnet

[![NPM
version](https://badge.fury.io/js/passport-bnet.svg)](http://badge.fury.io/js/passport-bnet)

This is an Node.js Passport strategy for authenticating to Blizzard's Battle.net OAuth
service. In order to use it you need to register an application at the
[Battle.net Developer Portal](https://develop.battle.net/)

## Installation

    $ npm install passport-bnet

## Usage

### Configure
```js
var BnetStrategy = require('passport-bnet').Strategy;
var BNET_ID = process.env.BNET_ID
var BNET_SECRET = process.env.BNET_SECRET

// Use the BnetStrategy within Passport.
passport.use(new BnetStrategy({
    clientID: BNET_ID,
    clientSecret: BNET_SECRET,
    callbackURL: "https://localhost:3000/auth/bnet/callback",
    region: "us"
}, function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));
```

### Authenticate Requests

```js
app.get('/auth/bnet',
    passport.authenticate('bnet'));

app.get('/auth/bnet/callback',
    passport.authenticate('bnet', { failureRedirect: '/' }),
    function(req, res){
        res.redirect('/');
    });
```

## License

[The MIT License](http://opensource.org/licenses/MIT)
