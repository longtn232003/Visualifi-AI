# Docker Production Setup cho VisualifyAI

Thư mục này chứa tất cả các file cần thiết để deploy VisualifyAI lên production với SSL tự động.

## Cấu trúc thư mục

```
deploy/
├── development/          # Development setup
│   ├── docker-compose.yml
│   └── Dockerfile
└── production/           # Production setup
    ├── docker-compose.production.yml
    ├── Dockerfile.production
    ├── nginx.conf
    ├── deploy.sh
    ├── README.md
    └── architecture.md
```

## Kiến trúc

Hệ thống sử dụng 3 containers:

1. **app**: Ứng dụng VisualifyAI frontend
2. **nginx-proxy**: Reverse proxy tự động phát hiện containers
3. **letsencrypt**: Tự động cấp và gia hạn chứng chỉ SSL

## Yêu cầu

- Docker & Docker Compose
- Server với IP public
- Domain `visualifyai.com` trỏ về IP server

## Cài đặt

### 1. Cấu hình Domain

Đảm bảo domain của bạn trỏ về IP server:
```bash
# Kiểm tra DNS
nslookup visualifyai.com
nslookup www.visualifyai.com
```

### 2. Cấu hình Email

Sửa email trong file `.env.production` (ở thư mục gốc):
```bash
LETSENCRYPT_EMAIL=your-email@domain.com
```

### 3. Deploy

```bash
# Chạy từ thư mục gốc dự án
chmod +x deploy/production/deploy.sh
./deploy/production/deploy.sh
```

## Quản lý

### Xem logs
```bash
# Chuyển đến thư mục production
cd deploy/production

# Xem tất cả logs
docker-compose -f docker-compose.production.yml logs -f

# Xem logs của container cụ thể
docker-compose -f docker-compose.production.yml logs -f app
docker-compose -f docker-compose.production.yml logs -f nginx-proxy
docker-compose -f docker-compose.production.yml logs -f letsencrypt
```

### Kiểm tra trạng thái
```bash
cd deploy/production
docker-compose -f docker-compose.production.yml ps
```

### Dừng services
```bash
cd deploy/production
docker-compose -f docker-compose.production.yml down
```

### Restart services
```bash
cd deploy/production
docker-compose -f docker-compose.production.yml restart
```

### Update ứng dụng
```bash
# Build và deploy lại
cd deploy/production
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d
```

## Development

Để chạy môi trường development:
```bash
cd deploy/development
docker-compose up -d
```

## Troubleshooting

### SSL không hoạt động
1. Kiểm tra domain đã trỏ đúng chưa
2. Kiểm tra logs của letsencrypt container
3. Đợi vài phút để chứng chỉ được cấp

### Ứng dụng không load
1. Kiểm tra logs của app container
2. Kiểm tra nginx-proxy logs
3. Kiểm tra port 80 và 443 đã mở chưa

### Performance monitoring
```bash
# Xem resource usage
docker stats
```

## Security

- SSL/TLS tự động với Let's Encrypt
- Security headers được cấu hình trong nginx
- Gzip compression enabled
- Static assets được cache

## Files

- `docker-compose.production.yml`: Cấu hình chính
- `Dockerfile.production`: Build ứng dụng cho production
- `nginx.conf`: Cấu hình nginx
- `deploy.sh`: Script deploy tự động
- `README.md`: Tài liệu này
- `architecture.md`: Biểu đồ kiến trúc hệ thống 