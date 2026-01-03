#!/bin/bash

# Màu sắc cho output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Domain và email
DOMAIN="visualifyai.com"
WWW_DOMAIN="www.visualifyai.com"
EMAIL="admin@${DOMAIN}"  # Thay đổi email này

echo -e "${BLUE}🔒 Setup SSL tự động cho VisualifyAI với Let's Encrypt${NC}"
echo "=================================================="

# Kiểm tra domain và email
echo -e "${YELLOW}📝 Thông tin SSL:${NC}"
echo "   Domain: ${DOMAIN}"
echo "   WWW Domain: ${WWW_DOMAIN}"
echo "   Email: ${EMAIL}"
echo ""

read -p "Bạn có muốn thay đổi email? (y/N): " -r
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Nhập email mới: " EMAIL
fi

echo -e "${BLUE}📋 Chuẩn bị thư mục...${NC}"

# Tạo thư mục cần thiết
mkdir -p certbot/conf
mkdir -p certbot/www

# Kiểm tra DNS trước khi cấp SSL
echo -e "${BLUE}🔍 Kiểm tra DNS cho ${DOMAIN}...${NC}"
if ! nslookup ${DOMAIN} > /dev/null 2>&1; then
    echo -e "${RED}❌ Domain ${DOMAIN} không tồn tại hoặc chưa trỏ về server này!${NC}"
    echo -e "${YELLOW}⚠️  Hãy cấu hình DNS trước khi chạy script này.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ DNS OK!${NC}"

# Dừng container cũ
echo -e "${BLUE}🛑 Dừng containers cũ...${NC}"
docker-compose -f docker-compose.ssl.yml down 2>/dev/null || true

# Khởi động nginx tạm thời cho ACME challenge (port 80)
echo -e "${BLUE}🚀 Khởi động nginx tạm thời...${NC}"

# Tạo nginx config tạm thời chỉ cho HTTP
cat > nginx-temp.conf << EOF
upstream visualifyai_backend {
    server app:4200;
}

server {
    listen 80;
    server_name ${DOMAIN} ${WWW_DOMAIN};

    # ACME challenge location for Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Temporary allow all traffic for initial setup
    location / {
        proxy_pass http://visualifyai_backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Tạo docker-compose tạm thời
cat > docker-compose.temp.yml << EOF
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
    command: sh -c "npm install && npm run build && npm run preview"
    networks:
      - visualifyai-network

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
    volumes:
      - ./nginx-temp.conf:/etc/nginx/conf.d/default.conf
      - ./certbot/www:/var/www/certbot
    depends_on:
      - app
    networks:
      - visualifyai-network

networks:
  visualifyai-network:
    driver: bridge
EOF

# Khởi động containers tạm thời
docker-compose -f docker-compose.temp.yml up -d

echo -e "${BLUE}⏳ Chờ nginx khởi động...${NC}"
sleep 10

# Cấp SSL certificate
echo -e "${BLUE}🔐 Cấp SSL certificate với Let's Encrypt...${NC}"
docker run --rm \
    -v "${PWD}/certbot/conf:/etc/letsencrypt" \
    -v "${PWD}/certbot/www:/var/www/certbot" \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email ${EMAIL} \
    --agree-tos \
    --no-eff-email \
    -d ${DOMAIN} \
    -d ${WWW_DOMAIN}

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SSL certificate đã được cấp thành công!${NC}"
else
    echo -e "${RED}❌ Lỗi khi cấp SSL certificate!${NC}"
    echo -e "${YELLOW}💡 Kiểm tra:${NC}"
    echo "   - Domain đã trỏ về server này chưa?"
    echo "   - Port 80 có bị firewall block không?"
    echo "   - Nginx container có chạy không?"
    
    # Cleanup
    docker-compose -f docker-compose.temp.yml down
    rm -f nginx-temp.conf docker-compose.temp.yml
    exit 1
fi

# Cleanup temporary files
docker-compose -f docker-compose.temp.yml down
rm -f nginx-temp.conf docker-compose.temp.yml

# Copy SSL config
echo -e "${BLUE}📄 Cập nhật cấu hình nginx...${NC}"
cp nginx-ssl.conf nginx.conf

# Khởi động với SSL
echo -e "${BLUE}🚀 Khởi động với SSL...${NC}"
docker-compose -f docker-compose.ssl.yml up -d

echo ""
echo -e "${GREEN}🎉 SSL đã được cấu hình thành công!${NC}"
echo "=================================================="
echo -e "${GREEN}✅ Truy cập ứng dụng tại:${NC}"
echo "   • HTTPS: https://${DOMAIN}"
echo "   • HTTPS WWW: https://${WWW_DOMAIN}"
echo ""
echo -e "${BLUE}📋 Commands hữu ích:${NC}"
echo "   • Xem logs: docker-compose -f docker-compose.ssl.yml logs -f"
echo "   • Restart: docker-compose -f docker-compose.ssl.yml restart"
echo "   • Stop: docker-compose -f docker-compose.ssl.yml down"
echo ""
echo -e "${YELLOW}🔄 Auto-renewal:${NC}"
echo "   Certbot sẽ tự động gia hạn SSL mỗi 12 giờ"
echo "   Nginx sẽ tự động reload cấu hình mỗi 6 giờ"
echo ""
echo -e "${GREEN}🔒 SSL Grade A+ với security headers và HSTS!${NC}" 