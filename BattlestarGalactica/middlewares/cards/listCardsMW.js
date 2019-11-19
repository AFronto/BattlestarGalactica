module.exports = function(objectrepository) {
  return function(req, res, next) {
    res.locals.allDecks = [
      {
        title: "Cylon Identities",
        cards: [
          {
            title: "Cylon 1",
            img: "./images/poly/Cylon1.jpg",
            desc: "The really long discription of this loyalty card"
          },
          {
            title: "Cylon 2",
            img: "./images/poly/Cylon2.jpg",
            desc: "The really long discription of this loyalty card"
          },
          {
            title: "Cylon 3",
            img: "./images/poly/Cylon3.jpg",
            desc: "The really long discription of this loyalty card"
          },
          {
            title: "Cylon 4",
            img: "./images/poly/Cylon4.jpg",
            desc: "The really long discription of this loyalty card"
          },
          {
            title: "Cylon 5",
            img: "./images/poly/Cylon5.jpg",
            desc: "The really long discription of this loyalty card"
          }
        ]
      },
      {
        title: "Human Identities",
        cards: [
          {
            title: "Human",
            img: "./images/poly/Human.jpg",
            desc: "The really long discription of this loyalty card"
          }
        ]
      },
      {
        title: "Final Five Identities",
        cards: [
          {
            title: "Final Five 1",
            img: "./images/poly/FinalFive1.jpg",
            desc: "The really long discription of this loyalty card"
          },
          {
            title: "Final Five 2",
            img: "./images/poly/FinalFive2.jpg",
            desc: "The really long discription of this loyalty card"
          },
          {
            title: "Final Five 3",
            img: "./images/poly/FinalFive3.jpg",
            desc: "The really long discription of this loyalty card"
          },
          {
            title: "Final Five 4",
            img: "./images/poly/FinalFive4.jpg",
            desc: "The really long discription of this loyalty card"
          }
        ]
      },
      {
        title: "Personal Goal Identities",
        cards: [
          {
            title: "Personal Goal 1",
            img: "./images/poly/PersonalGoal1.jpg",
            desc: "The really long discription of this loyalty card"
          },
          {
            title: "Personal Goal 2",
            img: "./images/poly/PersonalGoal2.jpg",
            desc: "The really long discription of this loyalty card"
          },
          {
            title: "Personal Goal 3",
            img: "./images/poly/PersonalGoal3.jpg",
            desc: "The really long discription of this loyalty card"
          },
          {
            title: "Personal Goal 4",
            img: "./images/poly/PersonalGoal4.jpg",
            desc: "The really long discription of this loyalty card"
          }
        ]
      }
    ];

    next();
  };
};
