HarcaMa

Fiş/fatura fotoğrafını çek → önizle → cihaza kaydet → meta ekle ve (sonraki sprintte) OCR ile satırları çıkar. Expo + React Native + TypeScript ile geliştirilmiştir.

Özellikler (şu an)

📸 Kamera ile çekim (Expo Camera)

🔎 Önizleme ve cihaza kaydetme (Expo FileSystem)

🗂️ Kayıtları listeleme / silme

📝 Meta formu: mağaza adı & toplam tutar

💾 Yerel indeks: receipts/index.json

Not: Expo SDK 54 üzerinde expo-file-system/legacy kullanılmaktadır; ileride yeni Directory/File API’sine geçirilecektir.

Yol Haritası (özet)

✅ Sprint 0: Proje iskeleti (Expo Router, TS)

✅ Sprint 1: Çek → önizle → kaydet → listele

✅ Sprint 2: Meta formu + index.json

⏭️ Sprint 2.5: OCR Sunucusu (PaddleOCR, Docker) + istemci entegrasyonu

⏭️ Sprint 3: Satır-pars etme, otomatik kategori önerisi

⏭️ Sprint 4: Hesap & bulut senkronizasyonu (temel API)

⏭️ Sprint 5: Yayın hazırlığı (ikon/splash, gizlilik, mağaza metinleri)

Teknolojiler

App: Expo (React Native), TypeScript, Expo Router

Kamera: expo-camera

Dosya sistemi: expo-file-system/legacy

UI yardımcıları: react-native-gesture-handler, react-native-screens, react-native-safe-area-context

Gereksinimler

Node.js 20 LTS

Paket yöneticisi: npm (veya pnpm/yarn)

Test için Expo Go (iOS/Android) ya da emülatör

(OCR için) Docker (Seçenek A — self-hosted PaddleOCR)

Hızlı Başlangıç
# 1) Kurulum
npm i

# 2) Geliştirme sunucusu
npx expo start

# 3) Cihazda aç (QR) veya emülatör
# iOS: i, Android: a, Web: w


Kullanım akışı:

Ana sayfadan Fiş Tara → fotoğraf çek → önizle

Kaydet → /receipts/new formu açılır

Mağaza & toplam gir → Kaydet → /receipts listesine düşer

Proje Yapısı
harcama/
  app/
    _layout.tsx
    index.tsx
    scan/
      index.tsx
    receipts/
      index.tsx
      new.tsx
  src/
    utils/
      fs.ts           # FileSystem yardımcıları + index.json
  app.json
  package.json
  tsconfig.json
  README.md

NPM Script’leri
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web"
}

Konfigürasyon

app.json → Kamera izin metni:

{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        { "cameraPermission": "Kamera erişimine ihtiyacımız var" }
      ]
    ]
  }
}


Router → package.json içinde "main": "expo-router/entry", plugins: ["expo-router"].

Yerel Depolama

Fotoğraflar: FileSystem.documentDirectory/receipts/receipt_<timestamp>.jpg

Meta indeks: FileSystem.documentDirectory/receipts/index.json

Silme işlemi: dosya + indeks kaydı birlikte kaldırılır.

OCR Sunucusu (Seçenek A — PaddleOCR, Docker)

Entegrasyon Sprint 2.5’te eklenecek. Hızlı kurulum:

# Genel metin OCR
docker run -d --name paddle-ocr -p 8080:8080 \
  ghcr.io/paddlepaddle/paddleocr-server:latest

# Tablo/Yapı (fiş satırları için önerilir)
docker run -d --name paddle-ppstructure -p 8081:8080 \
  ghcr.io/paddlepaddle/paddleocr-ppstructure-server:latest


İstemciden POST örneği:

const form = new FormData();
form.append('image', { uri, name: 'receipt.jpg', type: 'image/jpeg' } as any);
await fetch('http://<HOST>:8081/structure', { method: 'POST', body: form });

Sorun Giderme

404 / Page not found: app/scan/index.tsx ve app/receipts/index.tsx yollarını kontrol et; _layout.tsx içinde Stack.Screen tanımları olmalı.

Gesture hatası: _layout.tsx’in en üstünde import 'react-native-gesture-handler'; bulunsun.

Windows’ta iOS debug uyarısı: ios_webkit_debug_proxy ENOENT uyarısı Windows’ta normaldir; yok sayılabilir.

Peer dependency çatışmaları: npm config set legacy-peer-deps true → npm i.

Metro cache: npx expo start -c.

Katkı & Versiyonlama

Commit formatı önerisi: Conventional Commits (feat:, fix:, chore: …)

Etiketleme: v0.1.0 (Sprint 1), v0.2.0 (Sprint 2)…
