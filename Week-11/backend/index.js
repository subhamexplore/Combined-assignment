require("dotenv").config();
const express = require('express')
require("./db");

const PORT = process.env.PORT || 3000

const app = express();

app.use(express.json())
app.use("/api/v1", require('./routes'))

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})