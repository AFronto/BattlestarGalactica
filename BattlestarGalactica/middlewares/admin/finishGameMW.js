module.exports = function(objectrepository, endGame) {
  return function(req, res, next) {
    endGame();
    req.sessionStore.clear();
    return res.redirect("/");
    next();
  };
};
