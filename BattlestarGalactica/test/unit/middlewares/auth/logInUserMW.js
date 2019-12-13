var expect = require("chai").expect;
var logInUserMW = require("../../../../middlewares/auth/logInUserMW");

describe("loggInUser middleware ", function(done) {
  it("should log user in as admin", function(done) {
    var objRep = {
      adminLoggedInState: false
    };
    const mw = logInUserMW(
      objRep,
      state => {
        objRep.adminLoggedInState = state;
      },
      () => {}
    );

    var req = {
      body: {
        asAdmin: true
      },
      session: {
        save: () => {}
      }
    };

    mw(req, {}, () => {});

    expect(req.session.loggedIn).to.be.eql(true);
    expect(req.session.isAdmin).to.be.eql(true);
    expect(objRep.adminLoggedInState).to.be.eql(true);
    done();
  });
  it("shouldn't log admin in because admin already logged in", function(done) {
    var objRep = {
      adminLoggedInState: true
    };
    const mw = logInUserMW(
      objRep,
      state => {
        objRep.adminLoggedInState = state;
      },
      () => {}
    );

    var req = {
      body: {
        asAdmin: true
      },
      session: {
        save: () => {}
      }
    };

    mw(req, {}, () => {
      done();
    });
  });
  it("should log user in as normal user", function(done) {
    var objRep = {
      adminLoggedInState: true,
      loggedInUsers: []
    };
    const mw = logInUserMW(
      objRep,
      () => {},
      player => {
        objRep.loggedInUsers.push(player);
      }
    );

    var req = {
      body: {
        asAdmin: false,
        player: "Player1"
      },
      session: {
        save: () => {}
      }
    };

    mw(req, {}, () => {});

    expect(req.session.loggedIn).to.be.eql(true);
    expect(req.session.isAdmin).to.be.eql(false);
    expect(objRep.adminLoggedInState).to.be.eql(true);
    expect(objRep.loggedInUsers).to.includes("Player1");
    done();
  });
  it("shouldn't log user in because it's already logged in", function(done) {
    var objRep = {
      adminLoggedInState: true,
      loggedInUsers: ["Player1"]
    };
    const mw = logInUserMW(
      objRep,
      () => {},
      player => {
        objRep.loggedInUsers.push(player);
      }
    );

    var req = {
      body: {
        asAdmin: false,
        player: "Player1"
      },
      session: {
        save: () => {}
      }
    };

    mw(req, {}, () => {
      done();
    });
  });
});
