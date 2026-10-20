# Kiểm tra giao diện

Ngày kiểm tra: 16/10/2026. Chrome headless, dữ liệu ảnh có sẵn trong mẫu HTML.

## Bố cục và thao tác

- Các kích thước 1440×900, 768×1024, 390×844, 320×568 và 844×390: không tràn ngang, ảnh không bị cắt khỏi màn hình và không đè lên vùng phong thư.
- Cả hai ảnh tải được, bấm mở ảnh kèm đúng lời chúc riêng.
- Phong thư và nút bên dưới đều mở thư chính.
- Đóng bằng ×, Esc hoặc bấm nền ngoài; sau khi đóng bằng Esc, focus trở lại ảnh vừa mở.
- Trang nội dung mở trực tiếp bằng đường dẫn file và vẫn đọc lời chúc được.
- Luồng `index.html` → intro Matrix → `flower.html` hoạt động, không có lỗi JavaScript.
- Khi bật Reduce Motion, trang nội dung không còn animation đang chạy; đã xử lý cả animation có `!important` trong CSS vườn hoa gốc.
- `node --check greeting.js` và `git diff --check` không có lỗi.

## Kiểm tra hình ảnh

Đã xem ảnh chụp desktop, tablet, điện thoại và hộp lời chúc. Phong thư dùng hình học, màu hồng san hô, giấy kem và bóng elip theo ảnh HTML1 người dùng cung cấp. Giữ hai ảnh thật cùng vườn hoa của HTML; không thêm ảnh mẫu hoặc ảnh từ nguồn ngoài. Nội dung và hiệu ứng intro được giữ; canvas khớp kích thước hiển thị và dùng `100dvh` để thích ứng với màn hình điện thoại.

Inspector ở 1440, 768 và 390 px: 0 FAIL sau khi cho phép các đặc điểm được giữ theo yêu cầu: nền gradient, trái tim, hai ảnh có sẵn, bố cục lấy phong thư làm điểm nhấn và giấy màu kem. Cảnh báo không có video được giữ vì đây là thiệp tương tác, không cần video. Không áp dụng chọn hướng thiết kế ngẫu nhiên vì đây là chỉnh một phần giao diện theo mẫu cụ thể.

Lời chúc là nội dung mẫu mới trong `greeting.js`. Chưa thử trên điện thoại vật lý; thao tác chạm, safe area và thanh địa chỉ di động cần xác nhận trên thiết bị thật.

## Kiểm tra responsive mobile bổ sung

Chrome mô phỏng thiết bị ở 320×568, 360×640, 375×667, 390×844, 430×932, 568×320, 667×375 và 844×390:

- Layout viewport khớp đúng chiều rộng thiết bị; không tràn ngang hoặc tự thu nhỏ do vườn hoa.
- Ảnh không đè lên thư; nút mở thư hiện trong màn hình đầu tiên, có chiều cao tối thiểu 48 px.
- Thao tác qua sự kiện chạm mô phỏng mở/đóng lời chúc được.
- Kéo xuống cuối lời chúc dài vẫn thấy và bấm được nút đóng.
- Hộp lời chúc nằm trọn trong viewport ở cả hướng dọc và ngang.
- Canvas intro tự cập nhật đúng kích thước khi chuyển từ 390×844 sang 844×390; không có lỗi JavaScript.

Kiểm tra mã: hover chỉ áp dụng cho con trỏ chuột, có phản hồi khi nhấn, không khóa zoom, có safe-area và giới hạn chiều cao dialog theo `dvh`. Các hành vi riêng của iOS/Android vẫn cần xác nhận trên điện thoại thật.

## Hiệu ứng lời chúc hiện dần

Chrome ở 390×844, 320×568 và 1440×900: nội dung tăng dần theo thời gian; chạm vào thiệp hoặc kích hoạt nút xem hết bằng Enter hiển thị chính xác toàn bộ lời chúc. Chiều cao và vị trí thiệp không thay đổi trong khi chữ chạy hoặc khi bỏ qua. Chữ ký chỉ hiện khi đọc xong.

Đã kiểm tra tự chạy hết với lời chúc ngắn, đóng bằng Esc dừng timer, mở thiệp khác chạy lại từ đầu và không có timer cũ ghi đè. Reduce Motion hiển thị toàn bộ ngay. Nội dung đầy đủ được cung cấp cho trình đọc màn hình, phần chữ chạy được ẩn khỏi cây accessibility để tránh đọc lại từng ký tự. Không có lỗi JavaScript; `node --check greeting.js` và `git diff --check` đều đạt.

## Hoa xuất hiện mượt hơn

Thay các animation cũ của thân, lá và cánh bằng 46 nhóm xuất hiện lệch nhịp. Mỗi nhóm mờ dần vào và dịch lên nhẹ, cánh hoa theo sau 240 ms; toàn bộ vườn hiện đủ trong khoảng 2,8 giây. Chỉ ba bông chính và 12 hạt sáng tiếp tục chuyển động. Không chờ sự kiện `window.load` để bỏ trạng thái pause của toàn trang nữa.

Đã kiểm tra các mốc 0, 250, 700, 1400, 2200 và 3200 ms bằng timeline CSS thật trong Chrome, xem ảnh chụp đầu/giữa/cuối. Ở 390×844, 320×568, 844×390 và 1440×900: không tràn ngang, không có lỗi JavaScript, vẫn mở và bỏ qua chữ chạy trong thiệp được.

So sánh cùng cách đo trên Chrome headless: số animation của vườn giảm từ 564 xuống 86; animation tác động `height` giảm từ 25 xuống 0. Lượt đo 3,2 giây trước thay đổi ghi 21 lần layout; sau thay đổi ghi 0 ở bốn kích thước đã kiểm tra. Các animation mới chỉ dùng `transform` và `opacity`. Reduce Motion hiển thị tất cả nhóm ở opacity 1 và không tạo animation trong vườn.

Các số đo này xác nhận giảm công việc tính bố cục trên trình duyệt thử nghiệm; chưa đo tốc độ khung hình hoặc bộ nhớ GPU trên điện thoại thật.

## Đung đưa cả cụm cây

Mở rộng chuyển động từ ba bông chính sang 46 cụm cây, giữ thân và lá chuyển động cùng nhau. Mỗi chu kỳ dài 7–9,5 giây, biên độ 0,9–1,2 độ mỗi bên, lệch pha theo từng cụm. Hiệu ứng đung đưa bắt đầu sau nhịp xuất hiện; không chồng hai chuyển động xoay trên cùng cây.

Đã lấy mẫu timeline ở đầu chu kỳ, hai phía nghiêng và cuối chu kỳ trên 390×844, 320×568, 844×390 và 1440×900. Góc đầu/cuối bằng 0, không bật góc khi bắt đầu hoặc lặp; không có animation thay đổi layout hay tràn ngang. Reduce Motion không tạo animation của vườn. Số animation hiện tại tối đa 129 khi tính cả xuất hiện/nở và đung đưa, còn 58 chuyển động liên tục sau nhịp xuất hiện. Chưa thử độ mượt trên điện thoại vật lý.

## Màn nhập mã — 20/10/2026

`index.html` là màn đầu tiên, nhập mã 2409 mới mở quà. Trên Chrome ở 390×844, 320×568, 844×390 và 1440×900:

- Không tràn ngang; nút số có vùng bấm tối thiểu 44 px, thẻ nằm trong màn hình điện thoại dọc.
- Bốn chấm cập nhật theo số đã nhập, nút × xóa đúng số cuối.
- Mã sai 2408 không lưu trạng thái mở quà, không tạo pháo hoa và tự xóa để nhập lại.
- Mã đúng 2409 lưu trạng thái theo tab và tạo hạt pháo hoa thật trên canvas.
- Đã đi hết luồng nhập mã → pháo hoa → intro Matrix → vườn hoa, mở thư và xem hết chữ chạy.
- Truy cập trực tiếp intro hoặc vườn khi chưa mở quà quay về `index.html`.
- Đã thử phím số, Backspace và nhập mã qua ô password bằng thao tác chèn văn bản của trình duyệt.
- Mở bằng đường dẫn file và bật Reduce Motion vẫn nhập mã, hiện pháo hoa nhẹ và chuyển sang intro được.
- Không có lỗi JavaScript trong các lượt kiểm tra. Đã xem ảnh chụp màn nhập mã, mã sai và pháo hoa. Chưa kiểm tra trên điện thoại vật lý.

## Bốn video trên màn hình chính — 20/10/2026

Sử dụng bốn file có sẵn `em1.mp4`–`em4.mp4`, đều 720×720, dài 2–2,8 giây. Trích poster từ chính video; không khôi phục hai ảnh cũ đã bị xóa.

Chrome tại 390×844, 320×568, 768×1024, 844×390 và 1440×900: bốn khung nằm trong chiều rộng trang, không chồng lên nhau hoặc che phong thư. Đã xem ảnh chụp mobile, desktop và landscape. Bốn video giải mã đúng kích thước, không có lỗi media hay JavaScript; bốn khung có animation nhấp nhô chỉ dùng transform.

Kiểm tra video xem trước tự chạy không tiếng; cả bốn nút mở đúng clip và lời chúc riêng. Mở lời chúc tạm dừng video nền, nút đóng dừng clip trong hộp ngay. Chạm vào player không bỏ qua chữ chạy; nút xem hết vẫn hiển thị đầy đủ lời chúc. Mở thư chính ẩn player. Reduce Motion dừng nhấp nhô và autoplay, giữ poster cùng player điều khiển thủ công.

Chưa kiểm tra trên điện thoại vật lý. Khi trình duyệt hoặc chế độ tiết kiệm pin chặn autoplay, poster vẫn hiện và người xem có thể mở clip để phát thủ công.

## Luồng bó hoa và dải kỷ niệm — 20/10/2026

Đã chạy toàn bộ luồng trong Chrome: nhập 2409 → pháo hoa → bouquet.html → media-reel.html → matrix-pro.html → flower.html. Bó hoa SVG xoay nhẹ và nở từng lớp trước khi dải kỷ niệm bắt đầu. Dải gồm 9 mục đúng thứ tự em1–em9 (7 video, 2 ảnh); bộ quan sát xác nhận cả 9 mục đều đã đi vào vùng nhìn thấy trước khi tự chuyển tới intro. Màn chính vẫn có bốn video quanh phong thư.

Đã kiểm tra nút tạm dừng giữ nguyên timeline, tiếp tục chạy lại, ảnh giải mã đúng và không có lỗi JavaScript. Lượt kiểm tra luồng tăng tốc riêng timeline dải kỷ niệm 4 lần để kiểm tra điểm kết thúc; mã sản phẩm giữ tốc độ bình thường.

Đã xem ảnh chụp bó hoa và dải kỷ niệm ở 320×568, 390×844, 844×390 và 1440×900. Không tràn ngang, bó hoa nằm trong màn hình. Reduce Motion không tạo animation ở hai cảnh mới, video không tự phát và có điều khiển thủ công; nút đi tiếp vẫn tới intro. Chưa kiểm tra trên điện thoại vật lý.

## Dải kỷ niệm xen kẽ, hoa rơi và nhạc — 20/10/2026

Chrome ở 320×568, 390×844, 844×390 và 1440×900: các khung nằm xen kẽ trái–phải, không tràn ngang; đã xem ảnh chụp mobile. Có 16 bông hoa SVG rơi, chỉ chuyển động transform/opacity. File MP3 có sẵn giải mã thành công trên cả bốn kích thước.

Đã kiểm tra bằng thao tác chuột qua trình duyệt: bật/tắt nhạc, tạm dừng cảnh dừng cả nhạc và hoa rơi, tiếp tục khôi phục âm thanh. Bấm đi tiếp dừng nhạc ngay và đặt currentTime về 0; sau chuyển trang intro không còn audio. Không có lỗi JavaScript. Reduce Motion không tạo animation, ẩn lớp hoa rơi. Chưa kiểm tra trên điện thoại vật lý; khi autoplay bị chặn có nút Bật nhạc.
