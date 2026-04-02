const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Minhhieu11012004", // From server.js
  database: "ecommerce_db",
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
  console.log("MySQL connected. Adding 'notes' column to 'orders' table...");

  const sql = "ALTER TABLE orders ADD COLUMN notes TEXT AFTER phone";
  
  db.query(sql, (err) => {
    if (err) {
      if (err.code === 'ER_DUP_COLUMN_NAME') {
        console.log("Column 'notes' already exists.");
      } else {
        console.error("Error adding column:", err);
        process.exit(1);
      }
    } else {
      console.log("Column 'notes' added successfully!");
    }
    db.end();
  });
});
