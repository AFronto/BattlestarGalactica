module.exports = function(objectrepository, endGame) {
  return function(req, res, next) {
    next();
  };
};

// reveals a card or cards for other players specified in the body
