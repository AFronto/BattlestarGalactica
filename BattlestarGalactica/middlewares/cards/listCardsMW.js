const requireOption = require("../requireOption");

module.exports = function(objectrepository) {
  const IdentityDeck = requireOption(objectrepository, "IdentityDeck");

  return function(req, res, next) {
    IdentityDeck.find()
      .populate("cards")
      .exec((err, decks) => {
        if (err || !decks) {
          return next(err);
        }

        res.locals.allDecks = decks;
        return next();
      });
  };
};
