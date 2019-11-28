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
          path: "identityCards"
        }
      })
      .exec((err, game) => {
        var updatedPlayer = game.players.find(
          p => p.player.id === req.body.fromWho
        );
        if (updatedPlayer.identityCards.length > 0) {
          var itsMe = game.players.find(
            p => p.player.id === req.session.player
          );

          updatedPlayer.wannaSeeOne = updatedPlayer.wannaSeeOne.filter(
            p => p.id !== req.session.player
          );
          updatedPlayer.wannaSeeAll = updatedPlayer.wannaSeeAll.filter(
            p => p.id !== req.session.player
          );

          if (req.body.howMany === "one") {
            updatedPlayer.wannaSeeOne.push(itsMe.player);
          } else if (req.body.howMany === "all") {
            updatedPlayer.wannaSeeAll.push(itsMe.player);
          }
        }
        updatedPlayer.save(function(err) {
          if (err !== null) {
            console.log(`Request Reveal Error: ${err}`);
          }
          return res.redirect("/play-game");
        });
      });
  };
};

// requests a reveal from a player specified in body
// for random or all cards specified in the body aswell
