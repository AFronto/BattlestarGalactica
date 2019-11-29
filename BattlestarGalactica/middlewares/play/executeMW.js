var dealHelper = require("../../helpers/dealHelper");
var Q = require("q");
const requireOption = require("../requireOption");

module.exports = function(objectrepository) {
  const Game = requireOption(objectrepository, "Game");
  const CardPack = requireOption(objectrepository, "CardPack");
  const IdentityDeck = requireOption(objectrepository, "IdentityDeck");
  const IdentityCard = requireOption(objectrepository, "IdentityCard");

  return function(req, res, next) {
    Game.findOne({})
      .populate({
        path: "players",
        populate: {
          path: "player"
        }
      })
      .populate({
        path: "cardPacks"
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
        var revealedCards = itsMe.identityCards;

        var alltheOtherPlayers = game.players
          .filter(p => p.player.id !== req.session.player)
          .map(p => p.player);

        var tasks = [];

        revealedCards.forEach(revealedCard => {
          alltheOtherPlayers.forEach(player => {
            if (!revealedCard.knownBy.some(k => k.id === player.id)) {
              revealedCard.knownBy.push(player);
            }
          });

          revealedCard.executed = true;

          tasks.push(revealedCard.save());
        });

        Q.all(tasks).then(
          function(results) {
            console.log("Executed");
            if (!revealedCards.some(rC => rC.card.type === "cylon")) {
              var cdPack = new CardPack();
              cdPack.name = "Executed Player";
              cdPack.cylonCards = 0;
              cdPack.humanCards = 1;
              cdPack.finalFiveCards = 0;
              cdPack.personalGoalCards = 0;
              cdPack.save(function(err) {
                if (err !== null) {
                  console.log(`CardPack Error: ${err}`);
                }
                game.cardPacks.push(cdPack);

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

                IdentityDeck.find()
                  .populate("cards")
                  .exec((err, decks) => {
                    var identity = new IdentityCard();

                    var identityDecktoDealFrom = dealHelper.buildIdentityDeckToDealFrom(
                      decks,
                      cardsToDealFrom,
                      inc
                    );

                    var index = Math.floor(
                      Math.random() * identityDecktoDealFrom.length
                    );

                    identity.executed = false;
                    identity.knownBy = [];
                    identity.card = identityDecktoDealFrom[index];
                    itsMe.identityCards.push(identity);

                    identity.save(function(err) {
                      if (err !== null) {
                        console.log(`Identity Error: ${err}`);
                      }

                      itsMe.save(function(err) {
                        if (err !== null) {
                          console.log(`ItsMe Error: ${err}`);
                        }
                        game.save(function(err) {
                          if (err !== null) {
                            console.log(`Game Update Error: ${err}`);
                          }
                          return res.redirect("/play-game");
                        });
                      });
                    });
                  });
              });
            } else {
              console.log("Cylon");
              return res.redirect("/play-game");
            }
          },
          function(err) {
            console.log(`Execute Error: ${err}`);
            return res.redirect("/play-game");
          }
        );
      });
  };
};
