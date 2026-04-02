const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Minhhieu11012004",
  database: "ecommerce_db",
});
db.connect(err => {
  if (err) { console.error(err); process.exit(1); }
  db.query("DESCRIBE Products", (err, res) => {
    if (err) console.error("DESCRIBE Products Error:", err.message);
    else console.log("Products Columns:", res.map(c => c.Field));
    process.exit(0);
  });
});
