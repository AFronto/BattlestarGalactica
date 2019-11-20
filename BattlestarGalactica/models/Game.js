const Schema = require("mongoose").Schema;
const db = require("../config/db");

const Game = db.model("Game", {
  cardPacks: [{ type: Schema.Types.ObjectId, ref: "CardPack" }],
  players: [
    {
      player: { type: Schema.Types.ObjectId, ref: "Player" },
      wannaSeeOne: [{ type: Schema.Types.ObjectId, ref: "Player" }],
      wannaSeeAll: [{ type: Schema.Types.ObjectId, ref: "Player" }],
      identityCards: [
        {
          knownBy: [{ type: Schema.Types.ObjectId, ref: "Player" }],
          card: { type: Schema.Types.ObjectId, ref: "Card" }
        }
      ]
    }
  ]
});

module.exports = Game;
