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

module.exports = {
  initCardsDealtFromGamePacks: function(cardsToDealFrom, cardPacks) {
    cardPacks.forEach(pack => {
      cardsToDealFrom.humanCards += pack.humanCards;
      cardsToDealFrom.cylonCards += pack.cylonCards;
      cardsToDealFrom.finalFiveCards += pack.finalFiveCards;
      cardsToDealFrom.personalGoalCards += pack.personalGoalCards;
    });
    return cardsToDealFrom;
  },

  initCardsDealtFromAlreadyDealtCards: function(cardsToDealFrom, players, inc) {
    players.forEach(player => {
      player.identityCards.forEach(ic => {
        if (ic.card.type === "human") {
          cardsToDealFrom.humanCards -= 1;
        } else if (ic.card.type === "cylon") {
          cardsToDealFrom.cylonCards -= 1;
          inc.Cylon.push(ic.card);
        } else if (ic.card.type === "finalfive") {
          cardsToDealFrom.finalFiveCards -= 1;
          inc.FinalFive.push(ic.card);
        } else if (ic.card.type === "personalgoal") {
          cardsToDealFrom.personalGoalCards -= 1;
          inc.Personal.push(ic.card);
        }
      });
    });

    return {
      cardsToDealFrom: cardsToDealFrom,
      inc: inc
    };
  },

  dealWithNegatives: function(cardsToDealFrom) {
    cardsToDealFrom.humanCards =
      cardsToDealFrom.humanCards < 0 ? 0 : cardsToDealFrom.humanCards;
    cardsToDealFrom.cylonCards =
      cardsToDealFrom.cylonCards < 0 ? 0 : cardsToDealFrom.cylonCards;
    cardsToDealFrom.finalFiveCards =
      cardsToDealFrom.finalFiveCards < 0 ? 0 : cardsToDealFrom.finalFiveCards;
    cardsToDealFrom.personalGoalCards =
      cardsToDealFrom.personalGoalCards < 0
        ? 0
        : cardsToDealFrom.personalGoalCards;

    return cardsToDealFrom;
  },

  buildIdentityDeckToDealFrom: function(decks, cardsToDealFrom, inc) {
    var identityDecktoDealFrom = Array(cardsToDealFrom.humanCards).fill(
      decks.find(d => d.title === "Human Identities").cards[0]
    );

    identityDecktoDealFrom.push(
      ...selectXCardFromDeck(
        decks.find(d => d.title === "Cylon Identities").cards,
        cardsToDealFrom.cylonCards,
        inc.Cylon
      )
    );

    identityDecktoDealFrom.push(
      ...selectXCardFromDeck(
        decks.find(d => d.title === "Final Five Identities").cards,
        cardsToDealFrom.finalFiveCards,
        inc.FinalFive
      )
    );

    identityDecktoDealFrom.push(
      ...selectXCardFromDeck(
        decks.find(d => d.title === "Personal Goal Identities").cards,
        cardsToDealFrom.personalGoalCards,
        inc.Personal
      )
    );
    return identityDecktoDealFrom;
  }
};
