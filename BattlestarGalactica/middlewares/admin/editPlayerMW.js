module.exports = function(objectrepository, editUser) {
  return function(req, res, next) {
    editUser(req.params.player);
    return res.redirect("/manage-players");
    next();
  };
};
