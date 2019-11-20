const requireOption = require("../requireOption");

module.exports = function(objectrepository, setGameStarted, addLoggedInUsers) {
  const Game = requireOption(objectrepository, "Game");
  const CardPack = requireOption(objectrepository, "CardPack");
  const Player = requireOption(objectrepository, "Player");

  return function(req, res, next) {
    if (
      req.body.adminPlayer &&
      !objectrepository.loggedInUsers.includes(req.body.adminPlayer) &&
      typeof req.body.players === typeof [] &&
      req.body.cardpacks !== undefined &&
      req.body.players.length >= 3 &&
      req.body.players.length <= 6
    ) {
      req.session.player = req.body.adminPlayer;
      addLoggedInUsers(req.body.adminPlayer);
      setGameStarted(true);

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

        game.cardPacks = cardPacks;

        Player.find({
          _id: { $in: req.body.players }
        }).exec((err, players) => {
          if (err || !players) {
            return next(err);
          }

          game.players = players.map(p => {
            return {
              player: p,
              wannaSeeOne: [],
              wannaSeeAll: [],
              identityCards: []
            };
          });

          game.save(function(err) {
            console.log(`Creating Game Error: ${err}`);
          });
        });
      });

      return res.redirect("/play-game");
    }
    return res.redirect("/manage-game");
  };
};
