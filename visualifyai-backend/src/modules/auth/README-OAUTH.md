# Hướng dẫn cấu hình OAuth cho Google và Facebook

## Cấu hình biến môi trường

Thêm các biến môi trường sau vào file `.env`:

```env
# Frontend URL
FRONTEND_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/auth/google/callback

# Facebook OAuth Configuration
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:8000/auth/facebook/callback
```

## Cách lấy Google OAuth credentials

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Bật Google+ API và Google OAuth2 API
4. Tạo OAuth 2.0 Client ID:
   - Chọn "Web application"
   - Thêm authorized redirect URIs: `http://localhost:8000/auth/google/callback`
   - Lưu Client ID và Client Secret

## Cách lấy Facebook OAuth credentials

### Bước 1: Tạo Facebook App
1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Đăng nhập bằng tài khoản Facebook của bạn
3. Click "My Apps" ở góc trên bên phải
4. Click "Create App" để tạo app mới
5. Chọn loại app:
   - Chọn "Consumer" nếu app dành cho người dùng cuối
   - Hoặc "Business" nếu app dành cho doanh nghiệp
6. Điền thông tin app:
   - **App Name**: Tên ứng dụng của bạn (ví dụ: "VisualifyAI")
   - **App Contact Email**: Email liên hệ
   - **App Purpose**: Mục đích sử dụng app
7. Click "Create App"

### Bước 2: Cấu hình Facebook Login
1. Trong dashboard của app, tìm và click "Add Product"
2. Tìm "Facebook Login" và click "Set Up"
3. Chọn platform "Web"
4. Trong phần "Site URL", nhập: `http://localhost:8000`
5. Click "Save" và "Continue"

### Bước 3: Cấu hình OAuth Settings
1. Trong sidebar bên trái, click "Facebook Login" > "Settings"
2. Trong phần "Valid OAuth Redirect URIs", thêm:
   ```
   http://localhost:8000/auth/facebook/callback
   ```
3. Các cài đặt khác:
   - **Client OAuth Login**: Bật (ON)
   - **Web OAuth Login**: Bật (ON)
   - **Enforce HTTPS**: Tắt (OFF) cho development
   - **Use Strict Mode for Redirect URIs**: Bật (ON)
4. Click "Save Changes"

### Bước 4: Lấy App ID và App Secret
1. Trong sidebar, click "Settings" > "Basic"
2. Sao chép **App ID** (hiển thị công khai)
3. Để xem **App Secret**:
   - Click "Show" bên cạnh App Secret
   - Nhập password Facebook của bạn
   - Sao chép App Secret (giữ bí mật)

### Bước 5: Cấu hình App Domain (Tùy chọn)
1. Trong "Settings" > "Basic"
2. Thêm domain vào "App Domains": `localhost`
3. Thêm "Privacy Policy URL" và "Terms of Service URL" nếu cần

### Bước 6: Chuyển App sang Live Mode (Khi deploy production)
1. Trong sidebar, click "App Review"
2. Chuyển toggle "Make [App Name] public?" sang ON
3. App sẽ có thể được sử dụng bởi tất cả người dùng Facebook

### Lưu ý quan trọng cho Facebook OAuth:
- **Development Mode**: App chỉ hoạt động với tài khoản developer và test users
- **Permissions**: Mặc định chỉ có quyền truy cập `public_profile` và `email`
- **App Review**: Cần review nếu muốn xin thêm permissions khác
- **Test Users**: Có thể tạo test users trong "Roles" > "Test Users"

## API Endpoints

### Google OAuth
- **GET** `/auth/google` - Bắt đầu quá trình đăng nhập với Google
- **GET** `/auth/google/callback` - Callback từ Google

### Facebook OAuth
- **GET** `/auth/facebook` - Bắt đầu quá trình đăng nhập với Facebook
- **GET** `/auth/facebook/callback` - Callback từ Facebook

## Flow đăng nhập OAuth

1. Client gọi `/auth/google` hoặc `/auth/facebook`
2. Server chuyển hướng đến trang OAuth của provider
3. Người dùng xác nhận trên trang OAuth
4. Provider chuyển hướng về callback URL với authorization code
5. Server sử dụng code để lấy access token và user info
6. Server tạo hoặc cập nhật user trong database
7. Server chuyển hướng về frontend với JWT token

## Cấu trúc database

User entity đã được cập nhật với các trường:
- `googleId`: ID từ Google OAuth
- `facebookId`: ID từ Facebook OAuth  
- `provider`: Loại provider (local, google, facebook)
- `password`: Nullable cho OAuth users

## Lưu ý

- OAuth users không có password, chỉ có thể đăng nhập qua OAuth
- Nếu email đã tồn tại, hệ thống sẽ liên kết OAuth account với user hiện có
- Avatar sẽ được cập nhật từ OAuth provider nếu user chưa có avatar 