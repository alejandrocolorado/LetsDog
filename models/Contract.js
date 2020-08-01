const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contractSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  carerId: [{ type: Schema.Types.ObjectId, ref: "User" }],
  price: Number,
  interval_price: Number,
  meeting_point: String,
  cardNumber: String,
  expiration: Date,
  cvv: Number,
});

contractSchema.set("timestamps", true);

const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;