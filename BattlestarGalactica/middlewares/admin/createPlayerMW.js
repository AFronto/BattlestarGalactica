const requireOption = require("../requireOption");

module.exports = function(objectrepository) {
  const Player = requireOption(objectrepository, "Player");

  return function(req, res, next) {
    var newPlayer = new Player();
    newPlayer.name = "New Player";
    newPlayer.save(function(err) {
      if (err !== null) {
        console.log(`Creating Player Error: ${err}`);
      }
    });
    return res.redirect("/manage-players");
    next();
  };
};
