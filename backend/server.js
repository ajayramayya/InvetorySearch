const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product TEXT,
    category TEXT,
    price INTEGER
  )`);

  db.run(`DELETE FROM inventory`);

  const stmt = db.prepare("INSERT INTO inventory (product, category, price) VALUES (?, ?, ?)");

  const data = [
    ["iPhone 13", "Electronics", 600],
    ["Samsung TV", "Electronics", 800],
    ["Nike Shoes", "Fashion", 120],
    ["Wooden Chair", "Furniture", 70]
  ];

  data.forEach(d => stmt.run(d));
  stmt.finalize();
});

app.get("/search", (req, res) => {
  let { q, category, minPrice, maxPrice } = req.query;

  let query = "SELECT * FROM inventory WHERE 1=1";
  let params = [];

  if (q) {
    query += " AND LOWER(product) LIKE ?";
    params.push(`%${q.toLowerCase()}%`);
  }

  if (category) {
    query += " AND LOWER(category) = ?";
    params.push(category.toLowerCase());
  }

  if (minPrice) {
    query += " AND price >= ?";
    params.push(Number(minPrice));
  }

  if (maxPrice) {
    query += " AND price <= ?";
    params.push(Number(maxPrice));
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
