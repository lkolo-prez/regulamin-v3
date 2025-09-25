# Użyj oficjalnego obrazu Nginx jako bazy
FROM nginx:alpine

# Skopiuj konfigurację Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Skopiuj zawartość projektu (pliki Docsify/HTML/MD)
# do domyślnego katalogu serwera Nginx
COPY . /usr/share/nginx/html

# Usuń pliki które nie powinny być w katalogu www
RUN rm -f /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/nginx.conf /usr/share/nginx/html/deploy.sh /usr/share/nginx/html/.git* /usr/share/nginx/html/desktop.ini

# Ujawnij porty 80 i 443
EXPOSE 80 443

# Komenda startowa
CMD ["nginx", "-g", "daemon off;"]
