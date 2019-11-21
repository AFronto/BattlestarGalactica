var Q = require("q");
const requireOption = require("../requireOption");

module.exports = function(objectrepository) {
  const Game = requireOption(objectrepository, "Game");
  const IdentityDeck = requireOption(objectrepository, "IdentityDeck");
  const IdentityCard = requireOption(objectrepository, "IdentityCard");

  return function(req, res, next) {
    Game.findOne({})
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
        var decksToDealFrom = ["Human Identities"];
        IdentityDeck.find({
          title: { $in: decksToDealFrom }
        })
          .populate("cards")
          .exec((err, decks) => {
            var tasks = [];

            game.players.forEach(player => {
              var identity = new IdentityCard();
              identity.knownBy = [];
              identity.card = decks[0].cards[0];
              player.identityCards.push(identity);

              tasks.push(identity.save());
              tasks.push(player.save());
            });

            Q.all(tasks).then(
              function(results) {
                game.save(function(err) {
                  if (err !== null) {
                    console.log(`Updating Game Error: ${err}`);
                  }
                  return res.redirect("/play-game");
                });
              },
              function(err) {
                console.log(err);
              }
            );
          });
      });
  };
};
