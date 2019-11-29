const requireOption = require("../middlewares/requireOption");

function initDB(objectrepository) {
  const IdentityDeck = requireOption(objectrepository, "IdentityDeck");
  const Card = requireOption(objectrepository, "Card");
  const CardPack = requireOption(objectrepository, "CardPack");

  console.log("DB init started...");
  [
    {
      title: "Cylon Identities",
      cards: [
        {
          title: "Cylon 1",
          img: "./images/poly/Cylon1.jpg",
          desc: "The really long discription of this loyalty card",
          type: "cylon"
        },
        {
          title: "Cylon 2",
          img: "./images/poly/Cylon2.jpg",
          desc: "The really long discription of this loyalty card",
          type: "cylon"
        },
        {
          title: "Cylon 3",
          img: "./images/poly/Cylon3.jpg",
          desc: "The really long discription of this loyalty card",
          type: "cylon"
        },
        {
          title: "Cylon 4",
          img: "./images/poly/Cylon4.jpg",
          desc: "The really long discription of this loyalty card",
          type: "cylon"
        },
        {
          title: "Cylon 5",
          img: "./images/poly/Cylon5.jpg",
          desc: "The really long discription of this loyalty card",
          type: "cylon"
        },
        {
          title: "Cylon 6",
          img: "./images/poly/Cylon6.jpg",
          desc: "The really long discription of this loyalty card",
          type: "cylon"
        }
      ]
    },
    {
      title: "Human Identities",
      cards: [
        {
          title: "Human",
          img: "./images/poly/Human.jpg",
          desc: "The really long discription of this loyalty card",
          type: "human"
        }
      ]
    },
    {
      title: "Final Five Identities",
      cards: [
        {
          title: "Final Five 1",
          img: "./images/poly/FinalFive1.jpg",
          desc: "The really long discription of this loyalty card",
          type: "finalfive"
        },
        {
          title: "Final Five 2",
          img: "./images/poly/FinalFive2.jpg",
          desc: "The really long discription of this loyalty card",
          type: "finalfive"
        },
        {
          title: "Final Five 3",
          img: "./images/poly/FinalFive3.jpg",
          desc: "The really long discription of this loyalty card",
          type: "finalfive"
        },
        {
          title: "Final Five 4",
          img: "./images/poly/FinalFive4.jpg",
          desc: "The really long discription of this loyalty card",
          type: "finalfive"
        },
        {
          title: "Final Five 5",
          img: "./images/poly/FinalFive5.jpg",
          desc: "The really long discription of this loyalty card",
          type: "finalfive"
        }
      ]
    },
    {
      title: "Personal Goal Identities",
      cards: [
        {
          title: "Personal Goal 1",
          img: "./images/poly/PersonalGoal1.jpg",
          desc: "The really long discription of this loyalty card",
          type: "personalgoal"
        },
        {
          title: "Personal Goal 2",
          img: "./images/poly/PersonalGoal2.jpg",
          desc: "The really long discription of this loyalty card",
          type: "personalgoal"
        },
        {
          title: "Personal Goal 3",
          img: "./images/poly/PersonalGoal3.jpg",
          desc: "The really long discription of this loyalty card",
          type: "personalgoal"
        },
        {
          title: "Personal Goal 4",
          img: "./images/poly/PersonalGoal4.jpg",
          desc: "The really long discription of this loyalty card",
          type: "personalgoal"
        },
        {
          title: "Personal Goal 5",
          img: "./images/poly/PersonalGoal5.jpg",
          desc: "The really long discription of this loyalty card",
          type: "personalgoal"
        },
        {
          title: "Personal Goal 6",
          img: "./images/poly/PersonalGoal6.jpg",
          desc: "The really long discription of this loyalty card",
          type: "personalgoal"
        },
        {
          title: "Personal Goal 7",
          img: "./images/poly/PersonalGoal7.jpg",
          desc: "The really long discription of this loyalty card",
          type: "personalgoal"
        },
        {
          title: "Personal Goal 8",
          img: "./images/poly/PersonalGoal8.jpg",
          desc: "The really long discription of this loyalty card",
          type: "personalgoal"
        }
      ]
    }
  ].forEach(idDeck => {
    var deck = new IdentityDeck();
    deck.title = idDeck.title;
    deck.cards = [];
    idDeck.cards.forEach(idCard => {
      var card = new Card();
      card.title = idCard.title;
      card.img = idCard.img;
      card.desc = idCard.desc;
      card.type = idCard.type;
      card.save(function(err) {
        if (err !== null) {
          console.log(`Card Error: ${err}`);
        } else {
          console.log(`Card ${card.title} saved successfully!`);
        }
      });
      deck.cards.push(card);
    });
    deck.save(function(err) {
      if (err !== null) {
        console.log(`Deck Error: ${err}`);
      } else {
        console.log(`Deck ${deck.title} saved successfully!`);
      }
    });
  });

  [
    {
      name: "3 Player Base",
      cylonCards: 1,
      humanCards: 5,
      finalFiveCards: 0,
      personalGoalCards: 0
    },
    {
      name: "3 Player Personal Goal Easy Expansion",
      cylonCards: 0,
      humanCards: -1,
      finalFiveCards: 0,
      personalGoalCards: 2
    },
    {
      name: "3 Player Personal Goal Hard Expansion",
      cylonCards: 0,
      humanCards: -3,
      finalFiveCards: 0,
      personalGoalCards: 4
    },
    {
      name: "4 Player Base",
      cylonCards: 1,
      humanCards: 7,
      finalFiveCards: 0,
      personalGoalCards: 0
    },
    {
      name: "4 Player Personal Goal Easy Expansion",
      cylonCards: 0,
      humanCards: -2,
      finalFiveCards: 0,
      personalGoalCards: 3
    },
    {
      name: "4 Player Personal Goal Hard Expansion",
      cylonCards: 0,
      humanCards: -4,
      finalFiveCards: 0,
      personalGoalCards: 5
    },
    {
      name: "5 Player Base",
      cylonCards: 2,
      humanCards: 8,
      finalFiveCards: 0,
      personalGoalCards: 0
    },
    {
      name: "5 Player Personal Goal Easy Expansion",
      cylonCards: 0,
      humanCards: -2,
      finalFiveCards: 0,
      personalGoalCards: 3
    },
    {
      name: "5 Player Personal Goal Medium Expansion",
      cylonCards: 0,
      humanCards: -2,
      finalFiveCards: 0,
      personalGoalCards: 5
    },
    {
      name: "5 Player Personal Goal Hard Expansion",
      cylonCards: 0,
      humanCards: -4,
      finalFiveCards: 0,
      personalGoalCards: 8
    },
    {
      name: "6 Player Base",
      cylonCards: 2,
      humanCards: 10,
      finalFiveCards: 0,
      personalGoalCards: 0
    },
    {
      name: "6 Player Personal Goal Easy Expansion",
      cylonCards: 0,
      humanCards: -3,
      finalFiveCards: 0,
      personalGoalCards: 4
    },
    {
      name: "6 Player Personal Goal Medium Expansion",
      cylonCards: 0,
      humanCards: -3,
      finalFiveCards: 0,
      personalGoalCards: 6
    },
    {
      name: "6 Player Personal Goal Hard Expansion",
      cylonCards: 0,
      humanCards: -5,
      finalFiveCards: 0,
      personalGoalCards: 8
    },
    {
      name: "5-6 Player Final Five Expansion",
      cylonCards: 0,
      humanCards: -2,
      finalFiveCards: 2,
      personalGoalCards: 0
    },
    {
      name: "3-4 Player Final Five Expansion",
      cylonCards: 0,
      humanCards: -1,
      finalFiveCards: 1,
      personalGoalCards: 0
    },
    {
      name: "Execution Expansion",
      cylonCards: 0,
      humanCards: 1,
      finalFiveCards: 0,
      personalGoalCards: 0
    }
  ].forEach(cardPack => {
    var cdPack = new CardPack();
    cdPack.name = cardPack.name;
    cdPack.cylonCards = cardPack.cylonCards;
    cdPack.humanCards = cardPack.humanCards;
    cdPack.finalFiveCards = cardPack.finalFiveCards;
    cdPack.personalGoalCards = cardPack.personalGoalCards;
    cdPack.save(function(err) {
      if (err !== null) {
        console.log(`CardPack Error: ${err}`);
      } else {
        console.log(`CardPack ${cdPack.name} saved successfully!`);
      }
    });
  });
}

module.exports = initDB;
