const Schema = require("mongoose").Schema;
const db = require("../config/db");

const Player = db.model("Player", {
  name: String
});

module.exports = Player;
