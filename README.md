# Lời chúc ngày 20/10

Ảnh, poster, video và nhạc trên các trang hiện tải trực tiếp từ S3 tại `https://nestjs-ecommerce-kiendev.s3.ap-southeast-1.amazonaws.com/`. Các đường dẫn được đặt trong `matrix-pro.html`, `media-reel.html` và `flower.html`; khi thay media đang hiển thị, cập nhật URL tương ứng tại đây. Các tệp trong `assets/` vẫn được giữ làm bản gốc.

Mở `index.html` để nhập mã **2409**. Luồng hiển thị: **mở khóa và pháo hoa → bó hoa xoay, nở → ảnh/video lần lượt chạy từ dưới lên → intro Matrix → màn hình chính**.

`bouquet.html`, `bouquet.css` và `bouquet.js` dựng bó hoa SVG gồm 9 bông, xoay nhẹ và nở từng lớp trong 6,5 giây. Sau đó `media-reel.html` phát dải kỷ niệm một lượt theo thứ tự em1–em9: 7 video và 2 ảnh. Dải chạy trong khoảng 26–42 giây tùy kích thước màn hình; chỉ khi đi hết mới tự chuyển tới intro. Có nút tạm dừng/tiếp tục và nút đi tiếp. Video chỉ tự phát không tiếng khi xuất hiện trong vùng nhìn thấy; chuyển tab sẽ tạm dừng cảnh.

Khi bật Reduce Motion, bó hoa hiện đầy đủ rồi chuyển sang danh sách ảnh/video tĩnh để cuộn và phát thủ công. Bấm **Đến lời chúc** để tới intro.

Dải kỷ niệm bố trí khung xen kẽ trái–phải, đung đưa nhẹ với 16 bông hoa rơi phía sau. Nhạc nền dùng `assets/chờ chút (cut).mp3`, chỉ phát trong cảnh này. Nút **Bật nhạc/Tắt nhạc** điều khiển âm thanh; nếu trình duyệt chặn tự phát, chạm **Bật nhạc**. Tạm dừng cảnh hoặc ẩn tab sẽ dừng nhạc; chuyển sang intro dừng và đưa bài nhạc về đầu. Reduce Motion tắt hoa rơi và đung đưa.

Màn nhập mã hỗ trợ bàn phím số trên trang, bàn phím máy tính và ô nhập mã gốc. Nút × xóa số cuối. Nhập sai sẽ báo nhẹ rồi xóa mã sau 650 ms để thử lại. Trạng thái mở quà được lưu trong `sessionStorage` của tab; mở lại `index.html` sẽ yêu cầu nhập mã lại. Các trang bó hoa, dải kỷ niệm, intro và màn hình chính dùng `access.js` để quay về màn nhập mã khi chưa mở quà.

`passcode.css` và `passcode.js` điều khiển màn nhập mã. Pháo hoa dùng lại `effects/firework.js`, chỉ khởi chạy khi mã đúng. Đổi mã tại hằng `PASSCODE` trong `passcode.js`.

- Bốn video đặt quanh phong thư, tự lặp không tiếng và nhấp nhô nhẹ. Bấm từng video để xem lớn bằng trình phát có điều khiển, kèm lời chúc riêng.
- Bấm phong thư hoặc **Mở thư gửi em** để đọc thư đầy đủ.
- Khi mở thiệp, lời chúc xuất hiện từng chữ, có nhịp nghỉ ở dấu câu; chữ ký hiện sau cùng. Chạm vào nội dung thiệp hoặc nút **Chạm để xem hết lời chúc** để hiện toàn bộ ngay. Đóng rồi mở lại sẽ chạy từ đầu. Người dùng bật Reduce Motion được xem nội dung đầy đủ ngay.
- Đóng lời chúc bằng nút ×, phím Esc hoặc bấm ra ngoài. Focus trở lại nút vừa mở.
- Màn hình thấp cho phép cuộn để không cắt mất thư và các nút.

## Mobile

Điện thoại dọc dùng bố cục hai video phía trên, phong thư ở giữa và hai video phía dưới. Màn hình thấp cho phép cuộn. Trên máy tính hoặc điện thoại xoay ngang, bốn video chia thành hai cột bao quanh phong thư.

Hộp lời chúc cuộn độc lập, nút đóng bám phía trên và có vùng bấm 44 px. Nội dung chừa khoảng trống cho tai thỏ và thanh thao tác. Vườn hoa được giới hạn trong khung trang để không làm trình duyệt tự thu nhỏ bố cục. Intro giữ hiệu ứng cũ, canvas tự khớp kích thước khi xoay màn hình.

## Thay video và lời chúc

Thay bốn file `assets/em1.mp4` đến `assets/em4.mp4`, hoặc sửa đường dẫn trong `flower.html`. Các file `em1-poster.jpg` đến `em4-poster.jpg` là ảnh khung hình trích từ chính video, dùng khi clip chưa chạy hoặc autoplay bị chặn. Nếu thay clip, thay ảnh poster tương ứng để không hiện hình cũ. Video vuông sẽ hiển thị đầy đủ trong khung, không bị kéo giãn.

Sửa nội dung trong `greeting.js`: `left`, `right`, `third`, `fourth` tương ứng bốn video; `letter` là thư chính. Các lời chúc hiện tại là nội dung mẫu có thể cá nhân hóa.

`memories-video.css` điều khiển bố cục và chuyển động của khung video. Video xem trước tạm dừng khi nằm ngoài vùng nhìn thấy, khi tab bị ẩn hoặc khi mở lời chúc. Khi bật Reduce Motion, cả nhấp nhô và video tự phát đều dừng, nhưng vẫn mở và phát clip bằng nút điều khiển được. Phần video trong lời chúc không làm bỏ qua chữ chạy khi chạm điều khiển phát/dừng.

`greeting.css` điều khiển bố cục ảnh, phong thư và hộp lời chúc. `flower.css` giữ hình vườn hoa của mẫu HTML ban đầu; `garden-motion.css` điều khiển chuyển động mới. Các cụm cây hiện dần theo nhịp lệch nhau, hoàn tất sau khoảng 3 giây, sau đó đung đưa nhẹ cả thân và lá. Nhịp đung đưa dài 7–9,5 giây, lệch pha giữa các cụm, biên độ khoảng 0,9–1,2 độ mỗi bên. Chuyển động dùng CSS với `transform` và `opacity`, không tăng chiều cao thân cây theo từng khung hình. Bật Reduce Motion sẽ thấy vườn hoa đầy đủ ngay và tắt đung đưa.

Phong thư được dựng bằng CSS theo mẫu HTML1, không cần tải thư viện JavaScript ngoài. Font Google Fonts là tùy chọn; khi offline trang dùng font dự phòng và vẫn thao tác được.
