module.exports = function(objectrepository) {
  return function(req, res, next) {
    if (
      typeof req.session.loggedIn !== "undefined" &&
      req.session.loggedIn === true
    ) {
      return res.redirect("/play-game");
    }

    next();
  };
};
