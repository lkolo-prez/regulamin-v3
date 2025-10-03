# Użyj oficjalnego obrazu Nginx jako bazy
FROM nginx:alpine

# Usuń domyślną konfigurację nginx
RUN rm /etc/nginx/conf.d/default.conf

# Skopiuj niestandardową konfigurację nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Skopiuj zawartość bieżącego katalogu (gdzie znajdują się pliki Docsify)
# do domyślnego katalogu serwera Nginx
COPY . /usr/share/nginx/html

# Ujawnij port 80, na którym Nginx nasłuchuje domyślnie
EXPOSE 80

# Dodaj label z metadanami
LABEL maintainer="SSPO <admin@sspo.com.pl>"
LABEL version="3.0"
LABEL description="System Prawny SSPO - Interactive Documentation"

# Komenda startowa (opcjonalna, Nginx uruchamia się domyślnie)
CMD ["nginx", "-g", "daemon off;"]
