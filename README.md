# Okul Maliyet Endeksi (School-Cost)

Özel okul maliyetlerini anonim olarak paylaşan ve karşılaştıran platform.

## Kurulum

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. `.env.local` oluşturun (`.env.example` referans):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Supabase'de migration ve seed çalıştırın:
   - Supabase Dashboard > SQL Editor
   - `supabase/migrations/20260228000000_initial_schema.sql` içeriğini çalıştırın
   - `supabase/migrations/20260228200000_reference_code_update.sql` içeriğini çalıştırın
   - `supabase/seed.sql` içeriğini çalıştırın

4. Geliştirme sunucusu:
   ```bash
   npm run dev
   ```

## CI/CD (GitHub Actions)

### Gerekli GitHub Secrets

**CI (lint, test, build):**
- `NEXT_PUBLIC_SUPABASE_URL` – Supabase proje URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon key

**Deploy (VDS):**
- `SSH_HOST` – VDS IP veya hostname
- `SSH_USER` – SSH kullanıcı adı
- `SSH_PRIVATE_KEY` – SSH private key (tüm içerik)
- `DEPLOY_PATH` – (opsiyonel) Proje dizini, varsayılan: `~/school-cost-index`
- `DEPLOY_USE_DOCKER` – `true` ise `docker compose` ile deploy (varsayılan: PM2)

**Migration (Supabase):**
- `SUPABASE_ACCESS_TOKEN` – Supabase personal access token
- `SUPABASE_PROJECT_REF` – Supabase proje referansı (dashboard URL’deki project-id)
- `SUPABASE_DB_PASSWORD` – Supabase veritabanı şifresi (db push için gerekli)

### VDS İlk Kurulum

1. VDS'de Node.js 22+ ve PM2 kurun:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt install -y nodejs
   sudo npm install -g pm2
   ```

2. Projeyi klonlayın (private repo için: VDS'e deploy key ekleyin veya HTTPS + token):
   ```bash
   git clone https://github.com/KULLANICI/school-cost-index.git ~/school-cost-index
   cd ~/school-cost-index
   cp .env.example .env.local
   # .env.local düzenleyin (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
   ```

3. İlk çalıştırma:
   ```bash
   npm ci && npm run build
   pm2 start ecosystem.config.cjs
   pm2 save && pm2 startup
   ```

4. Nginx reverse proxy (detay: `nginx/README.md`):
   ```bash
   sudo apt install -y nginx
   sudo ln -s $(pwd)/nginx/school-cost-index.conf /etc/nginx/sites-enabled/
   # Domain'i config'de güncelleyin (okulmaliyet.com → kendi domain)
   sudo nginx -t && sudo systemctl reload nginx
   ```
   SSL için: `sudo certbot --nginx -d yourdomain.com`

5. GitHub Actions deploy için: Repo Settings → Secrets → `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY` ekleyin.
   - Yeni key pair oluşturun: `ssh-keygen -t ed25519 -f deploy_key -N ""`
   - `deploy_key.pub` içeriğini VDS'de `~/.ssh/authorized_keys` dosyasına ekleyin
   - `deploy_key` (private) içeriğini GitHub Secrets → `SSH_PRIVATE_KEY` olarak ekleyin

## Docker

```bash
# Build and run
docker compose up -d

# Or build only
docker compose build
```

Proje kökündeki `.env` dosyasına `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` ekleyin (veya `.env.local` kopyalayın).

## Nginx

`nginx/` klasöründe reverse proxy config'leri bulunur. Domain adını config dosyalarında güncellemeyi unutmayın.

## Doğrulama (Verification)

Yeni eklenen maliyet verileri `is_verified = false` ile kaydedilir. Manuel doğrulama için:

```sql
UPDATE costs SET is_verified = true WHERE id = 'cost-uuid';
```

Otomatik doğrulama sistemi sonraki aşamada eklenecektir.

## Referans Kodu

Veri paylaşımı sonrası kullanıcıya verilen referans kodu ile `/update` sayfasından veri güncellenebilir.
