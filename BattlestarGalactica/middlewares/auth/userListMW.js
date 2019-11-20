const requireOption = require("../requireOption");

module.exports = function(objectrepository) {
  const Game = requireOption(objectrepository, "Game");
  const Player = requireOption(objectrepository, "Player");

  return function(req, res, next) {
    if (objectrepository.adminLoggedInState && objectrepository.gameStarted) {
      Game.findOne({}).exec((err, game) => {
        if (err || !game) {
          return next(err);
        }

        Player.find({ _id: { $in: game.players.map(p => p.player) } }).exec(
          (err, players) => {
            if (err || !players) {
              return next(err);
            }

            res.locals.users = players.map(p => {
              return {
                onClick: `loginPlayer('${p._id}')`,
                name: p.name
              };
            });
            return next();
          }
        );
      });
    } else {
      res.locals.users = [{ onClick: "loginAdmin()", name: "Admin" }];
      next();
    }
  };
};
