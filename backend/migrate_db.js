const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Minhhieu11012004",
  database: "ecommerce_db",
});

db.connect(err => {
  if (err) {
    console.error("Connection error:", err.message);
    process.exit(1);
  }
  console.log("Connected to database.");

  const queries = [
    "ALTER TABLE Cart ADD COLUMN user_id INT AFTER id;",
    "ALTER TABLE orders ADD COLUMN user_id INT AFTER id;"
  ];

  let completed = 0;
  queries.forEach(q => {
    db.query(q, (err) => {
      if (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
          console.log(`Column already exists in a query: ${q}`);
        } else {
          console.error(`Error executing query (${q}):`, err.message);
        }
      } else {
        console.log(`Success: ${q}`);
      }
      completed++;
      if (completed === queries.length) {
        db.end();
        console.log("Migration finished.");
        process.exit(0);
      }
    });
  });
});
