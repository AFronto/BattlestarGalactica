const requireOption = require("../requireOption");

module.exports = function(objectrepository) {
  const Game = requireOption(objectrepository, "Game");

  return function(req, res, next) {
    if (objectrepository.adminLoggedInState && objectrepository.gameStarted) {
      Game.findOne({})
        .populate({
          path: "players",
          populate: {
            path: "player"
          }
        })
        .exec((err, game) => {
          if (err || !game) {
            return next(err);
          }

          res.locals.users = game.players.map(p => {
            return {
              onClick: `loginPlayer('${p.player._id}')`,
              name: p.player.name
            };
          });
          return next();
        });
    } else {
      res.locals.users = [{ onClick: "loginAdmin()", name: "Admin" }];
      next();
    }
  };
};
