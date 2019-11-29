var Q = require("q");
const requireOption = require("../requireOption");

module.exports = function(
  objectrepository,
  setGameStarted,
  addLoggedInUsers,
  errorSet
) {
  const Game = requireOption(objectrepository, "Game");
  const CardPack = requireOption(objectrepository, "CardPack");
  const Player = requireOption(objectrepository, "Player");
  const PlayerWithCards = requireOption(objectrepository, "PlayerWithCards");

  return function(req, res, next) {
    if (
      req.body.adminPlayer &&
      !objectrepository.gameStarted &&
      !objectrepository.loggedInUsers.includes(req.body.adminPlayer) &&
      typeof req.body.players === typeof [] &&
      req.body.cardpacks !== undefined &&
      req.body.players.length >= 3 &&
      req.body.players.length <= 6
    ) {
      var game = new Game();
      CardPack.find({
        _id:
          typeof req.body.cardpacks === typeof []
            ? { $in: req.body.cardpacks }
            : req.body.cardpacks
      }).exec((err, cardPacks) => {
        if (err || !cardPacks) {
          return next(err);
        }

        var preds = {
          //not apropriate player number
          playerNum: cardPacks.some(
            cP =>
              /\d/.test(cP.name) &&
              !cP.name.includes("" + req.body.players.length)
          ),
          //no execution or personal goal when playing final five
          finalfiveWithNoExtra:
            cardPacks.some(cP => cP.name.includes("Final Five Expansion")) &&
            !(
              cardPacks.some(cP => cP.name.includes("Personal Goal")) ||
              cardPacks.some(cP => cP.name.includes("Execution"))
            ),
          //personal goal and execution at the same time
          personalGoalAndExec:
            cardPacks.some(cP => cP.name.includes("Personal Goal")) &&
            cardPacks.some(cP => cP.name.includes("Execution")),
          //no base
          noBase: !cardPacks.some(cP => cP.name.includes("Base")),
          // more than 1 personal goal/final five
          moreThanOne:
            cardPacks.filter(cP => cP.name.includes("Personal Goal")).length >
              1 ||
            cardPacks.filter(cP => cP.name.includes("Final Five Expansion"))
              .length > 1
        };

        if (
          preds.playerNum ||
          preds.finalfiveWithNoExtra ||
          preds.personalGoalAndExec ||
          preds.noBase ||
          preds.moreThanOne
        ) {
          errorSet({
            message: "Invalid cardpack setup!",
            type: "cardpack"
          });
          return res.redirect("/manage-game");
        }

        req.session.player = req.body.adminPlayer;
        addLoggedInUsers(req.body.adminPlayer);
        setGameStarted(true);

        game.cardPacks = cardPacks;

        Player.find({
          _id: { $in: req.body.players }
        }).exec((err, players) => {
          if (err || !players) {
            return next(err);
          }

          var tasks = [];

          game.players = players.map(p => {
            var playerWithCards = new PlayerWithCards();
            playerWithCards.player = p;
            tasks.push(playerWithCards.save());
            return playerWithCards;
          });

          Q.all(tasks).then(
            function(results) {
              game.save(function(err) {
                if (err !== null) {
                  console.log(`Creating Game Error: ${err}`);
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
    } else {
      if (
        typeof req.body.players !== typeof [] ||
        req.body.players.length < 3 ||
        req.body.players.length > 6
      ) {
        errorSet({ message: "Wrong player number!", type: "player" });
        return res.redirect("/manage-game");
      }

      if (req.body.cardpacks === undefined) {
        errorSet({ message: "Invalid cardpack setup!", type: "cardpack" });
        return res.redirect("/manage-game");
      }

      errorSet({ message: "Cannot start Game!", type: "badrequest" });
      return res.redirect("/manage-game");
    }
  };
};
