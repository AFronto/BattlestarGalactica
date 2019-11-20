const requireOption = require("../requireOption");

module.exports = function(objectrepository, editUser) {
  const Player = requireOption(objectrepository, "Player");

  return function(req, res, next) {
    var id = objectrepository.editedUser;
    editUser(undefined);
    if (req.body.newName !== "") {
      Player.findOne({ _id: id }).exec((err, player) => {
        if (err || !player) {
          console.log(`Update Player Error: ${err}`);
        }
        player.name = req.body.newName;
        player.save(function(err) {
          console.log(`Update Player Error: ${err}`);
        });
      });
    } else {
      console.log("Name dosen't changes");
    }
    return res.redirect("/manage-players");
    next();
  };
};
