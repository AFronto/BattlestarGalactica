module.exports = function(
  objectrepository,
  setAdminLoggedInState,
  addLoggedInUsers
) {
  return function(req, res, next) {
    if (typeof req.body.asAdmin === "undefined") {
      return next();
    }

    if (req.body.asAdmin === true && !objectrepository.adminLoggedInState) {
      req.session.loggedIn = true;
      req.session.isAdmin = true;
      setAdminLoggedInState(true);
      return req.session.save(err => res.redirect("/manage-game"));
    } else {
      if (
        req.body.player &&
        !objectrepository.loggedInUsers.includes(req.body.player)
      ) {
        req.session.loggedIn = true;
        req.session.isAdmin = false;
        req.session.player = req.body.player;
        addLoggedInUsers(req.body.player);
        return req.session.save(err => res.redirect("/play-game"));
      }
      return next();
    }
  };
};

// logs users in and updates the aplication state
