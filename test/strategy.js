var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');
var BnetStrategy = require('../lib/index').Strategy;


describe('Strategy', function() {

  it('should throw an exception if `verify` callback not passed', function() {
    expect(function() {
      new BnetStrategy({clientID: 'thrall', clientSecret: 'lovesjaina'});
    }).to.throw(TypeError);
  });

  it('should throw an exception if `clientID` is not passed', function() {
    expect(function() {
      new BnetStrategy({clientSecret: 'lovesjaina'}, function() {});
    }).to.throw(TypeError);
  });

  it('should throw an exception if `clientSecret` is not passed', function() {
    expect(function() {
      new BnetStrategy({clientID: 'clientID'}, function() {});
    }).to.throw(TypeError);
  });

  describe('User profile', function() {

    var _oauth2Stub;

    var strategy = new BnetStrategy({
      clientID: 'clientID',
      clientSecret: 'clientSecret'
    }, function() {});

    beforeEach(function() {
      _oauth2Stub = sinon.stub(strategy._oauth2, 'get');
    });

    afterEach(function() {
      _oauth2Stub.restore();
    });

    it('should throw an error if error is passed from profile retrieval', function() {
      _oauth2Stub.callsArgWith(2, new Error('An Error'), '', '{}');
      strategy.userProfile('some-token', function(error, profile, res) {
        assert(error);
      });
    });

    it('should parse the JSON body', function() {
      _oauth2Stub.callsArgWith(2, false, '{"user": "thrall"}', '');
      strategy.userProfile('some-token', function(error, profile, res) {
        assert.equal(profile.user, "thrall");
      });
    });

    it('should throw an error if JSON body cannot be parsed', function() {
      _oauth2Stub.callsArgWith(2, false, '{["invalidJson ]}', '');
      strategy.userProfile('some-token', function(error, profile, res) {
        assert(error);
      });
    });

    it('should set the `token` on the returned profile', function() {
      _oauth2Stub.callsArgWith(2, false, '{"user": "thrall"}', '');
      strategy.userProfile('some-token', function(error, profile, res) {
        assert.equal(profile.token, 'some-token');
      });
    });

    it('should set the `provider` on the returned profile', function() {
      _oauth2Stub.callsArgWith(2, false, '{"user": "thrall"}', '');
      strategy.userProfile('some-token', function(error, profile, res) {
        assert.equal(strategy.name, profile.provider);
      });
    });

  });

});
