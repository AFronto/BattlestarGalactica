module.exports = function(objectrepository) {
  return function(req, res, next) {
    if (objectrepository.adminLoggedInState && objectrepository.gameStarted) {
      res.locals.users = [
        { onClick: "loginPlayer('Player1')", name: "Player 1" },
        { onClick: "loginPlayer('Player2')", name: "Player 2" },
        { onClick: "loginPlayer('Player3')", name: "Player 3" },
        { onClick: "loginPlayer('Player4')", name: "Player 4" },
        { onClick: "loginPlayer('Player5')", name: "Player 5" }
      ];
    } else {
      res.locals.users = [{ onClick: "loginAdmin()", name: "Admin" }];
    }
    next();
  };
};
