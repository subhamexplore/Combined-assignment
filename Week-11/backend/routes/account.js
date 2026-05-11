const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { auth } = require("../middleware");
const { userModel, accountModel } = require("../db");

router.get("/balance", auth, async (req, res) => {
  const userId = req.userId;
  const data = await accountModel.findOne({ userId });
  const balance = data.balance;
  res.json({
    message: `Your balance is ${balance}.`,
  });
});

router.post("/transfer", auth, async (req, res) => {
  const userId = req.userId;
  const { username, pay } = req.body;
  const userExists = await userModel.findOne({ username });
  if (!userExists) {
    return res
      .status(411)
      .json({ message: "The user you want to pay does not exist." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const dataFrom = await accountModel.findOne({ userId: req.userId });
  if (dataFrom.balance < pay || pay <= 0) {
    await session.abortTransaction();
    return res.status(400).json({ message: "Insufficient balance." });
  }

  try {
    await accountModel.updateOne(
      { userId: userExists._id },
      { $inc: { balance: pay } },
      { session },
    );
    await accountModel.updateOne(
      { userId },
      { $inc: { balance: -pay } },
      { session },
    );
    await session.commitTransaction();
    res.json({
      message: "Transfer Successful.",
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Transfer Failed." });
  } finally {
    session.endSession();
  }
});

module.exports = router;
