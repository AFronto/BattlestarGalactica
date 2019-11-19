module.exports = function(objectrepository) {
  return function(req, res, next) {
    res.locals.edited = objectrepository.editedUser;
    next();
  };
};
