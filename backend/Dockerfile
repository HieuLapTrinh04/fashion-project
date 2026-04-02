# Tệp cấu hình đóng gói cho Google Cloud Run
# Sử dụng phiên bản Node.js 20 làm gốc
FROM node:20-slim

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Sao chép file cấu hình dependencies
COPY package*.json ./

# Cài đặt các thư viện cần thiết
RUN npm install --production

# Sao chép toàn bộ mã nguồn backend vào container
COPY . .

# Cho phép Cloud Run tiêm cổng dịch vụ (mặc định 8080)
ENV PORT=8080

# Mở cổng 8080
EXPOSE 8080

# Lệnh khởi chạy Server
CMD ["node", "server.js"]
