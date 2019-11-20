const requireOption = require("../requireOption");

module.exports = function(objectrepository) {
  const CardPack = requireOption(objectrepository, "CardPack");

  return function(req, res, next) {
    CardPack.find().exec((err, cardPacks) => {
      if (err || !cardPacks) {
        return next(err);
      }

      res.locals.cardPacks = cardPacks.sort(function(a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      return next();
    });
  };
};
