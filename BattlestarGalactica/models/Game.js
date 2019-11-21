const Schema = require("mongoose").Schema;
const db = require("../config/db");

const Game = db.model("Game", {
  cardPacks: [{ type: Schema.Types.ObjectId, ref: "CardPack" }],
  players: [{ type: Schema.Types.ObjectId, ref: "PlayerWithCards" }]
});

module.exports = Game;
