const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/BattlestarGalactica", {
  useNewUrlParser: true
});

module.exports = mongoose;
