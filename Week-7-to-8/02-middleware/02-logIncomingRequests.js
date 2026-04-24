//  Create a middleware that logs all incoming requests to the console.

const express = require("express");
const app = express();

function logRequests(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
}

app.use(logRequests);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello, world!" });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

module.exports = app;
