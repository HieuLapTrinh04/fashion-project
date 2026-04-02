const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Minhhieu11012004",
  database: "ecommerce_db",
});
db.connect(err => {
  if (err) { console.error(err); process.exit(1); }
  db.query("DESCRIBE Cart", (err, res) => {
    if (err) console.error("DESCRIBE Cart Error:", err.message);
    else console.log("Cart Columns:", res.map(c => c.Field));
    
    db.query("DESCRIBE orders", (err, res) => {
        if (err) console.error("DESCRIBE orders Error:", err.message);
        else console.log("Orders Columns:", res.map(c => c.Field));
        
        db.query("DESCRIBE Users", (err, res) => {
            if (err) console.error("DESCRIBE Users Error:", err.message);
            else console.log("Users Columns:", res.map(c => c.Field));
            process.exit(0);
        });
    });
  });
});
