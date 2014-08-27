/**
 * Module dependencies.
 */
var util = require('util');
var OAuth2Strategy = require('passport-oauth2');
var InternalOAuthError = require('passport-oauth2').InternalOAuthError;
var async = require('async');

function getHost(region) {
  if(region === 'cn') {
    return 'www.battlenet.com.cn';
  } else {
    return region + '.battle.net';
  }
}

function getMasheryHost(region) {
  if(region === 'cn') {
    return 'api.battlenet.com.cn';
  } else {
    return region + '.api.battle.net';
  }
}

/**
 * `Strategy` constructor.
 *
 * The Bnet authentication strategy authenticates requests by delegating to
 * Battle.net using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Bnet application's Client ID
 *   - `clientSecret`  your Bnet application's Client Secret
 *   - `callbackURL`   URL to which Bnet will redirect the user after granting authorization
 *   - `scope`         array of permission scopes to request.
 *
 * Examples:
 *
 *     passport.use(new BnetStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret',
 *         region: 'us',
 *         callbackURL: 'https://www.example.net/auth/bnet/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.region = options.region || 'us';
  options.authorizationURL = options.authorizationURL || 'https://' + getHost(options.region) + '/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://' + getHost(options.region) + '/oauth/token';
  options.scopeSeparator = options.scopeSeparator || ' ';
  options.customHeaders = options.customHeaders || {};

  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-bnet';
  }

  OAuth2Strategy.call(this, options, verify);
  this.name = 'bnet';
  this._idURL = options.idURL || 'https://' + getMasheryHost(options.region) + '/account/user/id';
  this._battleTagURL = options.battleTagURL || 'https://' + getMasheryHost(options.region) + '/account/user/battletag';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from GitHub.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `bnet`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var strategy = this;

  async.parallel({
    id: function(done) {
      strategy.getId(accessToken, done);
    },
    battletag: function(done) {
      strategy.getBattleTag(accessToken, done);
    }}, function(err, profile) {
      profile.provider = 'bnet';
      done(err, profile);
    });
};

Strategy.prototype.getId = function(accessToken, done) {
  this._oauth2.get(this._idURL, accessToken, function (err, body, res) {
    var json;

    if (err) {
      return done(new InternalOAuthError('Failed to fetch the user id', err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
       return done(new Error('Failed to parse the user id'));
    }

    done(null, json.id);
  });
};

Strategy.prototype.getBattleTag = function(accessToken, done) {
  this._oauth2.get(this._battleTagURL, accessToken, function (err, body, res) {
    var json;

    if (err) {
      return done(new InternalOAuthError('Failed to fetch the user id', err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse the user id'));
    }

    done(null, json.battletag);
  });
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
