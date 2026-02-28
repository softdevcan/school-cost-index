# Nginx Kurulum

## 1. Domain'i Değiştirin

`school-cost-index.conf` ve `school-cost-index.ssl.conf` dosyalarındaki `okul.softdevcan.site` ifadelerini kendi domain'inizle değiştirin.

## 2. HTTP Kurulum (SSL öncesi)

```bash
# Nginx kur
sudo apt update
sudo apt install -y nginx

# Config'i sites-enabled'e bağla (proje path'ini güncelleyin)
sudo ln -s /home/user/school-cost-index/nginx/school-cost-index.conf /etc/nginx/sites-enabled/

# Varsayılan site'ı devre dışı bırak (opsiyonel)
sudo rm /etc/nginx/sites-enabled/default

# Test ve reload
sudo nginx -t
sudo systemctl reload nginx
```

## 3. SSL (Let's Encrypt)

**Yöntem A – Certbot otomatik (önerilen):**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d okul.softdevcan.site -d www.okul.softdevcan.site
```

**Yöntem B – Manuel config:**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo mkdir -p /var/www/certbot
sudo certbot certonly --webroot -w /var/www/certbot -d okul.softdevcan.site -d www.okul.softdevcan.site

# SSL config'i etkinleştir
sudo ln -sf /home/user/school-cost-index/nginx/school-cost-index.ssl.conf /etc/nginx/sites-enabled/school-cost-index.conf
sudo nginx -t && sudo systemctl reload nginx
```

## 4. Otomatik SSL Yenileme

```bash
# Cron zaten certbot ile kurulur, test için:
sudo certbot renew --dry-run
```
