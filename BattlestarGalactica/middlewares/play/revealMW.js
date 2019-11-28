const requireOption = require("../requireOption");

module.exports = function(objectrepository) {
  const Game = requireOption(objectrepository, "Game");

  return function(req, res, next) {
    Game.findOne({})
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
          path: "player"
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
        var itsMe = game.players.find(p => p.player.id === req.session.player);
        console.log("its me before: " + itsMe);
        itsMe.wannaSeeOne = itsMe.wannaSeeOne.filter(
          p => p.id !== req.body.toWho
        );
        itsMe.wannaSeeAll = itsMe.wannaSeeAll.filter(
          p => p.id !== req.body.toWho
        );

        if (!req.body.decline) {
          var askingPlayer = game.players.find(
            p => p.player.id === req.body.toWho
          );
          if (req.body.howMany === "one") {
            var randomCard = Math.floor(
              Math.random() * itsMe.identityCards.length
            );

            if (
              (itsMe.identityCards[randomCard].card.title !== "Human" ||
                !itsMe.identityCards.some(
                  ic =>
                    ic.knownBy.some(k => k.id === req.body.toWho) &&
                    ic.card.title === "Human"
                )) &&
              !itsMe.identityCards[randomCard].knownBy.some(
                k => k.id === req.body.toWho
              )
            ) {
              itsMe.identityCards[randomCard].knownBy.push(askingPlayer.player);
              itsMe.identityCards[randomCard].save(function(err) {
                if (err !== null) {
                  console.log(`Identity Error: ${err}`);
                }
              });
            }
          } else if (req.body.howMany === "all") {
            itsMe.identityCards.forEach(identity => {
              if (!identity.knownBy.some(k => k.id === req.body.toWho)) {
                identity.knownBy.push(askingPlayer.player);
                identity.save(function(err) {
                  if (err !== null) {
                    console.log(`Identity Error: ${err}`);
                  }
                });
              }
            });
          }
          console.log("its me after:" + itsMe);
        }
        itsMe.save(function(err) {
          if (err !== null) {
            console.log(`Reveal Error: ${err}`);
          }
          return res.redirect("/play-game");
        });
      });
  };
};

// reveals a card or cards for other players specified in the body
