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
  
  db.query("DESCRIBE Cart", (err, res) => {
    if (err) {
      console.error("DESCRIBE Cart Error:", err.message);
      db.end();
      return;
    }
    
    const fields = res.map(f => f.Field);
    console.log("Current Cart Fields:", fields);
    
    if (!fields.includes("size")) {
      console.log("Adding 'size' column to Cart...");
      db.query("ALTER TABLE Cart ADD COLUMN size VARCHAR(10) DEFAULT 'M' AFTER quantity", (err2) => {
        if (err2) console.error("Error adding size column:", err2.message);
        else console.log("Size column added successfully.");
      });
    } else {
      console.log("'size' column already exists.");
    }
    
    console.log("Modifying 'image' column to TEXT...");
    db.query("ALTER TABLE Cart MODIFY COLUMN image TEXT", (err3) => {
      if (err3) console.error("Error modifying image column:", err3.message);
      else console.log("Image column modified successfully.");
      
      // End connection after all queries
      setTimeout(() => {
        console.log("Migration complete.");
        db.end();
      }, 1000);
    });
  });
});
