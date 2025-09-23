# Użyj oficjalnego obrazu Nginx jako bazy
FROM nginx:alpine

# Skopiuj zawartość bieżącego katalogu (gdzie znajdują się pliki Docsify)
# do domyślnego katalogu serwera Nginx
COPY . /usr/share/nginx/html

# Ujawnij port 80, na którym Nginx nasłuchuje domyślnie
EXPOSE 80

# Komenda startowa (opcjonalna, Nginx uruchamia się domyślnie)
CMD ["nginx", "-g", "daemon off;"]
