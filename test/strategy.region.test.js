/* global describe, it, expect */
/* jshint expr: true */

var BnetStrategy = require('../lib/strategy');

describe('Strategy', function() {

  describe('constructed without region should default to US region', function () {
    var strategy = new BnetStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function () {});

    it('will return regional authorizeUrl', function (done) {
      expect(strategy._oauth2._authorizeUrl)
        .to.equal('https://us.battle.net/oauth/authorize');
      done();
    });

    it('will return regional accessTokenUrl', function (done) {
      expect(strategy._oauth2._accessTokenUrl)
        .to.equal('https://us.battle.net/oauth/token');
      done();
    });

    it('will return regional idURL', function (done) {
      expect(strategy._idURL)
        .to.equal('https://us.api.battle.net/account/user/id');
      done();
    });

    it('will return regional battleTagURL', function (done) {
      expect(strategy._battleTagURL)
        .to.equal('https://us.api.battle.net/account/user/battletag');
      done();
    });
  });
    
  describe('constructed with EU region', function () {
    var strategy = new BnetStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        region: 'eu'
      },
      function () {});

    it('will return regional authorizeUrl', function (done) {
      expect(strategy._oauth2._authorizeUrl)
        .to.equal('https://eu.battle.net/oauth/authorize');
      done();
    });

    it('will return regional accessTokenUrl', function (done) {
      expect(strategy._oauth2._accessTokenUrl)
        .to.equal('https://eu.battle.net/oauth/token');
      done();
    });

    it('will return regional idURL', function (done) {
      expect(strategy._idURL)
        .to.equal('https://eu.api.battle.net/account/user/id');
      done();
    });

    it('will return regional battleTagURL', function (done) {
      expect(strategy._battleTagURL)
        .to.equal('https://eu.api.battle.net/account/user/battletag');
      done();
    });
  });
    
  describe('constructed with US region', function () {
    var strategy = new BnetStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        region: 'us'
      },
      function () {});

    it('will return regional authorizeUrl', function (done) {
      expect(strategy._oauth2._authorizeUrl)
        .to.equal('https://us.battle.net/oauth/authorize');
      done();
    });

    it('will return regional accessTokenUrl', function (done) {
      expect(strategy._oauth2._accessTokenUrl)
        .to.equal('https://us.battle.net/oauth/token');
      done();
    });

    it('will return regional idURL', function (done) {
      expect(strategy._idURL)
        .to.equal('https://us.api.battle.net/account/user/id');
      done();
    });

    it('will return regional battleTagURL', function (done) {
      expect(strategy._battleTagURL)
        .to.equal('https://us.api.battle.net/account/user/battletag');
      done();
    });
  });
    
  describe('constructed with CN region', function () {
    var strategy = new BnetStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        region: 'cn'
      },
      function () {});

    it('will return regional authorizeUrl', function (done) {
      expect(strategy._oauth2._authorizeUrl)
        .to.equal('https://www.battlenet.com.cn/oauth/authorize');
      done();
    });

    it('will return regional accessTokenUrl', function (done) {
      expect(strategy._oauth2._accessTokenUrl)
        .to.equal('https://www.battlenet.com.cn/oauth/token');
      done();
    });

    it('will return regional idURL', function (done) {
      expect(strategy._idURL)
        .to.equal('https://api.battlenet.com.cn/account/user/id');
      done();
    });

    it('will return regional battleTagURL', function (done) {
      expect(strategy._battleTagURL)
        .to.equal('https://api.battlenet.com.cn/account/user/battletag');
      done();
    });
  });
  
});