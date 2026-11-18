# Đưa CareerPath lên Internet bằng Render

## Mô hình triển khai
- Một Render Web Service phục vụ cả React build (`dist/`) và Express API (`/api`).
- SQLite đặt tại `/var/data/careerpath.sqlite`, nằm trên Persistent Disk.
- JWT được lưu trong cookie HttpOnly, cùng origin với website.
- `JWT_SECRET` được Render tự sinh; không đưa secret vào GitHub.

## Trước khi triển khai
1. Tạo tài khoản GitHub và Render.
2. Đưa toàn bộ thư mục `careerpath-vietnam` lên một GitHub repository riêng tư hoặc công khai.
3. Kiểm tra không commit file `.env`, database `.sqlite`, hoặc thông tin bí mật.
4. Trên Render, chọn **New → Blueprint**, kết nối repository và chọn file `render.yaml`.
5. Xem lại cấu hình và xác nhận tạo dịch vụ. Render sẽ build và deploy.
6. Khi deploy thành công, mở `https://careerpath-vietnam.onrender.com` và kiểm tra `/api/health`.

## Biến môi trường
Blueprint tự tạo `JWT_SECRET`. Các biến còn lại:
- `NODE_ENV=production`
- `DATABASE_PATH=/var/data/careerpath.sqlite`
- `CLIENT_ORIGIN=https://careerpath-vietnam.onrender.com`

Nếu đổi tên service/domain, cập nhật `CLIENT_ORIGIN` trong Render Environment thành domain thật rồi deploy lại.

## Chi phí và lưu trữ
Blueprint chọn web service gói Starter và Persistent Disk 1 GB. Render không hỗ trợ Persistent Disk trên web service Free; hệ thống Free dùng filesystem tạm và có thể mất SQLite khi restart/redeploy. Hãy kiểm tra giá hiện tại trên trang Render trước khi xác nhận. Đây là chi phí hạ tầng, chưa gồm domain riêng hay dịch vụ AI bên ngoài.

## Kiểm tra sau deploy
- Mở `/api/health`, kết quả mong đợi: `{"ok":true,"service":"CareerPath API"}`.
- Tạo tài khoản thử, đăng xuất/đăng nhập lại.
- Làm bài test, kiểm tra kết quả.
- Gửi tin nhắn AI Coach (bản hiện tại dùng câu trả lời mô phỏng nếu chưa cấu hình AI).
- Kiểm tra xóa dữ liệu tài khoản.
- Thử trên điện thoại và máy tính.

## Cảnh báo trước khi mở cho học sinh thật
Đây là bản starter/demo. Trước khi thu thập dữ liệu cá nhân của học sinh, cần hoàn thiện và kiểm thử độc lập tối thiểu:
- CSRF protection cho các thao tác dùng cookie xác thực.
- Xác minh email, khôi phục mật khẩu và quy trình hỗ trợ tài khoản.
- Sao lưu/khôi phục database và kiểm tra khả năng phục hồi.
- Chính sách lưu trữ/xóa dữ liệu, quy trình đồng ý phù hợp với độ tuổi và rà soát pháp lý Việt Nam.
- Kiểm thử phân quyền, rate limit, log không chứa dữ liệu cá nhân, bảo mật headers và cấu hình production.
- Xác minh dữ liệu lương, nội dung tư vấn và độ tin cậy của bộ câu hỏi trước khi dùng cho quyết định học tập/nghề nghiệp.

Không đưa API key vào biến `VITE_*` hoặc mã frontend. Nếu tích hợp AI, chỉ đặt key ở biến môi trường server-side.
