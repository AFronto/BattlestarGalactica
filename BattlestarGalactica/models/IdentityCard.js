const Schema = require("mongoose").Schema;
const db = require("../config/db");

const IdentityCard = db.model("IdentityCard", {
  executed: Boolean,
  knownBy: [{ type: Schema.Types.ObjectId, ref: "Player" }],
  card: { type: Schema.Types.ObjectId, ref: "Card" }
});

module.exports = IdentityCard;
