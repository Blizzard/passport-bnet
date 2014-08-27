/* global describe, it, expect */
/* jshint expr: true */

var BnetStrategy = require('../lib/strategy');


describe('Strategy', function() {
    
  var strategy = new BnetStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    },
    function() {});
    
  it('should be named bnet', function() {
    expect(strategy.name).to.equal('bnet');
  });
  
  it('should have default user agent', function() {
    expect(strategy._oauth2._customHeaders['User-Agent']).to.equal('passport-bnet');
  });
  
  describe('constructed with user agent option', function() {
    
    var strategy = new BnetStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        userAgent: 'example.com'
      },
      function() {});
  
    it('should have default user agent', function() {
      expect(strategy._oauth2._customHeaders['User-Agent']).to.equal('example.com');
    });
  });
  
  describe('constructed with custom headers including user agent', function() {
    
    var strategy = new BnetStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        customHeaders: { 'User-Agent': 'example.net' }
      },
      function() {});
  
    it('should have default user agent', function() {
      expect(strategy._oauth2._customHeaders['User-Agent']).to.equal('example.net');
    });
  });
  
});