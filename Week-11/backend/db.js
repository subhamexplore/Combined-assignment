const mongoose = require("mongoose");
const { MONGO_URL } = require("./config");

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB connection failed:", err));

const Schema = mongoose.Schema;

const userSchema = {
  username: {type: String, unique: true},
  password: String,
  firstName: String,
  lastName: String,
};

const accountSchema = {
  userId: mongoose.Types.ObjectId, // reference to User
  balance: Number,
};

const userModel = mongoose.model("users", userSchema);
const accountModel = mongoose.model("accounts", accountSchema);

module.exports = { userModel, accountModel };
