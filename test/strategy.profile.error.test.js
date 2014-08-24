var BnetStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function() {
    
  var strategy = new BnetStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    },
    function() {});
    
  // mock
  strategy._oauth2.get = function(url, accessToken, callback) {
    if (accessToken !== 'accessToken') { return callback(new Error('incorrect accessToken')); }

    callback(null, 'Icorrect format');
  }

  describe('loading profile with bad accessToken', function() {
    var profile, err;
    
    before(function(done) {
      strategy.userProfile('incorrectToken', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should parse profile', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.name).to.equal('InternalOAuthError');
      expect(err.message).to.equal('Failed to fetch the user id');
      expect(err.oauthError.message).to.equal('incorrect accessToken');
    });

  });

  describe('loading profile with bad response', function() {
    var profile, err;
    
    before(function(done) {
      strategy.userProfile('accessToken', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should parse profile', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('Failed to parse the user id');
    });

  });
});