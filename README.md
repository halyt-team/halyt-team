# halyt-team/.github

Repo này đẩy lên GitHub với tên **`.github`** trong tổ chức [halyt-team](https://github.com/halyt-team). GitHub lấy `profile/README.md` làm trang giới thiệu của tổ chức. File README ở gốc này chỉ hiện trong trang repo, không hiện trên profile.

## Cấu trúc

- `profile/README.md`: nội dung trang profile.
- `profile/assets/*.svg`: banner và sơ đồ quy trình, mỗi hình có bản `-light` và `-dark`. GitHub tự chọn bản hợp với giao diện người xem.
- `scripts/build-assets.mjs`: sinh lại các SVG. Sửa chữ hay màu ở đây, không sửa SVG bằng tay.
- `scripts/check.mjs`: kiểm tra trước khi push.

## Lệnh

```bash
node scripts/build-assets.mjs
```

```bash
node scripts/check.mjs --preview
```

`check.mjs` kiểm tra mấy điều sau:

- Mọi ảnh trong README đều trỏ tới file có thật trong repo.
- SVG viết đúng cú pháp và không tải gì từ bên ngoài, vì GitHub chặn tài nguyên ngoài khi hiển thị SVG trong `<img>`.
- Mỗi `<picture>` có bản tối và có alt.
- Không dùng gạch dài.
- Các link đều mở được.

Với `--preview`, script dựng README qua API markdown của GitHub ra `preview/light.html` và `preview/dark.html`, kèm ảnh PNG nếu máy có Edge. Thêm `--offline` để bỏ bước kiểm tra link.

## Lưu ý

- Ảnh trong README dùng đường dẫn tuyệt đối `https://raw.githubusercontent.com/halyt-team/.github/main/...`. Vì vậy repo phải tên đúng là `.github`, ở chế độ **public**, nhánh `main`. Ảnh chỉ hiện sau khi đã push.
- Font trong SVG là font có sẵn trên máy người xem (Segoe UI hoặc Helvetica, chữ nghiêng dùng Georgia). Đổi font thì nhìn lại cả bản sáng lẫn bản tối.
- Nội dung chữ lấy từ halyt.com. Không đưa số liệu hay tên khách chưa có thật lên đây.
