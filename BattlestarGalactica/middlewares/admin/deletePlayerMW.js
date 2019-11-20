const requireOption = require("../requireOption");

module.exports = function(objectrepository, editUser) {
  const Player = requireOption(objectrepository, "Player");

  return function(req, res, next) {
    if (objectrepository.editedUser === req.params.player) {
      editUser(undefined);
    }
    Player.remove({ _id: req.params.player }).exec(err => {
      console.log(`Deleting Player Error: ${err}`);
    });

    return res.redirect("/manage-players");
    next();
  };
};
