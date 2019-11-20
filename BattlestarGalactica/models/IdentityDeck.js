const Schema = require("mongoose").Schema;
const db = require("../config/db");

const Deck = db.model("Deck", {
  title: String,
  cards: [{ type: Schema.Types.ObjectId, ref: "Card" }]
});

module.exports = Deck;
