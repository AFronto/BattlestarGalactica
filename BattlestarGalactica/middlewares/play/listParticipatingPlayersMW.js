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
        .populate("cardPacks")
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

          res.locals.execution = game.cardPacks.some(
            cP =>
              cP.name.includes("Final Five Expansion") ||
              cP.name.includes("Execution")
          );

          var otherPlayers = game.players.filter(
            p => p.player.id !== req.session.player
          );
          var itsMe = game.players.find(
            p => p.player.id === req.session.player
          );
          res.locals.myPlayer = {
            name: req.session.player ? itsMe.player.name : undefined,
            identityCards: itsMe.identityCards.map(idC => {
              return {
                id: idC.id,
                revealed: otherPlayers.every(oP =>
                  idC.knownBy.some(kBy => kBy.id === oP.player.id)
                ),
                executed: idC.executed,
                title: idC.card.title,
                img: idC.card.img,
                desc: idC.card.desc
              };
            })
          };

          res.locals.otherPlayers = otherPlayers.map(p => {
            return {
              id: p.player.id,
              name: p.player.name,
              wannaSee: itsMe.wannaSeeAll.some(wSA => wSA.id === p.player.id)
                ? howManyCards.ALL
                : itsMe.wannaSeeOne.some(wSO => wSO.id === p.player.id)
                ? howManyCards.RANDOM
                : howManyCards.NOTHING,
              identityCards: p.identityCards.map(idC => {
                if (idC.knownBy.some(kB => kB.id === req.session.player)) {
                  return {
                    executed: idC.executed,
                    title: idC.card.title,
                    img: idC.card.img,
                    desc: idC.card.desc,
                    known: true
                  };
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
