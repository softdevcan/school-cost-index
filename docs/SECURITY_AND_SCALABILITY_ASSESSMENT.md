# Güvenlik ve Ölçeklenebilirlik Değerlendirmesi

100–200 eşzamanlı kullanıcı senaryosu ve güvenlik açısından proje analizi.

---

## 1. Güvenlik

### 1.1 İyi Yapılanlar

| Alan | Durum |
|------|-------|
| **Input validation (submit)** | Zod ile `costEntrySchema` – tip, aralık, format kontrolü |
| **SQL injection** | Supabase client parametreli sorgu kullanıyor; RPC parametreli |
| **XSS** | `dangerouslySetInnerHTML` yok; React varsayılan escape |
| **CSRF** | Next.js Server Actions CSRF koruması sağlıyor |
| **RLS** | `schools` ve `costs` için RLS açık; sadece `is_verified=true` okunuyor |
| **Security headers** | Nginx: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy |
| **SSL** | TLS 1.2/1.3, güçlü cipher suite |
| **RPC güvenliği** | `get_cost_by_reference`, `update_cost_by_reference` SECURITY DEFINER ile RLS bypass; sadece referans kodu ile erişim |

### 1.2 Eksikler / Riskler

| Risk | Açıklama | Öneri |
|------|----------|-------|
| **String alanlarda max length yok** | `school_name`, `city`, `district` sadece `min(2)`; çok uzun string DB’ye gidebilir | Zod’a `max(200)` vb. ekle |
| **Update validasyonu yok** | `updateCostByReference` Zod ile doğrulanmıyor; `tuition_fee` negatif/çok büyük olabilir | `updateCostSchema` ekle |
| **Referans kodu brute-force** | 12 karakter nanoid (~36^12); teorik brute-force mümkün | Rate limit + gerekirse kod uzunluğu artır |
| **Content-Security-Policy** | Nginx’te CSP header yok | CSP ekle (report-only ile başlanabilir) |
| **Strict-Transport-Security** | HSTS header yok | `add_header Strict-Transport-Security "max-age=31536000; includeSubDomains"` ekle |

---

## 2. Rate Limiting

### 2.1 Mevcut Durum

- Uygulama seviyesinde rate limiting yok.
- Nginx’te `limit_req` yok.
- Supabase REST API için varsayılan rate limit yok (Realtime için 200 concurrent connection).

### 2.2 Öneri

100–200 eşzamanlı kullanıcı için:

1. **Nginx `limit_req`** – `/submit`, `/update` gibi write endpoint’leri için:
   ```nginx
   limit_req_zone $binary_remote_addr zone=submit:10m rate=5r/s;
   limit_req_zone $binary_remote_addr zone=update:10m rate=3r/s;
   ```
2. **Next.js middleware** – IP bazlı basit rate limit (örn. `@upstash/ratelimit` veya in-memory).
3. **Supabase** – Free tier Realtime 200 concurrent; bu proje Realtime kullanmıyor, REST kullanıyor; DB connection pool yeterli olmalı.

---

## 3. Routing

### 3.1 Mevcut Durum

- `/`, `/search`, `/submit`, `/update` – net route yapısı.
- `ROUTES` sabiti kullanılıyor.
- Açık redirect veya path traversal riski görünmüyor.

### 3.2 Öneri

- Hassas route’lar için auth/middleware planı (admin panel vb. gelecekte).

---

## 4. Ölçeklenebilirlik (100–200 Eşzamanlı Kullanıcı)

### 4.1 Mevcut Yapı

| Bileşen | Konfigürasyon | Değerlendirme |
|---------|---------------|---------------|
| **PM2** | `instances: 1` | Tek process; 100–200 concurrent için dar kalabilir |
| **Nginx** | `keepalive 64` | Uygun |
| **Supabase** | REST API, connection pool | Free tier DB limitleri yeterli olmalı |
| **Next.js** | Server Components, Server Actions | Request başına işlem; stateless |

### 4.2 Öneriler

1. **PM2 cluster mode** – `instances: 2` veya `max` (CPU sayısı):
   ```js
   instances: 2,  // veya 'max'
   exec_mode: 'cluster',
   ```
2. **Memory** – `max_memory_restart: '500M'` uygun; gerekirse 1G’ye çıkarılabilir.
3. **Search sayfası** – Tüm `costs` client’a çekiliyor; veri artınca yavaşlayabilir. İleride:
   - Server-side filtreleme (Supabase query ile)
   - Pagination
   - Sadece gerekli alanları select

---

## 5. Veritabanı

### 5.1 İndeksler

- `schools`: city, district, type, (latitude, longitude)
- `costs`: school_id, is_verified, reference_code

### 5.2 RLS Politikaları

- `schools`: Herkes okuyabilir; herkes insert/update yapabilir (anon).
- `costs`: Sadece `is_verified=true` okunuyor; herkes insert yapabilir.
- `costs` için doğrudan UPDATE policy yok; güncelleme sadece RPC ile (`update_cost_by_reference`).

### 5.3 RPC Güvenliği

- `update_cost_by_reference`: Sadece `reference_code` ile güncelleme; başka kullanıcı verisi değiştirilemez.
- Parametreler SQL injection’a karşı parametreli kullanılıyor.

---

## 6. Özet Aksiyon Listesi

### Yüksek Öncelik

1. **Rate limiting** – Nginx veya middleware ile submit/update için.
2. **Update validasyonu** – `updateCostByReference` öncesi Zod schema.
3. **String max length** – `school_name`, `city`, `district` için Zod’da `max()`.

### Orta Öncelik

4. **PM2 cluster** – `instances: 2` veya `max`.
5. **HSTS** – Nginx’e Strict-Transport-Security ekle.
6. **CSP** – Content-Security-Policy (report-only ile başla).

### Düşük Öncelik

7. **Search optimizasyonu** – Veri büyüdükçe server-side filtreleme ve pagination.
8. **Referans kodu** – Rate limit yeterli olabilir; gerekirse uzunluk artırılabilir.
