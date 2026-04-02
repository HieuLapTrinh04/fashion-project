const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Minhhieu11012004",
  database: "ecommerce_db",
});

const products = [
  {
    name: "Áo Blazer Linen Aura",
    description: "Chất liệu Linen cao cấp, thoáng mát, phong cách thanh lịch hiện đại.",
    price: 1850000,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop",
    stock: 25,
    category: "Áo khoác",
    brand: "Aura Premium",
    gender: "Cả hai",
    discount_percent: 10
  },
  {
    name: "Váy Lụa Satin Cao Cấp",
    description: "Váy lụa Satin mịn màng, tôn dáng, phù hợp cho các buổi tiệc tối.",
    price: 2450000,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop",
    stock: 15,
    category: "Váy",
    brand: "Aura Elegance",
    gender: "Nữ",
    discount_percent: 0
  },
  {
    name: "Quần Âu Slim Fit Navy",
    description: "Form dáng chuẩn, chất vải đứng form, không nhăn.",
    price: 950000,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1974&auto=format&fit=crop",
    stock: 40,
    category: "Quần",
    brand: "Aura Office",
    gender: "Nam",
    discount_percent: 5
  },
  {
    name: "Áo Sơ Mi Lụa Cổ V",
    description: "Sơ mi lụa mềm mại, cổ V quyến rũ, nhiều màu sắc lựa chọn.",
    price: 750000,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=1971&auto=format&fit=crop",
    stock: 30,
    category: "Áo sơ mi",
    brand: "Aura Daily",
    gender: "Nữ",
    discount_percent: 0
  }
];

db.connect(err => {
  if (err) {
    console.error("Kết nối thất bại:", err.message);
    process.exit(1);
  }
  console.log("Đã kết nối MySQL...");

  const sql = "INSERT INTO Products (name, description, price, image, stock, category, brand, gender, discount_percent, sizes) VALUES ?";
  const values = products.map(p => [p.name, p.description, p.price, p.image, p.stock, p.category, p.brand, p.gender, p.discount_percent, "S,M,L,XL"]);

  db.query(sql, [values], (err, rs) => {
    if (err) {
      console.error("Lỗi khi chèn dữ liệu:", err.message);
    } else {
      console.log(`Đã thêm thành công ${rs.affectedRows} sản phẩm mới nhất vào Database!`);
    }
    db.end();
  });
});
