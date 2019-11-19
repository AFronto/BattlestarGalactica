module.exports = function(objectrepository) {
  return function(req, res, next) {
    res.locals.cardPacks = [
      { id: "cpack1", name: "Card Pack 1" },
      { id: "cpack2", name: "Card Pack 2" },
      { id: "cpack3", name: "Card Pack 3" },
      { id: "cpack4", name: "Card Pack 4" },
      { id: "cpack5", name: "Card Pack 5" }
    ];
    next();
  };
};
