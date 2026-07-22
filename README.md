# Hamza Günlük Macera 🦖

7 yaşındaki Hamza için oyunlaştırılmış günlük eğitim web uygulaması.

## Özellikler (Phase 1 MVP)

- Her gün **3 macera** (matematik, Türkçe, hayat bilgisi, mantık)
- **Yıldız** kazanma ve **ödül mağazası**
- **30 dakika** günlük kullanım limiti (ebeveyn: 25/30/35 dk)
- Soft lock: süre dolunca aktif görev bitene kadar devam eder
- Gün değişimi (Europe/Istanbul timezone)
- Ebeveyn modu (PIN, ilerleme, ayarlar)
- Stub görev runner (Phase 2'de gerçek oyunlar gelecek)

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini aç.

## Build

```bash
npm run build
npm run preview
```

## Teknoloji

- Vite + React + TypeScript
- Tailwind CSS
- Zustand (localStorage persist)
- React Router
- Lucide React

## Proje Yapısı

```
src/
├── pages/           # Dashboard, mission, rewards, parent
├── components/      # UI bileşenleri
├── missions/        # Katalog, engine, stub runner
├── store/           # Zustand store
├── constants/       # Rotasyon, ödüller
└── utils/           # Tarih, timer, confetti
```

Detaylı spesifikasyon için `HAMZA_APP_SPEC.md` dosyasına bak.
