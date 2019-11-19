module.exports = function(objectrepository, endGame) {
  return function(req, res, next) {
    next();
  };
};

// requests a reveal from a player specified in body
// for random or all cards specified in the body aswell
