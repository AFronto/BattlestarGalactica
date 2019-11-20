const Schema = require("mongoose").Schema;
const db = require("../config/db");

const Card = db.model("Card", {
  title: String,
  img: String,
  desc: String
});

module.exports = Card;
