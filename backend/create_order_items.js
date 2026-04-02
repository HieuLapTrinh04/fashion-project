const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Minhhieu11012004",
  database: "ecommerce_db",
});

db.connect(err => {
  if (err) { console.error(err.message); process.exit(1); }
  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(15,2) NOT NULL,
      quantity INT NOT NULL,
      image TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) console.error("Error creating order_items:", err.message);
    else console.log("Success: Created order_items table.");
    db.end();
    process.exit(0);
  });
});
