# Passport Bnet

[![Passport Bnet](https://github.com/FreedomFaighter/passport-bnet/actions/workflows/build.yml/badge.svg)](https://github.com/FreedomFaighter/passport-bnet/actions/workflows/build.yml)


This is an Node.js Passport strategy for authenticating to Blizzard's Battle.net OAuth
service. In order to use it you need to register an application at the
[Battle.net Developer Portal](https://develop.battle.net/)

## Installation

    $ npm install passport-bnet

## Usage

### Configure
```js
const BnetStrategy = require('passport-bnet').Strategy;
const BNET_ID = process.env.BNET_ID;
const BNET_SECRET = process.env.BNET_SECRET;

// Use the BnetStrategy within Passport.
passport.use(new BnetStrategy({
    clientID: BNET_ID,
    clientSecret: BNET_SECRET,
    callbackURL: "https://localhost:3000/oauth/battlenet/callback",
    region: "us"
}, function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));
```

### Authenticate Requests

```js
app.get('/oauth/battlenet',
    passport.authenticate('bnet'));

app.get('/oauth/battlenet/callback',
    passport.authenticate('bnet', { failureRedirect: '/' }),
    function(req, res){
        res.redirect('/');
    });
```

## License

[The MIT License](http://opensource.org/licenses/MIT)
