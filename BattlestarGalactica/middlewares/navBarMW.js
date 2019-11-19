module.exports = function(activeIndex) {
  return function(req, res, next) {
    res.locals.logOut = false;
    res.locals.links = [
      {
        title: "All Cards",
        url: "/cards",
        active: false
      }
    ];
    if (
      typeof req.session.loggedIn === "undefined" ||
      req.session.loggedIn !== true
    ) {
      res.locals.links.push({
        title: "Log In",
        url: "/",
        active: false
      });
    } else {
      res.locals.logOut = true;
      res.locals.links.push({
        title: "Play Game",
        url: "/play-game",
        active: false
      });
      if (req.session.isAdmin && req.session.isAdmin === true) {
        res.locals.links.push(
          ...[
            {
              title: "Manage Game",
              url: "/manage-game",
              active: false
            },
            {
              title: "Manage Players",
              url: "/manage-players",
              active: false
            }
          ]
        );
      }
    }
    if (res.locals.links[activeIndex]) {
      res.locals.links[activeIndex].active = true;
    }
    return next();
  };
};
