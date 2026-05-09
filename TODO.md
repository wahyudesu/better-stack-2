# server
- update ke openapi.yaml paling terbaru

# web
 
[post]
- [ ] perbaiki ui new post nya terlebih dahulu
- [ ] pastikan new posts terintrgeasi ke server sehinga bisa upload konten darisana

[dashboard]
- [ ] cukup pake mock data

[analytics]
- [ ] nanti deh

[ads]
- [ ] cukup pake mock data

[inbox]
- [ ] cukup pake mock data

[settings]
- [ ] beberapa sudah terintegrasi

# landing

[MARKETING IDEAS]
- free tools: linkedin preview, personal branding  
- blogs:puluhan hooks untuk threads

halo aku wahyu founder dari zenpost.in, social media  schedule let me know jika ada yang bisa aku bantu

jenis label nya TOFU, MOFU, BOFU


# checklist all
- [ ] landingpage hampir jadi
- [ ] isi copywriting landingpage nya udah selesai
- [ ] mekanisme waitlist nya clerk berhasil di production
- [ ]

# prompt

buatkan saya planning untuk integrasi data dari web dengan server route ads dengan buatkan saya PLAN.md di @ads, pertama cek dulu semua data yang dibutuhkan dari server selanjutnya sesuaikan denagn data yang ada di ui

jika sudah sama data nya maka buatkan saya planning, terapkan jugua best practice seperti handling error, skeleton



buatkan saya planning untuk intergasi clerk organization dgn user/tetams yang ada di server zernio

# cloudflare deploy fix (2026-05-07)
```
NEXT_PUBLIC_CONVEX_URL=https://trustworthy-basilisk-416.convex.cloud \
NEXT_PUBLIC_CONVEX_SITE_URL=https://trustworthy-basilisk-416.convex.site \
pnpm dlx @opennextjs/cloudflare build && \
  CONVEX_DEPLOY_KEY="prod:trustworthy-basilisk-416|eyJ2MiI6IjczNDY4ZTBlMGNiZTQ3Mjg5NDVjNTkwNjNiNjc1ZjQ1In0=" \
  npx convex deploy && \
  pnpm dlx @opennextjs/cloudflare deploy
```

```
pnpm dlx @opennextjs/cloudflare build && CONVEX_DEPLOY_KEY="prod:trustworthy-basilisk-416|eyJ2MiI6IjczNDY4ZTBlMGNiZTQ3Mjg5NDVjNTkwNjNiNjc1ZjQ1In0=" npx convex deploy && pnpm dlx @opennextjs/cloudflare deploy
```

dgn menggunakan multi agent secara parallel lakukan pnpm build pada landing, web dan server, jika ada error perbaiki, iterasi hingga ketiganya berhasil di build

sesuaikan kembali yah, karena aku gajadi pake drizzle orm tapi aku pake full supabase, dan gaada di monorepo yah, setupnya fullstack di aplikasi web ini

ini udah cukup buat di
- [ ] auth berhasil
- [ ] social media connection berhasil
- [ ] fetch content berhasil
- [ ] harus clean cuy, dan terapkan best practice