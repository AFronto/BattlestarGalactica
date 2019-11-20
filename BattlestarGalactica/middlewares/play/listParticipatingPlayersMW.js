const requireOption = require("../requireOption");

module.exports = function(objectrepository) {
  const Game = requireOption(objectrepository, "Game");
  const Player = requireOption(objectrepository, "Player");

  return function(req, res, next) {
    const howManyCards = {
      ALL: "all",
      RANDOM: "random",
      NOTHING: "nothing"
    };
    if (objectrepository.gameStarted) {
      Game.findOne({}).exec((err, game) => {
        if (err || !game) {
          res.locals.myPlayer = {};
          return next(err);
        }

        Player.find({ _id: { $in: game.players.map(p => p.player) } }).exec(
          (err, players) => {
            if (err || !players) {
              return next(err);
            }

            res.locals.myPlayer = {
              name: req.session.player
                ? players.find(p => p.id === req.session.player).name
                : undefined,
              identityCards: []
            };

            res.locals.otherPlayers = players
              .filter(p => p.id !== req.session.player)
              .map(p => {
                return {
                  name: p.name,
                  wannaSee: howManyCards.NOTHING,
                  identityCards: []
                };
              });

            return next();
          }
        );
      });
    } else {
      res.locals.myPlayer = {};
      next();
    }
  };
};
