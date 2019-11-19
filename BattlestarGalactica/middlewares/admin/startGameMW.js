module.exports = function(objectrepository, setGameStarted, addLoggedInUsers) {
  return function(req, res, next) {
    if (
      req.body.adminPlayer &&
      !objectrepository.loggedInUsers.includes(req.body.adminPlayer)
    ) {
      req.session.player = req.body.adminPlayer;
      addLoggedInUsers(req.body.adminPlayer);
      setGameStarted(true);
      return res.redirect("/play-game");
    }
    return res.redirect("/manage-game");
  };
};
