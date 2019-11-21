const Schema = require("mongoose").Schema;
const db = require("../config/db");

const PlayerWithCards = db.model("PlayerWithCards", {
  player: { type: Schema.Types.ObjectId, ref: "Player" },
  wannaSeeOne: [{ type: Schema.Types.ObjectId, ref: "Player" }],
  wannaSeeAll: [{ type: Schema.Types.ObjectId, ref: "Player" }],
  identityCards: [{ type: Schema.Types.ObjectId, ref: "IdentityCard" }]
});

module.exports = PlayerWithCards;
