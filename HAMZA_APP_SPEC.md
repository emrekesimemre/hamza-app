# Hamza Günlük Macera — Ürün Spesifikasyonu

**Version:** v1.0 — Core MVP  
**Target User:** 7 yaşında, 1. sınıfı tamamlamış çocuk  
**Primary Goal:** Çocuğun ekran başında gereksiz zaman geçirmeden günlük akademik tekrarlarını ve problem çözme becerilerini geliştirmek.

---

# 1. Proje Tanımı

Bu proje, 7 yaşındaki Hamza için tasarlanmış, oyunlaştırılmış ve çocuk dostu bir eğitim web uygulamasıdır.

**Temel amaçlar:**

- Günlük akademik kazanımları kısa ve eğlenceli görevlerle tekrar ettirmek
- Problem çözme ve algoritmik düşünme becerisini geliştirmek
- Çocuğun ekran başında geçirdiği süreyi sınırlamak
- Öğrenmeyi oyunlaştırmak
- Çocuğun seviyesine göre görev zorluğunu zaman içinde adapte etmek
- Her gün farklı görevler sunmak
- Ebeveynin çocuğun gelişimini takip edebilmesini sağlamak

**Ana konsept:** 🦖 Bugünkü Maceran

Çocuk her gün **tam 3 görev** tamamlar. Görevleri bitirince yıldız kazanır; yıldızlarla avatar/skin/ödül satın alabilir.

---

# 2. Temel Kullanıcı Deneyimi

Uygulama açıldığında doğrudan günlük görev ekranı gösterilir.

**İlk açılış (onboarding — bir kez):**

1. "Her gün 3 macera seni bekliyor!"
2. "Görevleri bitir, yıldız topla!"
3. "Bugünkü maceran bitince yarın yeniden gel!"

Onboarding tamamlandığında `onboardingCompleted: true` store'a yazılır.

**Günlük dashboard örneği:**

```text
🦖 BUGÜNKÜ MACERAN

⭐ 125 Yıldız

Bugün 3 maceran var!

┌──────────────────────┐
│ 🚂 Sayı Treni        │
│ Matematik            │
│ ⭐ +10                │
│       BAŞLA          │
└──────────────────────┘

┌──────────────────────┐
│ 🦕 Dinozorun Yolunu Bul│
│ Mantık               │
│ ⭐ +15                │
│       BAŞLA          │
└──────────────────────┘

┌──────────────────────┐
│ 🍎 Sağlıklı Beslenme │
│ Hayat Bilgisi        │
│ ⭐ +10                │
│       BAŞLA          │
└──────────────────────┘
```

**Görev sırası UX:**

- 3 görev de baştan görünür; çocuk **istediği sırayla** oynayabilir
- Görevler birbirine kilitli değildir (`locked` status yok)
- `order` alanı yalnızca **kartların görüntüleme sırası** içindir (deterministik UI)

**Görev tamamlandığında:**

```text
🎉 HARIKA!
Görevi tamamladın!
⭐ +10 Yıldız
[ DEVAM ET ]
```

**3/3 tamamlandığında:**

```text
🏆 BUGÜNKÜ MACERAN TAMAMLANDI!
Harika iş çıkardın Hamza!
⭐ Bugün kazandığın: 35
⭐ Toplam yıldızın: 160
Yarın yeni maceralar seni bekliyor! 🚀
[ ÖDÜL MAĞAZASINA GİT ]
```

---

# 3. Temel Kurallar ve Kısıtlamalar

## 3.1 Günlük Görev Sınırı

- Çocuk günde **maksimum 3 görev** tamamlayabilir.
- **Her gün tam 3 görev** üretilir (değişken sayı yok).
- 3 görev tamamlandığında:
  - Yeni görev açılmaz
  - `isLocked = true`
  - `lockReason = 'missions'`
  - Kilit ekranı gösterilir

## 3.2 Günlük Maksimum Kullanım Süresi

- Varsayılan: **30 dakika** aktif kullanım
- Ebeveyn modundan **25 / 30 / 35 dk** ayarlanabilir (parent only)
- MVP'de görev seçimi süreye göre yapılmaz — limit **hard cap** olarak uygulanır

**Aktif süre kuralları:**

- Timer yalnızca sekme **görünür ve odakta** iken ilerler
- `document.visibilityState === 'visible'` + window focus kontrolü
- Arka plandaki sekme süreye dahil edilmez
- `dailyUsedSeconds` + segment bazlı `lastActiveTimestamp` ile drift önlenir

**Zaman uyarıları:**

| Kalan süre | Mesaj |
|------------|-------|
| 10 dk | "Harika gidiyorsun!" |
| 5 dk | "Son macerana hazırlan!" |
| 0 dk | `timeLimitReached = true` — soft lock (aşağıya bak) |

**Süre dolduğunda net kurallar (MVP) — Soft Lock:**

1. `dailyUsedSeconds >= dailyTimeLimitSeconds` olduğunda **`timeLimitReached = true`** yapılır
2. Yeni görev **başlatılamaz** (`timeLimitReached` veya `isLocked` iken `startMission` reddedilir)
3. **Aktif görev varsa (`currentMissionId !== null`):** `isLocked` **hemen true yapılmaz** — çocuk mevcut soru turunu bitirebilir (unmount/kilit ekranı patlaması olmamalı)
4. Aktif görev **tamamlandığında veya görevden çıkıldığında:** `timeLimitReached === true` ise `lockDay('time')` çağrılır
5. Süre dolduğunda yarım kalan görev **yıldız kazandırmaz** — `timedOutBeforeComplete = true`
6. Yarım görev **ertesi güne taşınmaz**

**Önemli:** Route guard veya layout **`isLocked` true olunca tüm uygulamayı kapatmamalı**. Soft lock sırasında mission sayfası açık kalabilir; kilit yalnızca görev bittikten sonra devreye girer.

## 3.3 Günlük Rotasyon (Konu Havuzu)

Rotasyon "bugün kaç görev" değil, **"bugün hangi derslerden seçilecek"** anlamına gelir.

**Örnek konu havuzu:**

```text
Pazartesi  → math, logic
Salı       → turkish, life
Çarşamba   → math, turkish, logic
Perşembe   → life, math
Cuma       → turkish, logic, math
```

**Seçim algoritması:**

1. Günün konu havuzunu al
2. Havuzdaki mission type'lardan adayları listele
3. `recentMissionHistory` üzerinden son 3 günde tamamlanan `missionId`'leri filtrele
4. `difficultyByType` ile zorluk uygula
5. **Tam 3 görev** seç (2 ders varsa birinden 2, diğerinden 1)
6. Seçilen görevlere `order: 0 | 1 | 2` ata (görüntüleme sırası)
7. Aynı gün içinde görev listesi **değişmez**

**Recently played:** Son **3 gün** içinde tamamlanan `missionId` tekrar verilmez. Gün değişiminde 3 günden eski kayıtlar `recentMissionHistory`'den temizlenir.

---

# 4. Çocuk Dostu UI/UX

- Büyük butonlar, büyük ikonlar, az metin
- Görsel anlatım, kolay okunabilir fontlar
- Canlı ama göz yormayan renkler
- Mobil/tablet uyumlu, büyük tıklama alanları
- Anında görsel geri bildirim, başarıda konfeti
- Ses efektleri opsiyonel (`soundEnabled`)
- Yanlış cevaplarda cezalandırıcı dil **kullanılmaz**

```text
✅ Doğru: "Bir daha deneyelim! 💪"
❌ Kullanılmaz: "Kaybettin!", "Yıldız kaybettin!"
```

**Header:** Seçili avatar/skin görsel geri bildirim olarak gösterilir.

---

# 5. Teknoloji Yığını

## Frontend

- **Vite + React + TypeScript**
- React Router

## Styling

- Tailwind CSS

## State

- Zustand + `persist` middleware → `localStorage`

## Icons

- Lucide React

## Animation

- Phase 1: CSS animations + basit confetti
- Framer Motion: Phase 2+ (gerektiğinde)

## Sound

- Opsiyonel, kapatılabilir
- Parent mode'dan da kontrol edilebilir

## Phase 1 sonrası (opsiyonel)

- PWA (`vite-plugin-pwa`) — offline/tablet

---

# 6. Proje Mimarisi

```text
src/
├── pages/                        # React Router
│   ├── layout.tsx
│   ├── index.tsx                 # Dashboard
│   ├── mission/[missionId].tsx
│   ├── rewards.tsx
│   └── parent/
│       ├── index.tsx
│       └── progress.tsx
│
├── components/
│   ├── layout/
│   │   ├── AppHeader.tsx
│   │   ├── StarCounter.tsx
│   │   ├── DailyProgress.tsx
│   │   └── AppLockScreen.tsx     # lockReason'a göre mesaj
│   ├── missions/
│   ├── rewards/
│   ├── parent/
│   └── common/
│
├── missions/
│   ├── catalog/missionCatalog.ts
│   ├── engine/
│   │   ├── missionGenerator.ts
│   │   ├── rotationEngine.ts
│   │   ├── difficultyEngine.ts   # Phase 1: pasif, Phase 2: aktif
│   │   └── missionSelector.ts
│   ├── types/mission.types.ts
│   └── modules/
│       ├── _stub/                # Phase 1 — placeholder runner
│       ├── math/
│       ├── turkish/
│       ├── life/
│       └── logic/
│
├── store/useMissionStore.ts
├── types/
├── constants/
│   ├── dailyRotation.ts
│   └── rewards.ts
└── utils/
    ├── date.ts                   # Europe/Istanbul, YYYY-MM-DD
    ├── timer.ts
    └── storage.ts
```

**Mimari akış:**

```text
Mission Catalog
      ↓
Daily Topic Pool
      ↓
Recently Played Filter (recentMissionHistory)
      ↓
Difficulty Engine
      ↓
Mission Selector (3 görev + order)
      ↓
Zustand Persist
      ↓
Dashboard
      ↓
Stub / Real Mission Runner
      ↓
Complete Mission (idempotent)
      ↓
Stars + Progress + recentMissionHistory
      ↓
3/3 OR 30 Minutes
      ↓
Lock Screen (lockReason)
```

Phase 2'de gerçek modüller (`RhythmicCountingMission`, `MultiplicationMission` vb.) aynı runner interface'i üzerinden takılır.

---

# 7. Mission Data Model

```ts
export type MissionType =
  | 'rhythmic-counting'
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'opposites'
  | 'syllables'
  | 'seasons'
  | 'healthy-food'
  | 'algorithm'
  | 'stub';                         // Phase 1 placeholder

export type Subject = 'math' | 'turkish' | 'life' | 'logic';
export type Difficulty = 1 | 2 | 3;
export type MissionStatus = 'pending' | 'active' | 'done';
export type LockReason = 'missions' | 'time' | null;

export interface CompletionCriteria {
  minQuestions: number;
  minAccuracy: number;              // 0–1, örn. 0.6
}

// completionCriteria katalog metadata'sıdır.
// Phase 2+'dan itibaren aktif değerlendirme için kullanılır.
// Phase 1 Stub Runner'da görev tamamlanması doğrudan "Macera Tamamla" aksiyonu ile simüle edilir.

export interface Mission {
  id: string;
  type: MissionType;
  subject: Subject;
  title: string;
  description?: string;
  icon: string;
  difficulty: Difficulty;
  rewardStars: number;
  estimatedMinutes: number;         // Sadece metadata — parent dashboard; MVP'de seçime etki etmez
  completionCriteria: CompletionCriteria;
}

export interface DailyMission {
  missionId: string;
  order: number;                    // 0 | 1 | 2 — yalnızca görüntüleme sırası
  status: MissionStatus;
  resolvedDifficulty: Difficulty;
}

export interface RecentMissionEntry {
  missionId: string;
  completedDate: string;            // 'YYYY-MM-DD' — Europe/Istanbul
}

export interface MissionProgress {
  missionId: string;
  step: number;
  correctCount: number;
  wrongCount: number;
  startedAt: string;                // ISO timestamp
  isCompleted: boolean;
  timedOutBeforeComplete: boolean;  // süre doldu, yıldız verilmedi
}
```

---

# 8. Mission Engine

**Engine sorumlulukları:**

1. Günün konu havuzunu belirle
2. `recentMissionHistory` ile son 3 günde oynanan görevleri filtrele
3. Zorluk seviyesini uygula
4. Tam 3 görev seç (2 dersli günlerde dağıtım yap)
5. `order` ata, günlük state'e kaydet — aynı gün değişmez

**`estimatedMinutes` notu:** İleride görev süresine göre seçim yapılabilir (örn. 8+7+10 = 25 dk). MVP'de kullanılmaz.

---

# 9. Adaptive Difficulty

**Phase 1:** Altyapı hazır, tüm görevler Level 1 başlar.

**Phase 2+:**

```text
3 doğru üst üste → zorluk +1 (max 3)
Çok fazla yanlış  → zorluk -1 (min 1)
```

Store: `difficultyByType: Record<MissionType, Difficulty>`

Her görev oturumunda doğru/yanlış loglanır (`progress`).

---

# 10. Zustand Store

```ts
interface MissionStore {
  // Kimlik & gün
  childName: string;                          // 'Hamza'
  lastLoginDate: string;                      // son aktif gün — 'YYYY-MM-DD', Europe/Istanbul

  // Günlük görevler
  dailyMissions: DailyMission[];
  dailyCompletedMissionCount: number;
  completedTodayIds: string[];                // idempotent completeMission

  // Süre & kilit
  dailyUsedSeconds: number;
  dailyTimeLimitSeconds: number;              // default 1800, parent ayarlar
  timeLimitReached: boolean;                  // süre doldu; aktif görev varsa soft lock
  isLocked: boolean;
  lockReason: LockReason;

  // Aktif görev
  currentMissionId: string | null;
  currentMissionProgress: MissionProgress | null;

  // Geçmiş & adaptasyon
  recentMissionHistory: RecentMissionEntry[];
  difficultyByType: Record<MissionType, Difficulty>;
  progress: ProgressLog[];                    // subject/type bazlı istatistik

  // Ödüller
  stars: number;
  ownedRewards: string[];
  activeAvatar: string | null;
  activeDinoSkin: string | null;

  // Ayarlar
  soundEnabled: boolean;
  onboardingCompleted: boolean;
  parentPinHash: string | null;              // basit erişim koruması — gerçek güvenlik değil
}
```

**Bugünün tarihi:** Store'da tutulmaz. Her açılışta `getTodayISO()` ile hesaplanır.

**Actions:**

```ts
initializeNewDay(today: string)             // gün değişiminde tek seferlik reset + yeni görevler
completeMission(missionId: string)
addStars(amount: number)
spendStars(amount: number)
startMission(missionId: string)
exitMission()                               // görevden çık — timeLimitReached ise lock
resetDailyProgress()                        // parent only
lockDay(reason: LockReason)
finalizeTimeLockIfNeeded()                  // timeLimitReached + görev yok → lockDay('time')
setSoundEnabled(enabled: boolean)
setDailyTimeLimit(seconds: number)          // parent only
setParentPin(pin: string)
pruneRecentMissionHistory()                 // 3 günden eski kayıtları sil
```

**Kurallar:**

- `completeMission` **idempotent** — `completedTodayIds` içindeyse tekrar yıldız vermez
- `timedOutBeforeComplete === true` ise `completeMission` yıldız vermez
- `startMission` reddedilir: `isLocked`, `timeLimitReached`, veya görev zaten `done`
- Route guard: yalnızca `/mission/*` — detay Bölüm 22

**`startMission` — senkronizasyon:**

```text
startMission(missionId)
  ├── isLocked veya timeLimitReached ise reddet
  ├── ilgili dailyMission.status = 'active'
  ├── currentMissionId = missionId
  └── currentMissionProgress = { ..., isCompleted: false, timedOutBeforeComplete: false }
```

**`completeMission` — atomik güncelleme (tek transaction):**

Başarılı tamamlamada aşağıdaki adımlar **birlikte** uygulanmalıdır.

```text
completeMission(missionId)
  ├── completedTodayIds'e ekle (yoksa)
  ├── ilgili dailyMission.status = 'done'
  ├── dailyCompletedMissionCount++
  ├── stars ekle (timedOutBeforeComplete değilse)
  ├── recentMissionHistory'e { missionId, completedDate: lastLoginDate } ekle
  ├── currentMissionProgress.isCompleted = true
  ├── currentMissionId = null
  ├── dailyCompletedMissionCount >= 3 ise lockDay('missions')
  ├── değilse finalizeTimeLockIfNeeded()
  └── getTodayISO() !== lastLoginDate ise initializeNewDay(getTodayISO())  // gece yarısı geçişi
```

**Gece yarısı geçişi (Midnight Crossover):**

Örnek: çocuk 23:45'te göreve girer, 00:05'te tamamlar.

- Aktif görev varken gece yarısı olursa **gün hemen resetlenmez**
- `completeMission` önce mevcut günün (`lastLoginDate`) state'ine yazar (yıldız, görev `done`, sayaç)
- Ardından `getTodayISO() !== lastLoginDate` ise `initializeNewDay(today)` çalışır → yeni 3 görev, sıfır süre
- `recentMissionHistory.completedDate` için tamamlanan görev **`lastLoginDate`** ile kaydedilir (yeni güne yazılmaz)

**`exitMission` — görevden çıkış:**

```text
exitMission()
  ├── dailyMission.status = 'pending' (veya done değilse pending)
  ├── currentMissionId = null
  ├── currentMissionProgress = null
  └── finalizeTimeLockIfNeeded()
```

**`finalizeTimeLockIfNeeded`:**

```text
timeLimitReached === true && currentMissionId === null  →  lockDay('time')
```

**Parent PIN:** Çocuğun yanlışlıkla ebeveyn alanına girmesini engelleyen basit erişim korumasıdır. localStorage manipülasyonu veya PIN kırma MVP kapsamında kabul edilebilir sınırlamadır.

---

# 11. Gün Değişimi

```text
Uygulama açıldı
      ↓
const today = getTodayISO()   // Europe/Istanbul, 'YYYY-MM-DD'
      ↓
lastLoginDate === today ?
      │
      ├── Evet → mevcut state devam
      │
      └── Hayır
            ├── currentMissionId !== null ?
            │     ├── Evet → gün resetini ERTELE (midnight crossover — görev bitsin)
            │     └── Hayır → initializeNewDay(today)
            └── (görev bitince completeMission/exitMission içinde initializeNewDay)
```

**`initializeNewDay(today)` adımları:**

```text
├── 3 yeni görev üret (order ile)
├── dailyUsedSeconds = 0
├── timeLimitReached = false
├── dailyCompletedMissionCount = 0
├── completedTodayIds = []
├── isLocked = false
├── lockReason = null
├── currentMissionProgress = null
├── currentMissionId = null
├── pruneRecentMissionHistory()
└── lastLoginDate = today
```

**Not:** `today` store'da tutulmaz; yalnızca `lastLoginDate` persist edilir.

---

# 12. Günlük Kilit Mekanizması

**Tetikleyiciler:**

```ts
dailyCompletedMissionCount >= 3  →  lockDay('missions')   // anında

dailyUsedSeconds >= dailyTimeLimitSeconds
  →  timeLimitReached = true
  →  currentMissionId === null ise lockDay('time')   // hard lock
  →  currentMissionId !== null ise soft lock (görev bitene kadar bekle)
```

**Dashboard kilit UI:**

- `isLocked === true` iken dashboard **görev listesi göstermez** — kilit ekranını gösterir
- `/rewards` ve `/parent` rotaları **her zaman erişilebilir** (route guard bunları engellemez)
- Mağazadan dashboard'a dönünce yine kilit UI gösterilir

**Kilit ekranı — missions:**

```text
🔒 BUGÜNKÜ MACERAN TAMAMLANDI
3 macerayı da bitirdin, harika iş!
Yarın yeni görevler seni bekliyor! 🌟
⭐ Toplam Yıldız: 125
[ ÖDÜLLERİM ]
```

**Kilit ekranı — time:**

```text
🔒 BUGÜNLÜK SÜREN DOLDU
Bugün 30 dakika harika çalıştın!
Dinlenme zamanı — yarın devam! 🌙
⭐ Toplam Yıldız: 125
[ ÖDÜLLERİM ]
```

Kilit ekranından yeni görev başlatılamaz. Ödül mağazası erişilebilir.

---

# 13. Phase 1 — Altyapı (Implementasyon Sırası)

### Step 1–3

Proje kurulumu (Vite + React + TS + Tailwind + Zustand + Lucide), klasör yapısı

### Step 4–7

Mission types, catalog, dailyRotation, missionGenerator

### Step 8–9

useMissionStore + persist middleware

### Step 10–12

Gün değişimi, aktif süre timer, lock mekanizması (`lockReason`)

### Step 13–14

Dashboard + kilit ekranı (iki mesaj tipi)

### Step 15

Tamamlanma animasyonları (confetti + modal)

### Step 16

Basit parent mode (PIN + ilerleme + Bugünü Sıfırla)

### Step 17 — Stub Mission Runner

Phase 1'de gerçek oyun yok; uçtan uca akış testi için:

```text
/mission/[id] → StubMissionRunner
  → "Macera Tamamla" butonu (completionCriteria değerlendirilmez)
  → completeMission() → yıldız → dashboard
```

`missions/modules/_stub/` — Phase 2'de gerçek modülle değiştirilir.

**Phase 1 bittiğinde çalışan akış:**

```text
Açılış → gün kontrolü → 3 görev → dashboard
  → stub görev başlat → timer aktif
  → tamamla → yıldız → 3/3 veya 30dk → kilit
```

---

# 14. Phase 2 — Matematik

## 14.1 Ritmik Sayma

1'er, 2'er, 3'er, 4'er, 5'er — görsel dizi

## 14.2 Çarpım Tablosu

1'ler, 2'ler, 3'ler — görsel gruplar (🍎🍎🍎)  
Zorluk 1'de başlar; adaptif engine aktif

## 14.3 Toplama / Çıkarma

Sonraki sürüm genişlemesi

---

# 15. Phase 3 — Türkçe ve Hayat Bilgisi

- Zıt anlamlılar (eşleştirme)
- Heceler (eksik hece seçimi)
- Sağlıklı beslenme (iki sepet)
- Mevsimler (sıralama)

---

# 16. Phase 4 — Algoritma ve Mantık

**Dinozor Hedef Avı**

- İlk oyun: **3×3 tutorial grid**
- Sonra 5×5 grid
- Max **5 komut** (MVP)
- Adım adım animasyon + ÇALIŞTIR

---

# 17. Phase 5 — Ödül Sistemi

```text
⭐ 125
🛴 Mavi Scooter    50 ⭐
🎩 Dino Şapka       30 ⭐
🦖 Ateş Dinozor    100 ⭐
```

- Satın alınan ödül tekrar alınamaz
- Aktif avatar/skin seçilebilir
- Yetersiz yıldız: "15 ⭐ daha lazım!" (pozitif dil)
- Header'da aktif avatar görünür

**Ekonomi pacing:** ~35 ⭐/gün → küçük ödül 1–3 gün, büyük ödül ~1 hafta

---

# 18. Parent Mode

**Erişim:** Dashboard'da "👨‍👩‍👦 Ebeveyn Alanı" → PIN (hash'lenmiş, basit erişim koruması)

**Görünür bilgiler:**

- Bugün: X/3 görev, kullanım süresi
- Son 7 gün aktivite grafiği
- Ders bazlı başarı oranı
- Zorlanılan görevler (progress log)
- Görev başına tahmini süre (`estimatedMinutes` metadata)
- Son "Bugünü Sıfırla" tarihi

**Ebeveyn aksiyonları:**

- Bugünü Sıfırla
- Günlük süre limiti (25/30/35 dk)
- Ses aç/kapa
- PIN değiştir

---

# 19. State Persistence

```ts
persist(store, { name: 'hamza-mission-storage' })
```

**localStorage'da tutulanlar:**

```text
lastLoginDate, dailyMissions, stars
dailyUsedSeconds, dailyTimeLimitSeconds, timeLimitReached
dailyCompletedMissionCount, completedTodayIds
recentMissionHistory, difficultyByType, progress
ownedRewards, activeAvatar, activeDinoSkin
currentMissionProgress, isLocked, lockReason
soundEnabled, onboardingCompleted, parentPinHash
```

**Bilinen MVP sınırlamaları (kabul edilebilir):**

- localStorage manipülasyonu mümkün
- Parent PIN gerçek güvenlik sağlamaz
- Tek cihaz, cloud save yok
- İleride backend ile çözülür

---

# 20. MVP'de Yapılmaması Gerekenler

- Backend, auth, database
- Multiplayer, leaderboard, cloud save
- AI generated questions
- Gerçek para, reklam, sosyal özellikler
- Framer Motion ağır animasyonlar (Phase 1)
- Görev seçiminde `estimatedMinutes` tabanlı süre optimizasyonu
- Streak sistemi (`currentStreak`, `lastCompletedDay`)
- `completionCriteria` tabanlı görev tamamlama değerlendirmesi (Phase 1'de stub)

---

# 21. Gelecek Versiyonlar

| Versiyon | İçerik |
|----------|--------|
| v1.1 | Daha fazla görev, toplama/çıkarma, gelişmiş adaptif zorluk, `completionCriteria` değerlendirmesi |
| v1.2 | Haftalık rapor, ders grafikleri, streak rozetleri (3/3 ardışık gün → +1; gün atlanırsa sıfırlanır) |
| v1.3 | Backend, hesap, cloud save, çoklu cihaz |
| v2.0 | AI kişiselleştirme, sesli görev/cevap, süreye göre görev seçimi |

---

# 22. Geliştirme Kuralları (Cursor)

1. TypeScript — `any` kullanma
2. Mission logic UI'da değil, engine'de
3. Görevler merkezi katalogdan
4. Günlük görevler aynı gün değişmez
5. Sayfa yenilenince ilerleme kaybolmaz
6. Gün değişince reset — aktif görev yoksa hemen; varsa görev bitene kadar ertelenir
7. 3 görev tamamlanınca anında kilit; süre dolunca soft lock → görev bitince kilit
8. Arka plan sekmesi süreye dahil değil
9. Pozitif hata mesajları
10. Büyük, dokunmatik uyumlu UI
11. Yeni mission type → engine değişmez
12. Over-engineering yok
13. Her adımda çalışan, test edilebilir yapı
14. `completeMission` idempotent
15. Route guard **yalnızca** `/mission/*` rotalarını engeller — `/rewards` ve `/parent` her zaman açık
16. `isLocked === true` iken dashboard görev listesi yerine kilit UI gösterir
17. `DailyMission.order` görüntüleme içindir — görev kilitleme için kullanılmaz
18. `recentMissionHistory` tarihli tutulur; 3 günden eski kayıtlar temizlenir
19. `todayDate` store'da tutulmaz — `getTodayISO()` runtime'da hesaplanır
20. `completeMission` atomik transaction — status senkronizasyonu tek yerde
21. Phase 1'de streak ve `completionCriteria` değerlendirmesi implement edilmez
22. `timeLimitReached` aktif görev varken `isLocked` yapmaz — soft lock; görev bitince `finalizeTimeLockIfNeeded`
23. Gece yarısı geçişinde aktif görev varsa gün reseti ertelenir; tamamlama önce `lastLoginDate`'e yazılır
24. Layout/route guard `isLocked` ile tüm app'i unmount etmemeli — mission soft lock sırasında açık kalabilir

---

# 23. İlk Hedef

**Phase 1 tamamlanmış sayılır ancak:**

- Stub mission runner çalışıyorsa
- 3 görev → yıldız → kilit akışı uçtan uca test edildiyse
- İki kilit mesajı (`missions` / `time`) doğru gösteriliyorsa
- Gün değişimi timezone ile doğru çalışıyorsa (midnight crossover dahil)
- Soft lock: süre dolunca aktif görev unmount olmuyor, bitince kilit geliyor
- `/rewards` kilitliyken erişilebilir, dashboard'a dönünce kilit UI gösteriliyor
- `recentMissionHistory` ve `MissionProgress` doğru persist ediliyorsa

**Phase 2'ye ancak Phase 1 bu kriterlerle bittikten sonra geç.**
