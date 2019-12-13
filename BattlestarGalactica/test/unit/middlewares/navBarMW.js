var expect = require("chai").expect;
var navBarMW = require("../../../middlewares/navBarMW");

describe("navBar middleware ", function(done) {
  it("should set up the navigation bar for logged out state", function(done) {
    const mw = navBarMW(1);

    var req = {
      session: {
        loggedIn: false,
        isAdmin: false
      }
    };

    var res = {
      locals: {}
    };

    mw(req, res, () => {});

    expect(res.locals.links.length).to.be.eql(2);

    expect(res.locals.links[0].title).to.eql("All Cards");
    expect(res.locals.links[1].title).to.eql("Log In");
    done();
  });
  it("should set up the navigation bar for logged in player", function(done) {
    const mw = navBarMW(1);

    var req = {
      session: {
        loggedIn: true,
        isAdmin: false
      }
    };

    var res = {
      locals: {}
    };

    mw(req, res, () => {});

    expect(res.locals.links.length).to.be.eql(2);
    expect(res.locals.links[0].title).to.eql("All Cards");
    expect(res.locals.links[1].title).to.eql("Play Game");
    done();
  });
  it("should set up the navigation bar for logged in admin", function(done) {
    const mw = navBarMW(1);

    var req = {
      session: {
        loggedIn: true,
        isAdmin: true
      }
    };

    var res = {
      locals: {}
    };

    mw(req, res, () => {});

    expect(res.locals.links.length).to.be.eql(4);
    expect(res.locals.links[0].title).to.eql("All Cards");
    expect(res.locals.links[1].title).to.eql("Play Game");
    expect(res.locals.links[2].title).to.eql("Manage Game");
    expect(res.locals.links[3].title).to.eql("Manage Players");
    done();
  });
  it("should set up the active tab correctly", function(done) {
    const mw = navBarMW(2);

    var req = {
      session: {
        loggedIn: true,
        isAdmin: true
      }
    };

    var res = {
      locals: {}
    };

    mw(req, res, () => {});

    expect(res.locals.links.length).to.be.eql(4);
    expect(res.locals.links.find(l => l.active).title).to.eql("Manage Game");
    done();
  });
});
