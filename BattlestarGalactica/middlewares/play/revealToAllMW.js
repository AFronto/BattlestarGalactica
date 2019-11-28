const requireOption = require("../requireOption");

module.exports = function(objectrepository) {
  const Game = requireOption(objectrepository, "Game");

  return function(req, res, next) {
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
          path: "identityCards",
          populate: {
            path: "knownBy"
          }
        }
      })
      .exec((err, game) => {
        var itsMe = game.players.find(p => p.player.id === req.session.player);
        var revealedCard = itsMe.identityCards.find(
          ic => ic.id === req.body.card
        );
        var alltheOtherPlayers = game.players
          .filter(p => p.player.id !== req.session.player)
          .map(p => p.player);

        alltheOtherPlayers.forEach(player => {
          if (!revealedCard.knownBy.some(k => k.id === player.id)) {
            revealedCard.knownBy.push(player);
          }
        });

        revealedCard.save(function(err) {
          if (err !== null) {
            console.log(`Reveal Error: ${err}`);
          }
          return res.redirect("/play-game");
        });
      });
  };
};

// reveals a card or cards for other players specified in the body
