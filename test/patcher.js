var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    domain = require('domain'),
    patcher = require('../patcher');

var should;

describe("Patcher", function() {
  function createDomainAndExec(func) {
    var newDomain = domain.create();
    newDomain.test = 'hi';
    var wrapped = newDomain.bind(func);
    return wrapped();
  }

  beforeEach(function() {
    should = chai.should();
  });

  afterEach(function() {
    patcher.unpatch();
  });

  describe("then", function() {
    it("doesn't work without patch", function(done) {
      createDomainAndExec(function() {
        Promise.resolve().then(function() {
          should.not.exist(domain.active);
          done();
        });
      });
    });

    it("does work with patch", function(done) {
      patcher.patch();
      createDomainAndExec(function() {
        Promise.resolve().then(function() {
          should.exist(domain.active);
          domain.active.test.should.equal("hi");
          done();
        });
      });
    });
  });

  describe("catch", function() {
    it("doesn't work without patch", function(done) {
      createDomainAndExec(function() {
        Promise.reject().catch(function() {
          should.not.exist(domain.active);
          done();
        });
      });
    });

    it("does work with patch", function(done) {
      patcher.patch();
      createDomainAndExec(function() {
        Promise.reject().catch(function() {
          should.exist(domain.active);
          domain.active.test.should.equal("hi");
          done();
        });
      });
    });
  });

  describe("constructor", function() {
    it("works without patch", function(done) {
      createDomainAndExec(function() {
        new Promise(function(res, rej) {
          setTimeout(function() {
            should.exist(domain.active);
            domain.active.test.should.equal("hi");
            done();
          }, 10);
        });
      });
    });

    it("works with patch", function(done) {
      patcher.patch();
      new Promise(function(res, rej) {
        setTimeout(function() {
          should.exist(domain.active);
          domain.active.test.should.equal("hi");
          done();
        }, 10);
      });
    });
  });

  it("is able to unpatch", function(done) {
    patcher.patch();
    patcher.unpatch();

    createDomainAndExec(function() {
      Promise.resolve().then(function() {
        should.not.exist(domain.active);
        done();
      });
    });
  });
});