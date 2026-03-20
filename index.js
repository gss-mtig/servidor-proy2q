require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// TEST
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// CREATE
app.post("/items", async (req, res) => {
  const { name } = req.body;
  const result = await db.query(
    "INSERT INTO items(name) VALUES($1) RETURNING *",
    [name],
  );
  res.json(result.rows[0]);
});

// READ
app.get("/items", async (req, res) => {
  const result = await db.query("SELECT * FROM items");
  res.json(result.rows);
});

// UPDATE
app.put("/items/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const result = await db.query(
    "UPDATE items SET name=$1 WHERE id=$2 RETURNING *",
    [name, id],
  );

  res.json(result.rows[0]);
});

// DELETE
app.delete("/items/:id", async (req, res) => {
  const { id } = req.params;

  await db.query("DELETE FROM items WHERE id=$1", [id]);
  res.json({ message: "Deleted" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
