const Schema = require("mongoose").Schema;
const db = require("../config/db");

const CardPack = db.model("CardPack", {
  name: String,
  cylonCards: Number,
  humanCards: Number,
  finalFiveCards: Number,
  personalGoalCards: Number
});

module.exports = CardPack;
