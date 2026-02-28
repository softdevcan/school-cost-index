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

**Deploy (Vercel):**
- `VERCEL_TOKEN` – Vercel hesabından alınır (Settings > Tokens)
- `VERCEL_ORG_ID` – `vercel link` veya proje ayarlarından
- `VERCEL_PROJECT_ID` – `vercel link` veya proje ayarlarından

### Alternatif: Vercel GitHub Entegrasyonu

Vercel Dashboard üzerinden repo bağlandığında otomatik deploy yapılır. Bu durumda `deploy.yml` workflow'unu devre dışı bırakabilir veya silebilirsiniz.

## Doğrulama (Verification)

Yeni eklenen maliyet verileri `is_verified = false` ile kaydedilir. Manuel doğrulama için:

```sql
UPDATE costs SET is_verified = true WHERE id = 'cost-uuid';
```

Otomatik doğrulama sistemi sonraki aşamada eklenecektir.

## Referans Kodu

Veri paylaşımı sonrası kullanıcıya verilen referans kodu ile veri güncelleme özelliği planlanmaktadır.
