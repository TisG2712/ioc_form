FROM node:18 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Kiểm tra output của npm run build
RUN npm run build && ls -la /app
# Nếu dùng Vite, thư mục build là /app/dist; nếu Create React App, là /app/build

# Production stage
FROM nginx:alpine

# Cài đặt curl cho health check
RUN apk add --no-cache curl

# Sao chép file build từ stage build (giả sử Vite tạo thư mục dist)
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Sao chép file cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.main.conf /etc/nginx/nginx.conf

# Sao chép trang lỗi
COPY public/error.html /usr/share/nginx/html/error.html

# Tạo các thư mục cần thiết cho Nginx, bao gồm Let's Encrypt, và thiết lập quyền
RUN mkdir -p /var/cache/nginx /var/log/nginx /tmp/nginx /run/nginx /etc/letsencrypt && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /tmp/nginx /run/nginx /usr/share/nginx/html /etc/letsencrypt && \
    chmod -R 755 /var/cache/nginx /var/log/nginx /tmp/nginx /usr/share/nginx/html /etc/letsencrypt && \
    chown nginx:nginx /run && \
    chmod 775 /run /run/nginx && \
    rm -f /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh

# Chuyển sang user nginx
USER nginx

# Expose port 80 và 443
# EXPOSE 80 443
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]