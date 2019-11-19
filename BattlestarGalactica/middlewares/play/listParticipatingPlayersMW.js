module.exports = function(objectrepository) {
  return function(req, res, next) {
    const howManyCards = {
      ALL: "all",
      RANDOM: "random",
      NOTHING: "nothing"
    };

    res.locals.myPlayer = {
      name: req.session.player ? req.session.player : undefined,
      identityCards: [
        {
          title: "Cylon 1",
          img: "./images/poly/Cylon1.jpg",
          desc: "The really long discription of this loyalty card"
        },
        {
          title: "Human",
          img: "./images/poly/Human.jpg",
          desc: "The really long discription of this loyalty card"
        }
      ]
    };
    res.locals.otherPlayers = [
      {
        name: "Other Player 1",
        wannaSee: howManyCards.NOTHING,
        identityCards: [
          {
            known: true,
            title: "Human",
            img: "./images/poly/Human.jpg",
            desc: "The really long discription of this loyalty card"
          },
          {
            known: true,
            title: "Human",
            img: "./images/poly/Human.jpg",
            desc: "The really long discription of this loyalty card"
          }
        ]
      },
      {
        name: "Other Player 2",
        wannaSee: howManyCards.ALL,
        identityCards: [
          {
            known: true,
            title: "Human",
            img: "./images/poly/Human.jpg",
            desc: "The really long discription of this loyalty card"
          },
          {
            known: false
          },
          {
            known: false
          }
        ]
      },
      {
        name: "Other Player 3",
        wannaSee: howManyCards.RANDOM,
        identityCards: [
          {
            known: true,
            title: "Human",
            img: "./images/poly/Human.jpg",
            desc: "The really long discription of this loyalty card"
          },
          {
            known: false
          }
        ]
      },
      {
        name: "Other Player 4",
        wannaSee: howManyCards.NOTHING,
        identityCards: [
          {
            known: false
          }
        ]
      },
      {
        name: "Other Player 5",
        wannaSee: howManyCards.NOTHING,
        identityCards: []
      }
    ];
    next();
  };
};
