const requireOption = require("../requireOption");

module.exports = function(objectrepository) {
  const Player = requireOption(objectrepository, "Player");

  return function(req, res, next) {
    Player.find().exec((err, players) => {
      if (err || !players) {
        return next(err);
      }

      res.locals.players = players;
      return next();
    });
  };
};
