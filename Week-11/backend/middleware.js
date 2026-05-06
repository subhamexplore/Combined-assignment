const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require('./config')

function auth(req, res, next) {
    const token = req.headers.token
    if(!token){
        return res.status(403).json({message: "Token not found."})
    }
    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId
    if(userId){
        req.userId = userId
        next()
    }else{
        return res.status(403).json({message: "Token was incorrect."})
    }
}

module.exports = { auth };
