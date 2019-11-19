module.exports = function(objectrepository, endGame, removeLoggedInUsers) {
  return function(req, res, next) {
    if (req.session.isAdmin && objectrepository.loggedInUsers.length > 1) {
      backURL = req.header("Referer") || "/";
      return res.redirect(backURL);
    } else if (req.session.isAdmin) {
      endGame();
    } else {
      removeLoggedInUsers(req.session.player);
    }
    req.session.destroy(err => {
      res.redirect("/");
    });
  };
};

// checks if the user is admin
// the admin can only leav the game as the last player
// and this finishis the game
