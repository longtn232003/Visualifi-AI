# Kiến trúc Hệ thống VisualifyAI Production

## Sơ đồ kiến trúc tổng thể

```
                         Internet
                             │
                             ▼
                    ┌─────────────────┐
                    │    DNS Server   │
                    │ visualifyai.com │
                    └─────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Server/VPS    │
                    │   (IP Public)   │
                    └─────────────────┘
                             │
                             ▼
          ┌─────────────────────────────────────────┐
          │             Docker Host                 │
          │                                         │
          │  ┌─────────────────────────────────┐   │
          │  │         nginx-proxy             │   │
          │  │    (jwilder/nginx-proxy)        │   │
          │  │                                 │   │
          │  │  Port 80 ────────┐             │   │
          │  │  Port 443────────┼─────────────│   │
          │  │                  │             │   │
          │  └──────────────────┼─────────────┘   │
          │                     │                 │
          │  ┌─────────────────┼─────────────┐   │
          │  │     letsencrypt │             │   │
          │  │   (SSL Manager) │             │   │
          │  │                 │             │   │
          │  │  ┌──────────────▼──────────┐  │   │
          │  │  │    SSL Certificates    │  │   │
          │  │  │   (Let's Encrypt)      │  │   │
          │  │  └────────────────────────┘  │   │
          │  └─────────────────────────────────┘   │
          │                     │                 │
          │  ┌─────────────────┼─────────────┐   │
          │  │      app        │             │   │
          │  │  (VisualifyAI)  │             │   │
          │  │                 │             │   │
          │  │  ┌──────────────▼──────────┐  │   │
          │  │  │       nginx            │  │   │
          │  │  │  (serve static files)  │  │   │
          │  │  │                        │  │   │
          │  │  │  ┌─────────────────┐   │  │   │
          │  │  │  │   Built Assets  │   │  │   │
          │  │  │  │   (HTML/JS/CSS) │   │  │   │
          │  │  │  └─────────────────┘   │  │   │
          │  │  └────────────────────────┘  │   │
          │  └─────────────────────────────────┘   │
          └─────────────────────────────────────────┘
```

## Luồng xử lý Request

```
User Request Flow:
┌─────────┐    HTTPS    ┌──────────────┐    HTTP     ┌─────────────┐
│  User   │ ─────────► │ nginx-proxy  │ ─────────► │     app     │
│ Browser │   (443)     │  Container   │   (80)      │ Container   │
└─────────┘             └──────────────┘             └─────────────┘
     ▲                          │                           │
     │                          ▼                           ▼
     │                  ┌──────────────┐             ┌─────────────┐
     │                  │ letsencrypt  │             │    nginx    │
     │                  │ Container    │             │ (static)    │
     │                  └──────────────┘             └─────────────┘
     │                          │                           │
     └──────────────────────────┼───────────────────────────┘
                        SSL Certificate
                         Management
```

## Chi tiết từng Container

### 1. nginx-proxy Container
```
┌─────────────────────────────────────┐
│           nginx-proxy               │
├─────────────────────────────────────┤
│ • Tự động phát hiện containers      │
│ • Reverse proxy                     │
│ • Load balancing                    │
│ • SSL termination                   │
│ • Port mapping: 80, 443             │
├─────────────────────────────────────┤
│ Environment Variables:              │
│ • VIRTUAL_HOST detection            │
│ • DEFAULT_HOST=visualifyai.com      │
└─────────────────────────────────────┘
```

### 2. letsencrypt Container
```
┌─────────────────────────────────────┐
│           letsencrypt               │
├─────────────────────────────────────┤
│ • Tự động cấp SSL certificates      │
│ • Tự động gia hạn (90 ngày)         │
│ • ACME challenge handling           │
│ • Certificate storage               │
├─────────────────────────────────────┤
│ Environment Variables:              │
│ • LETSENCRYPT_HOST                  │
│ • LETSENCRYPT_EMAIL                 │
│ • NGINX_PROXY_CONTAINER             │
└─────────────────────────────────────┘
```

### 3. app Container
```
┌─────────────────────────────────────┐
│              app                    │
├─────────────────────────────────────┤
│ Multi-stage Build:                  │
│                                     │
│ Stage 1 - Builder:                  │
│ • node:18-alpine                    │
│ • npm ci --only=production          │
│ • npm run build                     │
│                                     │
│ Stage 2 - Production:               │
│ • nginx:alpine                      │
│ • Static files from builder        │
│ • Custom nginx.conf                 │
│ • Health checks                     │
├─────────────────────────────────────┤
│ Environment Variables:              │
│ • VIRTUAL_HOST=visualifyai.com      │
│ • LETSENCRYPT_HOST=visualifyai.com  │
└─────────────────────────────────────┘
```

## Network Architecture

```
┌─────────────────────────────────────────────────────┐
│                Docker Network                       │
│                (nginx-proxy)                        │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │nginx-proxy  │  │letsencrypt  │  │    app      │ │
│  │    :80      │  │             │  │    :80      │ │
│  │    :443     │  │             │  │             │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│         │                 │                │       │
│         └─────────────────┼────────────────┘       │
│                           │                        │
└───────────────────────────┼────────────────────────┘
                            │
                    ┌───────▼───────┐
                    │  Shared       │
                    │  Volumes:     │
                    │  • certs      │
                    │  • vhost.d    │
                    │  • html       │
                    └───────────────┘
```

## Data Flow

### 1. Khởi động hệ thống
```
1. app container starts
   ├── Build frontend assets
   ├── Configure nginx
   └── Expose environment variables

2. nginx-proxy starts
   ├── Detect app container
   ├── Create virtual host
   └── Configure reverse proxy

3. letsencrypt starts
   ├── Detect nginx-proxy
   ├── Request SSL certificate
   ├── Configure HTTPS
   └── Schedule renewal
```

### 2. Request Processing
```
HTTPS Request (port 443)
    │
    ▼
nginx-proxy
    │
    ├── SSL termination
    ├── Host header check
    └── Route to app container
         │
         ▼
    app container (nginx)
         │
         ├── Static file serving
         ├── SPA routing (fallback to index.html)
         ├── Gzip compression
         ├── Cache headers
         └── Security headers
              │
              ▼
         HTML/JS/CSS Response
```

## Security Layers

```
┌─────────────────────────────────────┐
│           Security Stack            │
├─────────────────────────────────────┤
│ 1. Let's Encrypt SSL/TLS            │
│    • HTTPS enforcement              │
│    • Modern cipher suites           │
│    • HSTS headers                   │
├─────────────────────────────────────┤
│ 2. nginx Security Headers           │
│    • X-Frame-Options                │
│    • X-XSS-Protection               │
│    • X-Content-Type-Options         │
│    • Content-Security-Policy        │
│    • Referrer-Policy                │
├─────────────────────────────────────┤
│ 3. Container Isolation              │
│    • Docker network isolation       │
│    • Non-root user                  │
│    • Read-only filesystem           │
├─────────────────────────────────────┤
│ 4. Application Security             │
│    • Static file serving only       │
│    • No server-side execution       │
│    • Client-side routing            │
└─────────────────────────────────────┘
```

## Performance Optimizations

```
┌─────────────────────────────────────┐
│        Performance Features         │
├─────────────────────────────────────┤
│ 1. nginx Optimizations              │
│    • Gzip compression               │
│    • Static file caching           │
│    • Browser caching headers       │
│    • Efficient file serving        │
├─────────────────────────────────────┤
│ 2. Multi-stage Docker Build         │
│    • Smaller final image            │
│    • No build dependencies         │
│    • Production-only assets         │
├─────────────────────────────────────┤
│ 3. Container Optimizations          │
│    • Alpine Linux base             │
│    • Health checks                 │
│    • Restart policies              │
│    • Resource limits               │
└─────────────────────────────────────┘
``` 