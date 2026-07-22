import type { Difficulty } from '@/missions/types/mission.types'
import type { RiddleQuestion } from '@/missions/modules/types'
import { randomInt, shuffle } from '@/missions/modules/math/mathUtils'

const RIDDLES: { text: string; answer: string; wrong: [string, string] }[] = [
  {
    text: 'Gündüz açılır, gece kapanır; ağlamadan yaş akıtır. Nedir?',
    answer: 'Göz',
    wrong: ['Kapı', 'Perde'],
  },
  {
    text: 'Yerinde durur, su taşır; döndürünce akar. Nedir?',
    answer: 'Musluk',
    wrong: ['Nehir', 'Bulut'],
  },
  {
    text: 'Kökü toprakta, başı gökte; yazın gölge verir. Nedir?',
    answer: 'Ağaç',
    wrong: ['Şemsiye', 'Dağ'],
  },
  {
    text: 'Okulda sıralanır, üzerinde ders çalışılır. Nedir?',
    answer: 'Sıra',
    wrong: ['Tahta', 'Kalem'],
  },
  {
    text: 'Dili yok ama konuşur; cebime sığar, uzakları arar. Nedir?',
    answer: 'Telefon',
    wrong: ['Radyo', 'Ayna'],
  },
  {
    text: 'Sabah doğar, akşam batar; gökyüzünde parlarım. Nedir?',
    answer: 'Güneş',
    wrong: ['Ay', 'Yıldız'],
  },
  {
    text: 'Beyaz rengim var, inekten gelirim; kemikleri güçlendirir. Nedir?',
    answer: 'Süt',
    wrong: ['Su', 'Ekmek'],
  },
  {
    text: 'İki tekerim var, pedal çevrilir; sokakta giderim. Nedir?',
    answer: 'Bisiklet',
    wrong: ['Araba', 'Kaykay'],
  },
  {
    text: 'Kışın yağarım beyaz, soğuk havada kalırım. Nedir?',
    answer: 'Kar',
    wrong: ['Yağmur', 'Dolu'],
  },
  {
    text: 'Sayfa sayfa okunur, bilgi veririm. Nedir?',
    answer: 'Kitap',
    wrong: ['Gazete', 'Defter'],
  },
  {
    text: 'Suyun üstünde yüzerim, yelkenim olur. Nedir?',
    answer: 'Gemi',
    wrong: ['Balık', 'Ada'],
  },
  {
    text: 'Gece parlarım, gökyüzünde küçüğüm. Nedir?',
    answer: 'Yıldız',
    wrong: ['Ay', 'Güneş'],
  },
  {
    text: 'Sınıfta tahta karşısında ders anlatırım; öğrencilerim var. Nedir?',
    answer: 'Öğretmen',
    wrong: ['Öğrenci', 'Müdür'],
  },
  {
    text: 'Yağmurlu günde açılır, seni ıslaklıktan korur. Nedir?',
    answer: 'Şemsiye',
    wrong: ['Mont', 'Şapka'],
  },
  {
    text: 'Dört bacağı var ama yürüyemez; üzerinde yemek yenilir. Nedir?',
    answer: 'Masa',
    wrong: ['Sandalye', 'Yatak'],
  },
  {
    text: 'Sabah mavidir, akşam turuncuya döner; bulutlar içinde yüzer. Nedir?',
    answer: 'Gökyüzü',
    wrong: ['Deniz', 'Bulut'],
  },
  {
    text: 'Çalınca açılır; her evin bir tanesi vardır. Nedir?',
    answer: 'Kapı',
    wrong: ['Pencere', 'Duvar'],
  },
  {
    text: 'Ne kadar hava dolarsa o kadar büyür; ipi çekilince gökyüzüne uçar. Nedir?',
    answer: 'Balon',
    wrong: ['Çanta', 'Bavul'],
  },
  {
    text: 'Her baktığında kendini görürsün; kırılırsa şans kaçar derler. Nedir?',
    answer: 'Ayna',
    wrong: ['Bardak', 'Pencere'],
  },
  {
    text: 'Dört bacağı var ama yürüyemez; üstüne oturulur. Nedir?',
    answer: 'Sandalye',
    wrong: ['Masa', 'Koltuk'],
  },
  {
    text: 'Geceleri yolu aydınlatır; ampulü yanar, elektrik ister. Nedir?',
    answer: 'Lamba',
    wrong: ['Mum', 'Fener'],
  },
  {
    text: 'Kırmızıyım, tatlıyım; yaz mevsiminde bahçede yetişirim. Nedir?',
    answer: 'Çilek',
    wrong: ['Elma', 'Domates'],
  },
  {
    text: 'Kolları döner, rakamlar gösterir; zamanı ölçer. Nedir?',
    answer: 'Saat',
    wrong: ['Takvim', 'Termometre'],
  },
  {
    text: 'Kanatları var ama kuş değil; motorla uçar, insanları taşır. Nedir?',
    answer: 'Uçak',
    wrong: ['Arı', 'Melek'],
  },
  {
    text: 'Üzerine yazı yazılır, kapağı kapanır; okula götürülür. Nedir?',
    answer: 'Defter',
    wrong: ['Kitap', 'Gazete'],
  },
  {
    text: 'Her gün dolmak ister; yemek yiyince mutlu olur. Nedir?',
    answer: 'Mide',
    wrong: ['Çanta', 'Kova'],
  },
  {
    text: 'İpine tutunulur, rüzgarla uçar; gökyüzüne yükselir. Nedir?',
    answer: 'Uçurtma',
    wrong: ['Balon', 'Kuş'],
  },
  {
    text: 'Önce tırtıl, sonra pupa olur; en sonunda rengarenk kanatlarla uçar. Nedir?',
    answer: 'Kelebek',
    wrong: ['Arı', 'Sinek'],
  },
  {
    text: 'Üç rengi vardır: kırmızı, sarı, yeşil; arabalara dur ve geç der. Nedir?',
    answer: 'Trafik lambası',
    wrong: ['Bayrak', 'Gökkuşağı'],
  },
  {
    text: 'Suda yüzer, solungaçlarıyla nefes alır; oltayla tutulur. Nedir?',
    answer: 'Balık',
    wrong: ['Yunus', 'Yengeç'],
  },
]

export function generateRiddleQuestion(_difficulty: Difficulty = 1): RiddleQuestion {
  const r = RIDDLES[randomInt(0, RIDDLES.length - 1)]
  const choices = shuffle([r.answer, ...r.wrong])
  const correctAnswer = choices.indexOf(r.answer)

  return {
    riddle: r.text,
    correctAnswer,
    options: choices.map((label, value) => ({ value, label })),
  }
}

export function generateRiddleSession(
  count: number,
  difficulty: Difficulty = 1,
  excludeKeys: string[] = [],
): RiddleQuestion[] {
  const questions: RiddleQuestion[] = []
  const used = new Set(excludeKeys)
  let attempts = 0
  while (questions.length < count && attempts < count * 50) {
    const q = generateRiddleQuestion(difficulty)
    if (!used.has(q.riddle)) {
      used.add(q.riddle)
      questions.push(q)
    }
    attempts += 1
  }
  while (questions.length < count) {
    questions.push(generateRiddleQuestion(difficulty))
  }
  return shuffle(questions)
}

export function getRiddleQuestionKey(q: RiddleQuestion): string {
  return q.riddle
}
