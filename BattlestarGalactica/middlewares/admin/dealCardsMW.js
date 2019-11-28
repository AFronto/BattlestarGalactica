var Q = require("q");
const requireOption = require("../requireOption");

function selectXCardFromDeck(deck, x, alreadyDealt) {
  var ret = [];
  while (x > 0) {
    var card = deck[Math.floor(Math.random() * deck.length)];
    if (
      !ret.some(r => r.id === card.id) &&
      !alreadyDealt.some(aD => aD.id === card.id)
    ) {
      ret.push(card);
      x -= 1;
    }
  }
  return ret;
}

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
        game.cardPacks.forEach(pack => {
          cardsToDealFrom.humanCards += pack.humanCards;
          cardsToDealFrom.cylonCards += pack.cylonCards;
          cardsToDealFrom.finalFiveCards += pack.finalFiveCards;
          cardsToDealFrom.personalGoalCards += pack.personalGoalCards;
        });

        var incCylon = [];
        var incFinalFive = [];
        var incPersonal = [];
        game.players.forEach(player => {
          player.identityCards.forEach(ic => {
            if (ic.card.type === "human") {
              cardsToDealFrom.humanCards -= 1;
            } else if (ic.card.type === "cylon") {
              cardsToDealFrom.cylonCards -= 1;
              incCylon.push(ic.card);
            } else if (ic.card.type === "finalfive") {
              cardsToDealFrom.finalFiveCards -= 1;
              incFinalFive.push(ic.card);
            } else if (ic.card.type === "personalgoal") {
              cardsToDealFrom.personalGoalCards -= 1;
              incPersonal.push(ic.card);
            }
          });
        });

        cardsToDealFrom.humanCards =
          cardsToDealFrom.humanCards < 0 ? 0 : cardsToDealFrom.humanCards;
        cardsToDealFrom.cylonCards =
          cardsToDealFrom.cylonCards < 0 ? 0 : cardsToDealFrom.cylonCards;
        cardsToDealFrom.finalFiveCards =
          cardsToDealFrom.finalFiveCards < 0
            ? 0
            : cardsToDealFrom.finalFiveCards;
        cardsToDealFrom.personalGoalCards =
          cardsToDealFrom.personalGoalCards < 0
            ? 0
            : cardsToDealFrom.personalGoalCards;

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

              var identityDecktoDealFrom = Array(
                cardsToDealFrom.humanCards
              ).fill(decks.find(d => d.title === "Human Identities").cards[0]);

              identityDecktoDealFrom.push(
                ...selectXCardFromDeck(
                  decks.find(d => d.title === "Cylon Identities").cards,
                  cardsToDealFrom.cylonCards,
                  incCylon
                )
              );

              identityDecktoDealFrom.push(
                ...selectXCardFromDeck(
                  decks.find(d => d.title === "Final Five Identities").cards,
                  cardsToDealFrom.finalFiveCards,
                  incFinalFive
                )
              );

              identityDecktoDealFrom.push(
                ...selectXCardFromDeck(
                  decks.find(d => d.title === "Personal Goal Identities").cards,
                  cardsToDealFrom.personalGoalCards,
                  incPersonal
                )
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
