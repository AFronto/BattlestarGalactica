module.exports = function(objectrepository) {
  return function(req, res, next) {
    if (
      typeof req.session.isAdmin === "undefined" ||
      req.session.isAdmin !== true
    ) {
      backURL = req.header("Referer") || "/";

      return res.redirect(backURL);
    }

    next();
  };
};
