module.exports = function(objectrepository) {
  return function(req, res, next) {
    console.log("New player is created!");
    return res.redirect("/manage-players");
    next();
  };
};
