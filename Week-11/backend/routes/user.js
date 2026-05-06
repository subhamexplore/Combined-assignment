const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware");

const { userModel, accountModel } = require("../db");

router.post("/signup", async (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  const userExists = await userModel.findOne({ username });
  if (userExists) {
    return res.status(411).json({
      message: "User with this username already exists",
    });
  } else {
    const createUser = await userModel.create({
      firstName,
      lastName,
      username,
      password,
    });
    await accountModel.create({
      userId: createUser._id,
      balance: 22500
    })
    res.json({
      id: createUser._id,
    });
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const userExists = await userModel.findOne({ username, password });
  if (!userExists) {
    return res.status(403).json({
      message: "Incorrect credentials",
    });
  }
  const token = jwt.sign({ userId: userExists._id }, process.env.JWT_SECRET);
  res.json({
    token,
  });
});

router.put("/", auth, async (req, res) => {
  const userId = req.userId;
  const { firstName, lastName, password } = req.body;
  await userModel.updateOne({ _id: userId }, { firstName, lastName, password });
  res.json({ message: "User updated successfully." });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter;
  const allData = await userModel.find();
  const filteredData = allData.filter((data) => {
    return (
      data.firstName.toLowerCase().includes(filter) ||
      data.lastName.toLowerCase().includes(filter)
    );
  });
  res.json({
    users: filteredData.map((data) => ({
      firstName: data.firstName,
      lastName: data.lastName,
      _id: data._id,
    })),
  });
});

module.exports = router;
