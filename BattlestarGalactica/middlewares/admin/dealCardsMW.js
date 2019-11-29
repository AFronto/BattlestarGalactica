var dealHelper = require("../../helpers/dealHelper");
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
      .populate({
        path: "cardPacks"
      })
      .exec((err, game) => {
        var cardsToDealFrom = {
          cylonCards: 0,
          humanCards: 0,
          finalFiveCards: 0,
          personalGoalCards: 0
        };

        cardsToDealFrom = dealHelper.initCardsDealtFromGamePacks(
          cardsToDealFrom,
          game.cardPacks
        );

        var inc = {
          Cylon: [],
          FinalFive: [],
          Personal: []
        };
        var packedData = dealHelper.initCardsDealtFromAlreadyDealtCards(
          cardsToDealFrom,
          game.players,
          inc
        );
        inc = packedData.inc;
        cardsToDealFrom = packedData.cardsToDealFrom;

        cardsToDealFrom = dealHelper.dealWithNegatives(cardsToDealFrom);

        if (
          cardsToDealFrom.humanCards +
            cardsToDealFrom.cylonCards +
            cardsToDealFrom.finalFiveCards +
            cardsToDealFrom.personalGoalCards >=
          game.players.length
        ) {
          IdentityDeck.find()
            .populate("cards")
            .exec((err, decks) => {
              var tasks = [];

              var identityDecktoDealFrom = dealHelper.buildIdentityDeckToDealFrom(
                decks,
                cardsToDealFrom,
                inc
              );

              game.players.forEach(player => {
                var identity = new IdentityCard();
                var hasCylon = player.identityCards.some(
                  ic => ic.card.type === "cylon"
                );
                var index = Math.floor(
                  Math.random() * identityDecktoDealFrom.length
                );

                while (
                  hasCylon &&
                  identityDecktoDealFrom[index].type === "cylon"
                ) {
                  console.log("Cylon redeal");
                  index = Math.floor(
                    Math.random() * identityDecktoDealFrom.length
                  );
                }

                identity.executed = false;
                identity.knownBy = [];
                identity.card = identityDecktoDealFrom[index];
                player.identityCards.push(identity);
                identityDecktoDealFrom.splice(index, 1);

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
        } else {
          console.log("Not enough to deal!");
          return res.redirect("/play-game");
        }
      });
  };
};
