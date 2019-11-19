module.exports = function(objectrepository) {
  return function(req, res, next) {
    return res.redirect("/play-game");
    next();
  };
};
