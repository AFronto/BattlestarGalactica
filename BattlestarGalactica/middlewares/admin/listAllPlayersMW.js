module.exports = function(objectrepository) {
  return function(req, res, next) {
    res.locals.players = [
      { id: "Player1", name: "Player 1" },
      { id: "Player2", name: "Player 2" },
      { id: "Player3", name: "Player 3" },
      { id: "Player4", name: "Player 4" },
      { id: "Player5", name: "Player 5" }
    ];
    next();
  };
};
