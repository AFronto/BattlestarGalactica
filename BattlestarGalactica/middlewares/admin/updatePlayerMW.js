module.exports = function(objectrepository, editUser) {
  return function(req, res, next) {
    editUser(undefined);
    if (req.body.newName !== "") {
      console.log("New name " + req.body.newName);
    } else {
      console.log("Name dosen't changes");
    }
    return res.redirect("/manage-players");
    next();
  };
};
