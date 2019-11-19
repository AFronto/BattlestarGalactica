module.exports = function(objectrepository, editUser) {
  return function(req, res, next) {
    if (objectrepository.editedUser === req.params.player) {
      editUser(undefined);
    }
    console.log("Deleting " + req.params.player);
    return res.redirect("/manage-players");
    next();
  };
};
