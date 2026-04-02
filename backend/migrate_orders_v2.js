const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Minhhieu11012004",
  database: "ecommerce_db",
});

db.connect(err => {
  if (err) { console.error(err.message); process.exit(1); }
  
  const queries = [
    "ALTER TABLE orders ADD COLUMN status VARCHAR(50) DEFAULT 'Đang xác nhận' AFTER user_id;",
    "ALTER TABLE orders ADD COLUMN fullname VARCHAR(255) AFTER status;",
    "ALTER TABLE orders ADD COLUMN phone VARCHAR(20) AFTER fullname;",
    "ALTER TABLE orders ADD COLUMN address TEXT AFTER phone;"
  ];

  let completed = 0;
  queries.forEach(q => {
    db.query(q, (err) => {
      if (err) console.log(`Skipping or Error on query (${q}):`, err.message);
      else console.log(`Success: ${q}`);
      
      completed++;
      if (completed === queries.length) {
        db.end();
        process.exit(0);
      }
    });
  });
});
