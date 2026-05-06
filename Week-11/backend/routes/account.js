const express = require("express");
const router = express.Router();
const {auth} = require('../middleware')
const { userModel, accountModel } = require("../db");

router.get("/balance", auth, async (req, res) => {
    const userId = req.userId
    const data = await accountModel.findOne({userId})
    const balance = data.balance
    res.json({
        message: `Your balance is ${balance}.`
    })
})

router.post("/transfer", auth, async (req, res) => {
    const userId = req.userId
    const {username, pay} = req.body
    const userExists = await userModel.findOne({username})
    if(!userExists){
        return res.status(411).json({message: "The user you want to pay does not exist."})
    }

    const dataFrom = await accountModel.findOne({userId})
    const dataTo = await accountModel.findOne({userId: userExists._id})
    let balanceFrom = dataFrom.balance - pay
    let balanceTo = dataTo.balance + pay
    
    await accountModel.updateOne({userId: userExists._id}, {balance: balanceTo})
    await accountModel.updateOne({userId}, {balance: balanceFrom})
    res.json({
        message: `${pay} was debited to ${username}.`
    })
})

module.exports = router;
