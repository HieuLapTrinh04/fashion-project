const mysql = require('mysql2');
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Minhhieu11012004",
  database: "ecommerce_db",
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
  db.query("DESCRIBE Cart", (err, results) => {
    if (err) {
      console.error("Describe Cart failed:", err);
    } else {
      console.log("CART SCHEMA:", JSON.stringify(results, null, 2));
    }
    db.end();
  });
});
