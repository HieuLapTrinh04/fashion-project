const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middleware/authMiddleware");
const isAdmin = require("./middleware/isAdmin");
const path = require("path");
const multer = require("multer");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Minhhieu11012004",
  database: process.env.DB_NAME || "ecommerce_db",
  port: process.env.DB_PORT || 3306,
};

// Aiven MySQL requires SSL. If we are not connecting to localhost, enable SSL.
if (dbConfig.host !== "localhost") {
  dbConfig.ssl = {
    rejectUnauthorized: false
  };
}

const db = mysql.createConnection(dbConfig);

// Cấu hình lưu trữ ảnh đại diện
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadAvatar = multer({ storage: avatarStorage });

// Phục vụ folder uploads làm static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("MySQL connected");
  }
});

// Thêm sản phẩm
app.post("/products", verifyToken, isAdmin, (req, res) => {
  const { name, description, price, stock, image, category, brand, old_price, rating, sold_count, discount_percent, gender } = req.body;
  // Validate cơ bản
  if (!name || !price || stock === undefined) {
    return res.status(400).json({ message: "Thiếu thông tin sản phẩm (name, price, stock)" });
  }

  // Nếu không có image, dùng placeholder mặc định
  const finalImage = image || 'https://placehold.co/600x800/f3f4f6/6b7280?text=Aura+Fashion';

  const sql = `
    INSERT INTO products (name, description, price, image, stock, category, brand, old_price, rating, sold_count, discount_percent, gender, sizes, images) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, description || '', price, finalImage, stock, category || 'Khác', brand || 'Aura Fashion', old_price || null, rating || 5.0, sold_count || 0, discount_percent || 0, gender || 'Cả hai', req.body.sizes || 'S,M,L,XL', req.body.images || ''],

    (err, result) => {
      if (err) {
        console.error("Lỗi khi thêm sản phẩm:", err.message);
        return res.status(500).json({ message: "Lỗi khi thêm sản phẩm vào database" });
      }
      res.status(201).json({ 
        message: "Thêm sản phẩm thành công!", 
        id: result.insertId 
      });
    }
  );
});

// Xem danh sách sản phẩm
app.get("/products", (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Lỗi khi lấy danh sách sản phẩm");
    res.json(results);
  });
});

app.get("/admin/products", verifyToken, isAdmin, (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Lỗi khi lấy danh sách sản phẩm");
    res.json(results);
  });
});

// API: Lấy danh sách thời trang (Trang 1: Nữ)
app.get("/products/pageFashion", (req, res) => {
  const query = "SELECT * FROM products WHERE gender LIKE ? OR (gender LIKE 'Cả hai' AND (name LIKE ? OR category LIKE ? OR description LIKE ?))";
  const params = ['%Nữ%', '%váy%', '%đầm%', '%nữ%'];
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// API: Lấy danh sách thời trang (Trang 2: Nam)
app.get("/products/pageGiay", (req, res) => {
  const query = "SELECT * FROM products WHERE gender LIKE ? OR (gender LIKE 'Cả hai' AND (name LIKE ? OR category LIKE ? OR description LIKE ?))";
  const params = ['%Nam%', '%nam%', '%sơ mi%', '%vest%'];
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// API: Lấy danh sách thời trang (Trang 3: Mới)
app.get("/products/pageAccessories", (req, res) => {
  const query = "SELECT * FROM products ORDER BY id DESC LIMIT 8";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Xóa sản phẩm
app.delete("/products/:id", verifyToken, isAdmin, (req, res) => {
  const productId = req.params.id;
  const query = "DELETE FROM products WHERE id = ?";
  db.query(query, [productId], (err, result) => {
    if (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      return res.status(500).send("Lỗi khi xóa sản phẩm");
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    res.status(200).json({ message: "Xóa sản phẩm thành công!" });
  });
});


// Lấy chi tiết 1 sản phẩm
app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(results[0]);
  });
});


// API thanh toán
app.post("/checkout", verifyToken, (req, res) => {
  const { totalPrice, fullname, address, phone, notes } = req.body;
  const userId = req.user.id;

  if (!totalPrice || !fullname || !address || !phone) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin giao hàng!" });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ message: "Lỗi khởi tạo giao dịch!" });

    // 1. Tạo bản ghi đơn hàng
    const insertOrderQuery = `
      INSERT INTO orders (user_id, total_price, fullname, address, phone, notes, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'Đang xác nhận', NOW())
    `;

    db.query(insertOrderQuery, [userId, totalPrice, fullname, address, phone, notes || ''], (err, orderResult) => {
      if (err) {
        console.error("SQL Error during checkout:", err.message);
        return db.rollback(() => res.status(500).json({ message: "Lỗi khi tạo đơn hàng!" }));
      }

      const orderId = orderResult.insertId;

      // 2. Chép tất cả các món từ Cart của user này sang order_items
      const fetchcartQuery = "SELECT product_id, name, price, image, quantity, size FROM cart WHERE user_id = ?";
      db.query(fetchcartQuery, [userId], (err, cartItems) => {
        if (err || cartItems.length === 0) {
          return db.rollback(() => res.status(500).json({ message: "Không tìm thấy sản phẩm trong giỏ để thanh toán!" }));
        }

        // Tạo câu query insert hàng loạt
        const insertItemsQuery = "INSERT INTO order_items (order_id, product_id, name, price, image, quantity, size) VALUES ?";
        const values = cartItems.map(item => [orderId, item.product_id, item.name, item.price, item.image, item.quantity, item.size || 'M']);


        db.query(insertItemsQuery, [values], (err) => {
          if (err) {
            return db.rollback(() => res.status(500).json({ message: "Lỗi khi lưu chi tiết sản phẩm đơn hàng!" }));
          }

          // 3. Xóa giỏ hàng của người dùng
          db.query("DELETE FROM cart WHERE user_id = ?", [userId], (err) => {
            if (err) {
              return db.rollback(() => res.status(500).json({ message: "Lỗi khi dọn dẹp giỏ hàng!" }));
            }

            db.commit((err) => {
              if (err) return db.rollback(() => res.status(500).json({ message: "Lỗi xác nhận giao dịch!" }));
              res.status(201).json({ message: "Thanh toán thành công!", orderId });
            });
          });
        });
      });
    });
  });
});

// Xem DANH SÁCH đơn hàng (ADMIN)
app.get("/orders", verifyToken, isAdmin, (req, res) => {
  const query = `
    SELECT 
      o.id, 
      u.username AS user,
      o.total_price AS total,
      o.status,
      o.fullname,
      o.phone,
      o.address,
      o.notes,
      o.created_at
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi lấy danh sách đơn hàng:", err);
      return res.status(500).json({ message: "Lỗi server khi lấy đơn hàng" });
    }
    res.json(results);
  });
});

// Xem CHI TIẾT đơn hàng (ADMIN)
app.get("/orders/:id", verifyToken, isAdmin, (req, res) => {
  const { id } = req.params;

  const orderQuery = `
    SELECT o.*, u.username as account_user 
    FROM orders o 
    LEFT JOIN users u ON o.user_id = u.id 
    WHERE o.id = ?
  `;

  db.query(orderQuery, [id], (err, orderResults) => {
    if (err || orderResults.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    }

    const order = orderResults[0];

    // Lấy danh sách sản phẩm trong đơn hàng từ order_items
    const itemsQuery = "SELECT * FROM order_items WHERE order_id = ?";
    db.query(itemsQuery, [id], (err, itemResults) => {
      if (err) return res.status(500).json({ message: "Lỗi lấy chi tiết sản phẩm!" });

      order.items = itemResults;
      res.json(order);
    });
  });
});

// Cập nhật TRẠNG THÁI đơn hàng (ADMIN)
app.patch("/orders/:id/status", verifyToken, isAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Thiếu trạng thái cập nhật!" });

  db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id], (err) => {
    if (err) return res.status(500).json({ message: "Lỗi cập nhật trạng thái!" });
    res.json({ message: "Cập nhật trạng thái thành công" });
  });
});

// HỦY / XÓA đơn hàng (ADMIN)
app.delete("/orders/:id", verifyToken, isAdmin, (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM orders WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Lỗi khi xóa đơn hàng!" });
    res.json({ message: "Xóa đơn hàng thành công" });
  });
});

// Lấy danh sách sản phẩm trong giỏ hàng
app.get("/cart", verifyToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM cart WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi lấy giỏ hàng" });
      }
      res.json(results);
    }
  );
});


// Thêm sản phẩm vào cart
app.post("/cart", verifyToken, (req, res) => {
  const { product_id, name, price, image, quantity, size } = req.body;
  const userId = req.user.id; 

  // 1️⃣ Kiểm tra sản phẩm có tồn tại không
  const checkProductQuery = "SELECT id FROM products WHERE id = ?";
  db.query(checkProductQuery, [product_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi kiểm tra sản phẩm" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Sản phẩm không tồn tại" });
    }

    // 2️⃣ Kiểm tra sản phẩm có cùng size đã có trong giỏ hàng của USER CHƯA
    const checkcartQuery =
      "SELECT id, quantity FROM cart WHERE product_id = ? AND user_id = ? AND size = ?";
    db.query(checkcartQuery, [product_id, userId, size || 'M'], (err, cartResults) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi kiểm tra giỏ hàng" });
      }

      if (cartResults.length > 0) {
        // 3️⃣ Nếu đã có → cộng số lượng
        const updateQuery =
          "UPDATE cart SET quantity = quantity + ? WHERE id = ?";
        db.query(updateQuery, [quantity, cartResults[0].id], (err) => {
          if (err) {
            console.error("SQL Error (Update cart):", err.message);
            return res.status(500).json({ message: "Lỗi cập nhật giỏ hàng" });
          }
          res.json({ message: "Cập nhật số lượng thành công!" });
        });
      } else {
        // 4️⃣ Nếu chưa có → thêm mới
        const insertQuery = `
          INSERT INTO cart (user_id, product_id, name, price, image, quantity, size)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(
          insertQuery,
          [
            userId, 
            product_id, 
            name || 'Sản phẩm', 
            price || 0, 
            image || 'https://placehold.co/600x800/f3f4f6/6b7280?text=Product', 
            quantity || 1, 
            size || 'M'
          ],
          (err) => {
            if (err) {
              console.error("SQL Error (Insert cart):", err.message);
              return res.status(500).json({ message: "Lỗi thêm vào giỏ hàng" });
            }
            res.status(201).json({ message: "Thêm vào giỏ hàng thành công!" });
          }
        );
      }
    });
  });
});


// Xóa sản phẩm khỏi giỏ hàng
app.delete("/cart/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const deleteQuery = "DELETE FROM cart WHERE id = ?";
  db.query(deleteQuery, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi xóa sản phẩm!", error: err });
    }
    res.json({ message: "Xóa sản phẩm thành công!" });
  });
});

// Cập nhật số lượng sản phẩm
app.put("/cart/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const updateQuery = "UPDATE cart SET quantity = ? WHERE id = ?";
  db.query(updateQuery, [quantity, id], (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Lỗi cập nhật số lượng!", error: err });
    }
    res.json({ message: "Cập nhật số lượng thành công!" });
  });
});

// Đăng ký
app.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const query =
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(query, [username, email, hashedPassword, role || "user"], (err) => {
    if (err) return res.status(500).send("Lỗi");
    res.send("OK");
  });
});

// Đăng nhập
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Lỗi server:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server, vui lòng thử lại sau" });
    }

    // Trường hợp email không tồn tại
    if (results.length === 0) {
      console.log("Email không tồn tại:", email);
      return res.status(401).json({ message: "Email không tồn tại" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    // Trường hợp mật khẩu sai
    if (!isMatch) {
      console.log("Sai mật khẩu cho email:", email);
      return res.status(401).json({ message: "Sai mật khẩu" });
    }

    // Trả về token khi thông tin chính xác
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role, // 👈 THÊM ROLE
      },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    console.log("Đăng nhập thành công:", email);
    return res
      .status(200)
      .json({ token, role: user.role, message: "Đăng nhập thành công" });
  });
});

app.get("/profile", verifyToken, (req, res) => {
  const userId = req.user.id;
  db.query("SELECT id, username, email, role, fullname, phone, avatar FROM users WHERE id = ?", [userId], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(results[0]);
  });
});

// Cập nhật thông tin cơ bản
app.patch("/profile", verifyToken, (req, res) => {
  const userId = req.user.id;
  const { fullname, phone, email } = req.body;
  
  db.query(
    "UPDATE users SET fullname = ?, phone = ?, email = ? WHERE id = ?",
    [fullname, phone, email, userId],
    (err) => {
      if (err) return res.status(500).json({ message: "Lỗi cập nhật hồ sơ" });
      res.json({ message: "Cập nhật thành công" });
    }
  );
});

// Tải ảnh đại diện
app.post("/profile/avatar", verifyToken, uploadAvatar.single("avatar"), (req, res) => {
  const userId = req.user.id;
  if (!req.file) return res.status(400).json({ message: "Vui lòng chọn ảnh" });
  
  const avatarUrl = `http://localhost:3000/uploads/avatars/${req.file.filename}`;
  db.query("UPDATE users SET avatar = ? WHERE id = ?", [avatarUrl, userId], (err) => {
    if (err) return res.status(500).json({ message: "Lỗi lưu ảnh đại diện" });
    res.json({ message: "Tải ảnh thành công", avatar: avatarUrl });
  });
});

// Đổi mật khẩu
app.patch("/profile/password", verifyToken, (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;
  
  db.query("SELECT password FROM users WHERE id = ?", [userId], async (err, results) => {
    if (results.length === 0) return res.status(404).json({ message: "User không tồn tại" });
    
    const isMatch = await bcrypt.compare(oldPassword, results[0].password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
    
    const hashedNew = await bcrypt.hash(newPassword, 10);
    db.query("UPDATE users SET password = ? WHERE id = ?", [hashedNew, userId], (err) => {
      if (err) return res.status(500).json({ message: "Lỗi khi đổi mật khẩu" });
      res.json({ message: "Đổi mật khẩu thành công" });
    });
  });
});

app.get("/my-orders", verifyToken, (req, res) => {
  const userId = req.user.id;
  
  // 1. Lấy danh sách đơn hàng
  const ordersQuery = `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`;
  
  db.query(ordersQuery, [userId], (err, orders) => {
    if (err) return res.status(500).json({ message: "Lỗi lấy đơn hàng của bạn" });
    if (orders.length === 0) return res.json([]);

    // 2. Lấy tất cả các món hàng của các đơn hàng này
    const orderIds = orders.map(o => o.id);
    const itemsQuery = `SELECT * FROM order_items WHERE order_id IN (?)`;
    
    db.query(itemsQuery, [orderIds], (err, items) => {
      if (err) {
        console.error("Lỗi lấy order_items:", err);
        return res.status(500).json({ message: "Lỗi lấy chi tiết sản phẩm đơn hàng" });
      }

      console.log(`Đã tìm thấy ${items.length} sản phẩm cho ${orders.length} đơn hàng.`);

      // 3. Gắn items vào đúng order tương ứng
      const ordersWithItems = orders.map(order => {
        const orderItems = items.filter(item => Number(item.order_id) === Number(order.id));
        return {
          ...order,
          items: orderItems,
          showItems: true // Cho hiện sẵn mặc định
        };
      });

      res.json(ordersWithItems);
    });
  });
});

app.get("/admin/dashboard", verifyToken, isAdmin, (req, res) => {
  res.json({
    message: "Chào admin",
  });
});

app.get("/users", (req, res) => {
  db.query("SELECT id,username,email,role FROM users", (err, rs) => {
    if (err) return res.sendStatus(500);
    res.json(rs);
  });
});

// Sửa sản phẩm (ADMIN)
app.put("/products/:id", verifyToken, isAdmin, (req, res) => {
  const { name, description, price, stock, image, category, brand, old_price, rating, sold_count, discount_percent, gender } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE products 
    SET name=?, description=?, price=?, stock=?, image=?, category=?, brand=?, old_price=?, rating=?, sold_count=?, discount_percent=?, gender=?, sizes=?, images=?
    WHERE id=?
  `;

  db.query(sql, [name, description, price, stock, image, category, brand, old_price, rating, sold_count, discount_percent, gender, req.body.sizes, req.body.images, id], (err) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi sửa sản phẩm" });
    }
    res.json({ message: "Cập nhật sản phẩm thành công" });
  });
});


app.put("/users/:id/role", verifyToken, isAdmin, (req, res) => {
  db.query(
    "UPDATE users SET role = ? WHERE id = ?",
    [req.body.role, req.params.id],
    (err) => {
      if (err) return res.sendStatus(500);
      res.send("Updated");
    }
  );
});

// Cập nhật thông tin User (ADMIN)
app.put("/users/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { username, email, role, password } = req.body;

  try {
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = "UPDATE users SET username=?, email=?, role=?, password=? WHERE id=?";
      db.query(sql, [username, email, role, hashedPassword, id], (err) => {
        if (err) return res.status(500).json({ message: "Lỗi cập nhật user (có pass)" });
        res.json({ message: "Cập nhật user thành công" });
      });
    } else {
      const sql = "UPDATE users SET username=?, email=?, role=? WHERE id=?";
      db.query(sql, [username, email, role, id], (err) => {
        if (err) return res.status(500).json({ message: "Lỗi cập nhật user (không pass)" });
        res.json({ message: "Cập nhật user thành công" });
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi hash password" });
  }
});

// Xóa User (ADMIN)
app.delete("/users/:id", verifyToken, isAdmin, (req, res) => {
  const { id } = req.params;
  
  // Không cho phép tự xóa chính mình nếu cần (log từ req.user.id)
  if (id == req.user.id) {
    return res.status(400).json({ message: "Bạn không thể tự xóa tài khoản của chính mình!" });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ message: "Lỗi transaction khi xóa user" });

    // 1. Xóa giỏ hàng
    db.query("DELETE FROM Cart WHERE user_id = ?", [id], (err) => {
      if (err) return db.rollback(() => res.status(500).json({ message: "Lỗi khi xóa giỏ hàng của user" }));

      // 2. Xóa đơn hàng (Có thể cần xóa detail nếu có, nhưng hiện tại chỉ có table orders)
      db.query("DELETE FROM orders WHERE user_id = ?", [id], (err) => {
        if (err) return db.rollback(() => res.status(500).json({ message: "Lỗi khi xóa đơn hàng của user" }));

        // 3. Cuối cùng mới xóa user
        db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
          if (err) return db.rollback(() => res.status(500).json({ message: "Lỗi khi xóa tài khoản người dùng" }));

          db.commit((err) => {
            if (err) return db.rollback(() => res.status(500).json({ message: "Lỗi commit khi xóa user" }));
            res.json({ message: "Xóa người dùng và dữ liệu liên quan thành công" });
          });
        });
      });
    });
  });
});


app.get("/products/search", (req, res) => {
  const { q } = req.query;

  db.query(
    "SELECT * FROM products WHERE name LIKE ?",
    [`%${q}%`],
    (err, results) => {
      if (err) return res.status(500).send("Lỗi tìm kiếm");
      res.json(results);
    }
  );
});


app.get("/admin/stats", verifyToken, isAdmin, (req, res) => {
  const stats = {};

  // 1. Tổng kết số lượng cơ bản
  db.query("SELECT COUNT(*) totalusers FROM users", (err, rs1) => {
    if (err) {
      console.error("Stats Error users:", err);
      return res.status(500).json({ message: "Lỗi đếm người dùng" });
    }
    stats.users = rs1[0].totalusers;

    db.query("SELECT COUNT(*) totalOrders FROM orders", (err, rs2) => {
      if (err) {
        console.error("Stats Error Orders:", err);
        return res.status(500).json({ message: "Lỗi đếm đơn hàng" });
      }
      stats.orders = rs2[0].totalOrders;

      db.query("SELECT SUM(total_price) revenue FROM orders", (err, rs3) => {
        if (err) {
          console.error("Stats Error Revenue:", err);
          return res.status(500).json({ message: "Lỗi tính doanh thu" });
        }
        stats.revenue = rs3[0].revenue || 0;
        
        db.query("SELECT COUNT(*) totalProducts FROM Products", (err, rs4) => {
          if (err) {
            console.error("Stats Error Products:", err);
            return res.status(500).json({ message: "Lỗi đếm sản phẩm" });
          }
          stats.products = rs4[0].totalProducts;

          // 2. Lấy dữ liệu biểu đồ doanh thu (7 ngày gần nhất)
          const chartQuery = `
            SELECT DATE_FORMAT(created_at, '%d/%m') as date, SUM(total_price) as daily_revenue 
            FROM orders 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
            GROUP BY date 
            ORDER BY MIN(created_at) ASC
          `;
          db.query(chartQuery, (err, rsChart) => {
            if (err) {
              console.error("Stats Error Chart:", err);
              // Vẫn trả về data các phần khác nếu chart lỗi
              stats.chartData = [];
            } else {
              stats.chartData = rsChart;
            }

            // 3. Lấy Top 5 sản phẩm bán chạy
            const topSellerQuery = `
              SELECT name, image, SUM(quantity) as sold, SUM(price * quantity) as income
              FROM order_items
              GROUP BY name, image
              ORDER BY sold DESC
              LIMIT 5
            `;
            db.query(topSellerQuery, (err, rsTop) => {
              if (err) {
                console.error("Stats Error Top Sellers:", err);
                stats.bestSellers = [];
              } else {
                stats.bestSellers = rsTop;
              }
              res.json(stats);
            });
          });
        });
      });
    });
  });
});

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
