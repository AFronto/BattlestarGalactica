module.exports = function(objectrepository, endGame) {
  return function(req, res, next) {
    next();
  };
};

// this reveals all the cards of the player
// depending on the identities of the player it maybe deals again for the player
