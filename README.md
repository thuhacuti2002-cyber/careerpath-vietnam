# CareerPath Vietnam

Nền tảng định hướng nghề nghiệp tiếng Việt cho học sinh THPT và sinh viên.

## Stack
- Frontend: React 18 + Vite
- Backend: Node.js + Express
- Database: SQLite (`better-sqlite3`)
- Auth: bcrypt + JWT trong cookie HttpOnly
- Validation: Zod, Helmet, rate limiting
- Guest mode: dữ liệu chỉ nằm trong `sessionStorage` trên trình duyệt
- AI Coach: mock fallback; có adapter server-side để kết nối nhà cung cấp AI

## Chạy local
Yêu cầu Node.js 20+.

```bash
cp .env.example .env
npm install
npm run dev
```

Frontend: http://localhost:5173  
API: http://localhost:4000/api/health

## Cấu trúc
```text
careerpath-vietnam/
├── client/                 # React UI
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   └── styles.css
│   └── index.html
├── server/
│   ├── db.js
│   ├── index.js
│   ├── middleware/
│   ├── routes/
│   └── services/
├── .env.example
└── package.json
```

## Chức năng trong bản starter
- Dashboard responsive, thanh điều hướng và chat nổi.
- Guest mode không gọi API lưu trữ; kết quả giữ trong sessionStorage.
- Đăng ký/đăng nhập; bcrypt; JWT cookie HttpOnly, SameSite.
- Bài test 24 câu (6 Holland + 9 kỹ năng + 9 giá trị/ưu tiên).
- Matching 8 vị trí nghề nghiệp, hiển thị % phù hợp tương đối trong nhóm kết quả.
- Trang chi tiết nghề: công việc, ngành/khối xét tuyển tham khảo, lương tham khảo, kỹ năng, kế hoạch 6 tháng.
- AI Coach có quick replies, lấy Holland context hiện tại; mock fallback.
- Lưu chat theo phiên khi đăng nhập; xóa phiên.
- Báo cáo phụ huynh dạng trang in, có thể Save as PDF.
- Privacy notice, xóa toàn bộ dữ liệu tài khoản.

## Các bước cần làm trước production
1. Thay SQLite bằng PostgreSQL và bật backup/retention policy.
2. Bổ sung CSRF protection (double-submit token hoặc synchronizer token) khi dùng cookie auth; cấu hình CORS chính xác theo domain.
3. Bổ sung xác minh email, reset mật khẩu, MFA tùy mức rủi ro.
4. Dùng HTTPS, secrets manager, log không chứa PII, giám sát và cảnh báo.
5. Đánh giá DPIA/đánh giá tác động xử lý dữ liệu, quy trình yêu cầu chủ thể dữ liệu, thông báo vi phạm và hợp đồng với bên xử lý.
6. Rà soát pháp luật Việt Nam hiện hành tại ngày triển khai. Nghị định 13/2023/NĐ-CP là một căn cứ, không nên coi là checklist pháp lý duy nhất.
7. Kiểm chứng dữ liệu lương theo ngành, địa bàn, thời điểm và nguồn khảo sát trước khi công bố. Các con số demo trong `careers.js` chỉ là dải tham khảo minh họa, không phải cam kết tuyển dụng.
8. Bộ câu hỏi này là công cụ định hướng tham khảo, không phải bài đánh giá tâm lý/chẩn đoán đã được chuẩn hóa hoặc kiểm định tâm trắc.

## API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/assessments` (đăng nhập mới lưu server)
- `GET /api/assessments/latest`
- `POST /api/chat` (đăng nhập lưu theo session; guest không gửi tới server)
- `GET /api/chat/:sessionId`
- `DELETE /api/chat/:sessionId`
- `DELETE /api/privacy/data`

## Ghi chú bảo mật
- Không có API key ở frontend.
- Input được validate bằng Zod; React render text như text, không dùng `dangerouslySetInnerHTML`.
- Mọi truy vấn dữ liệu riêng tư đều lọc theo `user_id` từ JWT.
- Rate limit auth và chat.
- Cookie JWT HttpOnly; secret bắt buộc qua `.env`.
- Bản demo chưa thay thế kiểm thử bảo mật độc lập, rà soát pháp lý, hay vận hành production.


## Triển khai website công khai
Xem hướng dẫn chi tiết tại `DEPLOY-RENDER-VI.md`. Dự án đã có `render.yaml` để tạo dịch vụ Render gồm frontend, API và Persistent Disk.
