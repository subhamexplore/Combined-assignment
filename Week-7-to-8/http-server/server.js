import express from "express";

const app = express();
let id = 0;
let todos = [];

app.use((req, res, next) => {
  let data = "";
  req.on("data", (chunk) => { data += chunk; });
  req.on("end", () => {
    try {
      req.body = data ? JSON.parse(data) : {};
    } catch {
      req.body = {};
    }
    next();
  });
});

function assignId(req, res, next) {
  id++;
  next();
}

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.post("/create/todo", assignId, (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  todos.push({ id: id, title: title, description: description });
  res.send(todos);
});
app.get("/todos", (req, res) => {
  res.send(todos);
});
app.get("/todo", (req, res) => {
  const paramId = parseInt(req.query.id);
  if (isNaN(paramId)) {
    return res.status(404).json({ error: "Todo not found" });
  }
  const todoById = todos.find((each) => each.id === paramId);
  if (!todoById) {
    res.status(404).json({ error: "Todo not found" });
  } else {
    res.json(todoById);
  }
});
app.delete("/todo", (req, res) => {
  const paramId = parseInt(req.query.id);
  if (isNaN(paramId)) {
    return res.status(404).json({ error: "Todo not found" });
  }
  const todoExists = todos.find((each) => each.id === paramId);
  if (!todoExists) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos = todos.filter((each) => each.id !== paramId);
  res.status(200).send(todos);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
