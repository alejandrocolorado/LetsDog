const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  isCArer: {
    type: Boolean,
    default: false,
  },
});

userSchema.set("timestamps", true);

const User = mongoose.model("User", userSchema);

module.exports = User;
