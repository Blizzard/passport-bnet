var BnetStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function() {
    
  var strategy = new BnetStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    },
    function() {});
    
  // mock
  strategy._oauth2.get = function(url, accessToken, callback) {
    if (accessToken != 'accessToken') { return callback(new Error('incorrect token argument')); }

    if (url === strategy._idURL) {
      var response = JSON.stringify({ id: 123456 });
      return callback(null, response);
    } else if (url === strategy._battleTagURL) {
      var response = JSON.stringify({ battletag: 'Player#1234' });
      return callback(null, response);
    }
    callback(null, body, undefined);
  }

  describe('loading profile', function() {
    var profile;
    
    before(function(done) {
      strategy.userProfile('accessToken', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });


    it('should parse profile', function() {
      expect(profile.provider).to.equal('bnet');
      expect(profile.id).to.equal(123456);
      expect(profile.battletag).to.equal('Player#1234');
    });

  });
});