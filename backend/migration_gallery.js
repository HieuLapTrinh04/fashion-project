const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Minhhieu11012004",
  database: "ecommerce_db",
});

db.connect((err) => {
  if (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
  console.log('Connected to Database');

  const sql = "ALTER TABLE Products ADD COLUMN images TEXT";
  db.query(sql, (err) => {
    if (err) {
      if (err.errno === 1060) {
        console.log('Column "images" already exists.');
      } else {
        console.error('Migration error:', err);
      }
    } else {
      console.log('Column "images" added successfully!');
    }
    db.end();
    process.exit(0);
  });
});
