const requireOption = require("../requireOption");

module.exports = function(objectrepository) {
  const Game = requireOption(objectrepository, "Game");

  return function(req, res, next) {
    const howManyCards = {
      ALL: "all",
      RANDOM: "random",
      NOTHING: "nothing"
    };
    if (objectrepository.gameStarted) {
      Game.findOne({})
        .populate({
          path: "players",
          populate: {
            path: "player"
          }
        })
        .populate({
          path: "players",
          populate: {
            path: "wannaSeeAll"
          }
        })
        .populate({
          path: "players",
          populate: {
            path: "wannaSeeOne"
          }
        })
        .populate({
          path: "players",
          populate: {
            path: "identityCards",
            populate: {
              path: "knownBy"
            }
          }
        })
        .populate({
          path: "players",
          populate: {
            path: "identityCards",
            populate: {
              path: "card"
            }
          }
        })
        .exec((err, game) => {
          if (err || !game) {
            res.locals.myPlayer = {};
            return next(err);
          }

          res.locals.myPlayer = {
            name: req.session.player
              ? game.players.find(p => p.player.id === req.session.player)
                  .player.name
              : undefined,
            identityCards: []
          };

          res.locals.otherPlayers = game.players
            .filter(p => p.player.id !== req.session.player)
            .map(p => {
              return {
                name: p.player.name,
                wannaSee: howManyCards.NOTHING,
                identityCards: p.identityCards.map(idC => {
                  if (idC.knownBy.some(kB => kB.id === req.session.player)) {
                    return { ...idC.card, known: true };
                  } else {
                    return { known: false };
                  }
                })
              };
            });

          return next();
        });
    } else {
      res.locals.myPlayer = {};
      next();
    }
  };
};
