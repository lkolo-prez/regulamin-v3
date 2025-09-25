#!/bin/bash

echo "=== Wdrożenie System Prawny SSPO ==="
echo "Domena: regulamin.sspo.com.pl"
echo "Serwer: vps-5e1411da.vps.ovh.net"
echo ""

# Sprawdź czy Docker jest zainstalowany
if ! command -v docker &> /dev/null; then
    echo "Docker nie jest zainstalowany. Instaluję Docker..."
    sudo apt-get update
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
    echo "Docker został zainstalowany. Może być konieczne ponowne zalogowanie."
fi

# Sprawdź czy docker-compose jest zainstalowany
if ! command -v docker-compose &> /dev/null; then
    echo "Instaluję docker-compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Zatrzymaj i usuń istniejący kontener (jeśli istnieje)
echo "Sprawdzam istniejące kontenery..."
sudo docker stop regulamin-sspo 2>/dev/null || true
sudo docker rm regulamin-sspo 2>/dev/null || true

# Zbuduj nowy obraz
echo "Budowanie obrazu Docker..."
sudo docker build -t regulamin-sspo .

# Uruchom kontener z mapowaniem portów
echo "Uruchamianie kontenera..."
sudo docker run -d \
    --name regulamin-sspo \
    --restart unless-stopped \
    -p 80:80 \
    -p 443:443 \
    regulamin-sspo

echo ""
echo "=== Wdrożenie zakończone pomyślnie! ==="
echo ""
echo "Strona będzie dostępna pod adresem: http://regulamin.sspo.com.pl"
echo "(pamiętaj, aby skierować domenę na IP serwera w DNS)"
echo ""
echo "Polecenia do zarządzania:"
echo "  - Zatrzymanie: sudo docker stop regulamin-sspo"
echo "  - Uruchomienie: sudo docker start regulamin-sspo"
echo "  - Przebudowanie: ./deploy.sh"
echo "  - Logi: sudo docker logs regulamin-sspo"
echo ""