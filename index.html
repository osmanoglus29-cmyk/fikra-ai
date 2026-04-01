let lastResponse = "";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ fikir: "Sadece POST isteği kabul edilir." });
  }

  try {
    const mesaj = String(req.body?.mesaj || "").trim();

    if (!mesaj) {
      return res.status(400).json({ fikir: "Lütfen bir konu yaz." });
    }

    const text = normalize(mesaj);

    if (isUnsafe(text)) {
      return res.status(200).json({
        fikir:
          "FİKRÂ bu konuda fikir veremez.\n\nBu konu tehlikeli, zarar verici ya da güvenlik açısından riskli görünüyor.\n\nİstersen bunun yerine güvenli ve yapıcı bir alternatif düşünebiliriz."
      });
    }

    const topic = detectTopic(text);
    const subtopic = detectSubtopic(text, topic);
    const intent = detectIntent(text);
    const tone = detectTone(text);

    let output = buildSmartResponse({
      original: mesaj,
      topic,
      subtopic,
      intent,
      tone
    });

    if (output === lastResponse) {
      output = buildSmartResponse({
        original: mesaj,
        topic,
        subtopic,
        intent,
        tone
      });
    }

    lastResponse = output;

    return res.status(200).json({ fikir: output });
  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ fikir: "Sunucu hatası oluştu." });
  }
}

function normalize(str) {
  return String(str || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?\"'[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const cloned = [...arr];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

function hasAny(text, words) {
  return words.some((w) => text.includes(w));
}

function isUnsafe(text) {
  const groups = [
    ["intihar", "kendime zarar", "kendimi öldür", "ölmek istiyorum", "canıma kıy"],
    ["öldür", "yarala", "birine zarar", "saldırı", "intikam almak istiyorum"],
    ["bomba", "patlayıcı", "silah yap", "zehir", "mermi yap"],
    ["uyuşturucu", "yasadışı madde", "kaçakçılık", "sahte para"],
    ["hackleme", "şifre kır", "dolandırıcılık", "kart kopyalama"],
    ["doktor gerekmez", "ilaç dozu söyle", "evde ilaç yap", "tehlikeli karışım"]
  ];

  return groups.some((group) => hasAny(text, group));
}

function detectTopic(text) {
  const topicMap = {
    ask: ["aşk", "sevgi", "ilişki", "sevgili", "flört", "romantik", "ayrılık"],
    aile: ["aile", "anne", "baba", "kardeş", "akraba", "ev içi"],
    arkadaslik: ["arkadaş", "arkadaşlık", "dost", "çevre", "sosyalleşme"],
    cocuk: ["çocuk", "bebek", "ebeveyn", "annelik", "babalık", "oyun"],
    bakim: ["kişisel bakım", "bakım", "cilt", "saç", "stil", "giyinme", "görünüş"],
    saglik: ["sağlık", "sağlıklı yaşam", "enerji", "iyi hissetmek", "beden"],
    spor: ["spor", "egzersiz", "antrenman", "fitness", "hareket"],
    beslenme: ["beslenme", "diyet", "öğün", "protein", "yemek düzeni"],
    uyku: ["uyku", "uykusuzluk", "erken kalkmak", "gece düzeni"],
    motivasyon: ["motivasyon", "istek", "başlamak", "heves", "ilham"],
    disiplin: ["disiplin", "rutin", "istikrar", "erteleme"],
    aliskanlik: ["alışkanlık", "kötü alışkanlık", "iyi alışkanlık"],
    odak: ["odak", "dikkat", "konsantrasyon", "dağınık", "fokus"],
    uretkenlik: ["üretkenlik", "üretmek", "iş çıkarma", "verimlilik"],
    zaman: ["zaman", "plan", "program", "takvim", "zaman yönetimi"],
    karar: ["karar", "kararsız", "seçim", "hangisi", "ne yapacağım"],
    para: ["para", "kazanç", "gelir", "bütçe", "yatırım", "tasarruf"],
    is: ["iş", "ofis", "maaş", "kurumsal", "çalışma hayatı"],
    kariyer: ["kariyer", "cv", "özgeçmiş", "görüşme", "meslek", "terfi"],
    girisim: ["girişim", "startup", "müşteri", "ürün", "satış", "iş fikri"],
    yazilim: ["yazılım", "kod", "programlama", "frontend", "backend", "web", "mobil"],
    sosyalmedya: ["instagram", "youtube", "tiktok", "sosyal medya", "takipçi"],
    icerik: ["içerik", "video", "post", "reels", "içerik üretimi"],
    marka: ["marka", "kişisel marka", "imaj", "brand"],
    egitim: ["eğitim", "ders", "okul", "öğrenme", "çalışma"],
    sinav: ["sınav", "tyt", "ayt", "vize", "final", "test"],
    universite: ["üniversite", "bölüm", "kampüs"],
    kitap: ["kitap", "okuma", "özet", "not alma"],
    iletisim: ["iletişim", "konuşma", "anlaşılmak", "sunum", "kendimi ifade"],
    ozguven: ["özgüven", "cesaret", "çekinmek", "utanmak", "yetersiz"],
    stres: ["stres", "kaygı", "panik", "bunaldım", "baskı", "gerginlik"],
    hayat: ["hayat", "yaşam", "denge", "gelecek", "amaç", "yol"],
    evduzeni: ["ev", "oda", "düzen", "toparlama", "minimalizm"],
    hobi: ["hobi", "uğraş", "boş zaman"],
    yaraticilik: ["yaratıcılık", "yaratıcı", "ilham bulmak", "fikir üretmek"],
    liderlik: ["liderlik", "ekip", "yönetmek", "sorumluluk"],
    dijital: ["telefon", "ekran süresi", "internet", "uygulama", "dijital"]
  };

  let best = "genel";
  let bestScore = 0;

  for (const [topic, words] of Object.entries(topicMap)) {
    let score = 0;
    for (const word of words) {
      if (text.includes(word)) score += 3;
      for (const part of text.split(" ")) {
        if (part && (word.includes(part) || part.includes(word))) score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }

  return best;
}

function detectSubtopic(text, topic) {
  const subtopicMap = {
    ask: {
      baslangic: ["yeni ilişki", "flört", "tanışma", "başlangıç"],
      iletisim: ["mesaj", "konuşma", "açılmak", "ne diyeyim"],
      guven: ["güven", "sadakat", "şüphe"],
      ayrilik: ["ayrılık", "terk", "kalp kırıklığı", "eski sevgili"]
    },
    para: {
      birikim: ["birikim", "tasarruf", "saklamak"],
      kazanc: ["para kazanmak", "gelir", "ek gelir", "kazanç"],
      butce: ["bütçe", "harcama", "para yönetimi"],
      yatirim: ["yatırım", "parayı değerlendirmek"]
    },
    yazilim: {
      baslangic: ["başlangıç", "öğrenmek", "nereden başlayayım"],
      proje: ["proje", "uygulama", "site yapmak"],
      hata: ["hata", "bug", "sorun", "çalışmıyor"],
      gelisim: ["gelişmek", "ileri seviye", "uzmanlaşmak"]
    },
    motivasyon: {
      baslangic: ["başlamak", "ilk adım"],
      dusukenerji: ["isteksiz", "yorgun", "hevesim yok"],
      devam: ["devam etmek", "sürdürmek", "kopuyorum"]
    },
    kariyer: {
      isgorusmesi: ["görüşme", "mülakat", "iş görüşmesi"],
      cv: ["cv", "özgeçmiş"],
      yon: ["hangi iş", "meslek", "kariyer yönü"],
      terfi: ["terfi", "yükselmek"]
    },
    genel: {
      netlik: ["ne yapacağım", "kararsızım", "yardım", "fikir"]
    }
  };

  const group = subtopicMap[topic] || subtopicMap.genel;
  let best = "genel";
  let bestScore = 0;

  for (const [sub, words] of Object.entries(group)) {
    let score = 0;
    for (const word of words) {
      if (text.includes(word)) score += 3;
    }
    if (score > bestScore) {
      bestScore = score;
      best = sub;
    }
  }

  return best;
}

function detectIntent(text) {
  if (hasAny(text, ["nasıl", "ne yapmalıyım", "ne yapayım", "çözüm", "yardım"])) return "solution";
  if (hasAny(text, ["başlamak", "ilk adım", "nereden başlayayım"])) return "start";
  if (hasAny(text, ["zorlanıyorum", "olmuyor", "tıkan", "yapamıyorum"])) return "struggle";
  if (hasAny(text, ["fikir", "öneri", "tavsiye"])) return "idea";
  if (hasAny(text, ["gelişmek", "büyütmek", "ilerlemek"])) return "growth";
  return "general";
}

function detectTone(text) {
  if (hasAny(text, ["korkuyorum", "çekiniyorum", "kaygı", "endişe", "panik"])) return "anxious";
  if (hasAny(text, ["çok istiyorum", "büyütmek istiyorum", "heyecanlıyım"])) return "ambitious";
  if (hasAny(text, ["yorgunum", "bıktım", "bunaldım"])) return "tired";
  if (hasAny(text, ["üzgünüm", "kırgınım", "mutsuzum"])) return "sad";
  return "balanced";
}

function buildSmartResponse({ original, topic, subtopic, intent, tone }) {
  const introsByTone = {
    anxious: [
      "Yazdığın şeyde biraz kaygı ve yön arayışı hissediliyor.",
      "Bu konuda önce baskıyı azaltıp netliği artırmak önemli.",
      "Burada sakin ve sade bir çerçeve kurmak en iyi başlangıç olur."
    ],
    ambitious: [
      "Yazdığın şeyde büyütme ve ilerleme isteği var.",
      "Bu konu doğru sistemle ciddi gelişim sağlayabilir.",
      "Burada potansiyeli iyi kullanmak önemli."
    ],
    tired: [
      "Burada önce yükü azaltmak ve sadeleşmek önemli.",
      "Yazdığın şey biraz yorgunluk taşıyor.",
      "İlk hedef mükemmellik değil toparlanma olmalı."
    ],
    sad: [
      "Burada önce duyguyu bastırmadan anlamak önemli.",
      "Yazdığın şey biraz kırgınlık ve ağırlık taşıyor.",
      "Önce kendine yumuşak davranmak gerekir."
    ],
    balanced: [
      "Bu konuda en güçlü başlangıç netliktir.",
      "Burada doğru yönü seçmek her şeyi kolaylaştırır.",
      "Meseleye sade ama etkili yaklaşmak en iyi sonucu verir."
    ]
  };

  const notes = [
    "Küçük başla, büyüt.",
    "Süreklilik her şeyden güçlüdür.",
    "Netlik seni hızlandırır.",
    "Düşünmek değil, denemek kazandırır.",
    "Az ama doğru ilerle.",
    "Başlamak mükemmel olmaktan daha değerlidir."
  ];

  const titleMap = {
    ask: "Aşk konusunda 3 fikir",
    aile: "Aile konusunda 3 fikir",
    arkadaslik: "Arkadaşlık konusunda 3 fikir",
    cocuk: "Çocuk konusunda 3 fikir",
    bakim: "Kişisel bakım konusunda 3 fikir",
    saglik: "Sağlıklı yaşam konusunda 3 fikir",
    spor: "Spor konusunda 3 fikir",
    beslenme: "Beslenme konusunda 3 fikir",
    uyku: "Uyku konusunda 3 fikir",
    motivasyon: "Motivasyon konusunda 3 fikir",
    disiplin: "Disiplin konusunda 3 fikir",
    aliskanlik: "Alışkanlık konusunda 3 fikir",
    odak: "Odak konusunda 3 fikir",
    uretkenlik: "Üretkenlik konusunda 3 fikir",
    zaman: "Zaman yönetimi konusunda 3 fikir",
    karar: "Karar verme konusunda 3 fikir",
    para: "Para konusunda 3 fikir",
    is: "İş hayatı konusunda 3 fikir",
    kariyer: "Kariyer konusunda 3 fikir",
    girisim: "Girişim konusunda 3 fikir",
    yazilim: "Yazılım konusunda 3 fikir",
    sosyalmedya: "Sosyal medya konusunda 3 fikir",
    icerik: "İçerik üretimi konusunda 3 fikir",
    marka: "Marka konusunda 3 fikir",
    egitim: "Eğitim konusunda 3 fikir",
    sinav: "Sınav konusunda 3 fikir",
    universite: "Üniversite konusunda 3 fikir",
    kitap: "Kitap ve okuma konusunda 3 fikir",
    iletisim: "İletişim konusunda 3 fikir",
    ozguven: "Özgüven konusunda 3 fikir",
    stres: "Stres konusunda 3 fikir",
    hayat: "Hayat konusunda 3 fikir",
    evduzeni: "Ev düzeni konusunda 3 fikir",
    hobi: "Hobi konusunda 3 fikir",
    yaraticilik: "Yaratıcılık konusunda 3 fikir",
    liderlik: "Liderlik konusunda 3 fikir",
    dijital: "Dijital yaşam konusunda 3 fikir",
    genel: "Senin için 3 fikir"
  };

  const topicBodies = {
    ask: [
      "Duygu kadar netlik de önemlidir. Karşındaki insanın sözlerinden çok davranışlarına bakmak daha doğru okuma sağlar.",
      "Sağlıklı ilişki sadece heyecan değil, güven ve denge de üretir.",
      "İlişkide kendini kaybetmeden bağ kurmak, uzun vadede daha güçlü sonuç verir.",
      "Aşkta belirsizlik uzadıkça yorgunluk artar; sade ve açık iletişim çoğu zaman rahatlatır."
    ],
    aile: [
      "Aile içinde tek bir iletişim noktasını düzeltmek bile büyük fark yaratabilir.",
      "Yakın ilişkilerde haklı olmaktan çok doğru üslup belirleyicidir.",
      "Birikmiş yanlış anlaşılmaları küçük ve sakin konuşmalar çözer.",
      "Ailede sevgi kadar güvenli iletişim de korunmalıdır."
    ],
    arkadaslik: [
      "Kaliteli dostluk, kalabalık çevreden daha değerlidir.",
      "Tutarlılık, arkadaşlıkta sözlerden daha güçlü bir göstergedir.",
      "Seni aşağı çeken değil güçlendiren çevreyi seçmek önemlidir.",
      "Küçük ama gerçek ilgi, ilişkileri derinleştirir."
    ],
    cocuk: [
      "Çocuklarla ilişkide kusursuzluk değil tutarlılık önemlidir.",
      "Kısa ama kaliteli zaman, uzun ama dağınık ilgiden daha etkilidir.",
      "Rutinler çocuk için güven hissi oluşturur.",
      "Birlikte deneyim kurmak, sürekli öğretmekten daha güçlü bağ üretir."
    ],
    bakim: [
      "Kişisel bakım, kendine düzenli değer vermenin görünür halidir.",
      "Az ama sürdürülebilir bakım rutini, zorlayıcı sistemlerden daha iyidir.",
      "Temizlik, sadelik ve tutarlılık çoğu zaman güçlü etki bırakır.",
      "Bakımın amacı kusursuz görünmek değil iyi hissetmektir."
    ],
    saglik: [
      "Sağlıklı yaşam çoğu zaman küçük ama düzenli seçimlerle kurulur.",
      "Bedeni toparlamak zihni de toparlar.",
      "Enerji düzeyi, uyku ve hareket gibi temel sistemlerle yakından ilgilidir.",
      "Aşırı yüklenmek yerine sürdürülebilir sağlık düzeni kurmak daha etkilidir."
    ],
    spor: [
      "Sporu ağır yük değil düzenli hareket olarak görmek daha sürdürülebilirdir.",
      "Kısa ama tekrarlanan egzersiz, hiç yapmamaktan çok daha değerlidir.",
      "Antrenmanda devamlılık, yoğunluktan daha önemlidir.",
      "Spor sadece beden değil, zihin için de güç üretir."
    ],
    beslenme: [
      "Beslenmede en güçlü değişim tek bir alışkanlığı düzeltmekle başlayabilir.",
      "Denge, yasaktan daha uzun ömürlü sonuç verir.",
      "Yediklerin enerji ve odak üzerinde doğrudan etkili olabilir.",
      "Sürdürülebilir seçimler, sert kısıtlamalardan daha güçlüdür."
    ],
    uyku: [
      "Uyku kalitesi, gün içi performansı düşündüğünden daha çok etkiler.",
      "Sabit uyku ritmi, dağınık dinlenmeden daha etkilidir.",
      "Uyumadan önce zihni sadeleştirmek faydalı olabilir.",
      "İyi uyku, zihinsel berraklığın temelidir."
    ],
    motivasyon: [
      "Motivasyon beklemekten çok hareketle gelir.",
      "Büyük hedefi küçültmek başlama direncini azaltır.",
      "Küçük ama tekrar eden eylem, büyük hevesten daha kalıcı olabilir.",
      "Ritim kurmak, anlık gazdan daha güvenilirdir."
    ],
    disiplin: [
      "Disiplin, istemediğin günlerde de küçük doğru hareketi yapabilmektir.",
      "Tekrar edilen sade rutinler büyük dönüşüm üretir.",
      "Duyguya bağlı sistemler kolay kopar; zamana bağlı sistemler daha güçlüdür.",
      "Kendine verdiğin küçük sözü tutmak bile karakteri güçlendirir."
    ],
    aliskanlik: [
      "Alışkanlıklar küçük görünür ama kimliği şekillendirir.",
      "Kötü alışkanlıkları sadece bırakmak değil, yerine bir şey koymak gerekir.",
      "İyi alışkanlık için başlangıç eşiğini çok düşürmek faydalıdır.",
      "Kim olmak istediğin, neyi tekrar ettiğinle bağlantılıdır."
    ],
    odak: [
      "Odak eksikliği çoğu zaman öncelik belirsizliğinden gelir.",
      "Tek bir işe derinleşmek, çok işe dağılmaktan daha değerlidir.",
      "Dikkat dağıtıcıları azaltmak üretimin parçasıdır.",
      "Bitirilen iş, yarım bırakılan çok işten daha güçlü ivme üretir."
    ],
    uretkenlik: [
      "Üretkenlik, çok şey yapmak değil önemli şeyi bitirebilmektir.",
      "Az ama yüksek değerli iş seçmek daha güçlü sonuç verir.",
      "Günün ilk enerjisini önemli işe vermek faydalı olabilir.",
      "Meşgul olmak ile ilerlemek aynı şey değildir."
    ],
    zaman: [
      "Zaman yönetiminde asıl mesele saat değil önceliktir.",
      "Takvime girmeyen hedefler çoğu zaman ertelenir.",
      "Net bloklar, dağınık niyetlerden daha güçlüdür.",
      "Gereksiz evetler, zamanı sessizce tüketir."
    ],
    karar: [
      "Kararsızlık çoğu zaman seçenek fazlalığından doğar.",
      "Düşük riskli küçük deneme, uzun düşünceden daha öğretici olabilir.",
      "Net kriter belirlemek kararı kolaylaştırır.",
      "Hareket çoğu zaman netliği artırır."
    ],
    para: [
      "Para yönetimi sadece kazanç değil kontrol işidir.",
      "Geliri artırmak kadar harcamayı görmek de önemlidir.",
      "Küçük tasarruflar uzun vadede özgürlük alanı açabilir.",
      "Değer üretmek, gelir artışının güçlü yollarından biridir."
    ],
    is: [
      "İş hayatında fark, sorun çözme becerisiyle büyür.",
      "Net iletişim iş stresini azaltabilir.",
      "Güven veren çalışan olmak görünenden daha değerlidir.",
      "Katkı üreten yaklaşım seni öne çıkarır."
    ],
    kariyer: [
      "Kariyerde görünür beceri üretmek önemlidir.",
      "Bir alanda derinleşmek seni daha hatırlanır yapabilir.",
      "Ne istediğini bilmek doğru fırsatı seçmeyi kolaylaştırır.",
      "Portföy ve somut çıktı, niyetten daha güçlü sinyal verir."
    ],
    girisim: [
      "İyi iş fikri, gerçek problemi çözen fikirdir.",
      "Doğrulama yapmadan büyütmek yerine önce küçük test yapmak daha akıllıcadır.",
      "Müşteriyi anlamak ürün fikrinden daha değerlidir.",
      "Hız kadar yön de önemlidir."
    ],
    yazilim: [
      "Yazılım öğrenmenin güçlü yolu küçük proje çıkarmaktır.",
      "Hata çözmek, gelişimin doğal ve değerli parçasıdır.",
      "Teori ile pratiği aynı gün birleştirmek gelişimi hızlandırır.",
      "Süreklilik, uzun vadede seni öne çıkarır."
    ],
    sosyalmedya: [
      "Sosyal medyada büyüme çoğu zaman düzenli fayda üretmekle olur.",
      "İçerikte kusursuzluktan çok devamlılık önemlidir.",
      "Takipçiden önce güven biriktirmek daha değerlidir.",
      "Ton, tekrar ve fayda birlikte marka etkisi kurar."
    ],
    icerik: [
      "İçerik üretiminde önce değer, sonra görünürlük gelir.",
      "Şablon ve seri mantığı üretimi kolaylaştırır.",
      "Anlaşılır olmak çoğu zaman daha güçlüdür.",
      "Bir probleme net çözüm sunan içerik daha kalıcı etki bırakır."
    ],
    marka: [
      "Marka sadece logo değil, verdiğin his ve tekrar eden mesajdır.",
      "Ne sunduğunu net anlatmak marka inşasını kolaylaştırır.",
      "Tutarlılık, marka hissini güçlendirir.",
      "İnsanlar sadece görünüşü değil, anlamı da hatırlar."
    ],
    egitim: [
      "Eğitimde asıl fark bilgiyi kullanabilmektir.",
      "Düzenli kısa çalışma, dağınık yoğun çalışmadan daha güçlü olabilir.",
      "Konuyu kendi cümlelerinle yeniden kurmak öğrenmeyi derinleştirir.",
      "Tekrar, bilgiyi kalıcı hale getirir."
    ],
    sinav: [
      "Sınav sürecinde sadece uzun çalışmak değil doğru tekrar da önemlidir.",
      "Kaygıyı azaltmak için kontrol edebildiğin parçaya dönmek faydalıdır.",
      "Kaliteli kısa bloklar bazen daha etkilidir.",
      "Denemeler moral bozmak için değil yön görmek içindir."
    ],
    universite: [
      "Üniversite sadece ders değil, yön ve çevre kurma alanıdır.",
      "Her şeyin hemen net olması gerekmez.",
      "Kampüs hayatında görünür olmak fırsat açabilir.",
      "Ek beceriler bölüm kadar etkili olabilir."
    ],
    kitap: [
      "Okumanın gücü süreklilikte gizlidir.",
      "Ana fikri çıkarmak, bitirmekten daha etkili olabilir.",
      "Bir cümleyi uygulamak, çok şeyi unutulmuş okumaktan daha değerlidir.",
      "Küçük notlar okumanın etkisini büyütür."
    ],
    iletisim: [
      "İletişimde ton ve zamanlama, içerik kadar önemlidir.",
      "Basit ve net cümleler çoğu zaman en güçlü etkiyi bırakır.",
      "İyi iletişim, iyi dinlemeyi de içerir.",
      "Ne hissettiğini bilmek, ne söyleyeceğini netleştirir."
    ],
    ozguven: [
      "Özgüven kusursuzluk değil hareket cesaretidir.",
      "Küçük başarı kanıtları iç güven üretir.",
      "Başkalarının sesi yükseldikçe kendi merkezini korumak önemlidir.",
      "Korkuya rağmen adım atmak, cesaretin pratik halidir."
    ],
    stres: [
      "Stres yükseldiğinde her şeyi çözmeye değil bir şeyi netleştirmeye çalışmak faydalıdır.",
      "Kontrol edebildiğin parçaya dönmek zihni rahatlatır.",
      "Bazen sorun çözüm eksikliği değil aşırı yüklü zihindir.",
      "Küçük düzenlemeler baskıyı azaltabilir."
    ],
    hayat: [
      "Hayatta netlik çoğu zaman yürürken oluşur.",
      "Her şeyi aynı anda düzeltmeye çalışmak yerine bir alan seçmek daha güçlüdür.",
      "Sadeleşmek bazen yeni şey eklemekten daha etkilidir.",
      "Küçük ama dürüst adımlar yön duygusu üretir."
    ],
    evduzeni: [
      "Ev düzeninde amaç kusursuzluk değil akışı kolaylaştırmaktır.",
      "Küçük alanları sırayla toparlamak daha sürdürülebilirdir.",
      "Dıştaki sadelik, iç rahatlığı da etkileyebilir.",
      "Fazlalığı azaltmak düzeni korumayı kolaylaştırır."
    ],
    hobi: [
      "Hobi seçerken yetenekten çok merak önemlidir.",
      "Boş zamanı sadece tüketmek yerine hafif üretime çevirmek iyi gelebilir.",
      "Hobiler baskısız gelişim alanıdır.",
      "Küçük denemeler doğru hobiyi bulmayı kolaylaştırır."
    ],
    yaraticilik: [
      "Yaratıcılık, üretim alanı açıldıkça güçlenir.",
      "İlham her zaman başta gelmez; çoğu zaman süreçte gelir.",
      "Kusursuzluk baskısını azaltmak yaratımı kolaylaştırır.",
      "Çok fikir yazmak, iyi fikri bulmayı kolaylaştırabilir."
    ],
    liderlik: [
      "Liderlik görünmekten çok sorumluluk taşımaktır.",
      "Netlik ve güven üretmek ekip etkisini artırır.",
      "Davranışla örnek olmak, sözden güçlü olabilir.",
      "Tutarlılık, liderlikte sessiz güven oluşturur."
    ],
    dijital: [
      "Dijital düzen, odak ve zaman kalitesini etkiler.",
      "Bildirimleri sadeleştirmek zihni hafifletebilir.",
      "Telefonu araç olarak tutmak, merkeze koymaktan daha sağlıklıdır.",
      "Ekran süresi yönetimi üretkenliği destekleyebilir."
    ],
    genel: [
      "Net bir soru daha güçlü fikir üretir.",
      "Tek bir küçük adım çoğu zaman büyük düşünceden daha öğreticidir.",
      "Her şeyi aynı anda çözmek yerine bir yeri iyileştirmek daha güçlüdür.",
      "Küçük ama dürüst başlangıçlar yön hissi üretir."
    ]
  };

  const actionPoolByIntent = {
    solution: [
      "Bugün önce çözmek istediğin ana problemi tek cümlede yaz.",
      "Bugün doğrudan işe yarayacak tek bir adımı seç.",
      "Bugün karmaşayı değil, ilk çözülebilir parçayı ele al."
    ],
    start: [
      "Bugün sadece başlangıç sayılacak kadar küçük bir adım at.",
      "Bugün ilk eşiği düşür ve 10 dakikalık başlama kuralı koy.",
      "Bugün işi küçültüp sadece giriş bölümünü yap."
    ],
    struggle: [
      "Bugün zorlandığın noktayı adlandır ve sadece onu hafifletmeye odaklan.",
      "Bugün yükü azaltacak tek bir sadeleştirme yap.",
      "Bugün kendini zorlamak yerine sistemi kolaylaştır."
    ],
    growth: [
      "Bugün seni büyütecek tek beceriye ekstra zaman ayır.",
      "Bugün gelişim için ölçebileceğin küçük hedef koy.",
      "Bugün bir üst seviyeye taşıyacak tek parçayı seç."
    ],
    idea: [
      "Bugün aklına gelen ilk 3 yaklaşımı hızlıca yaz.",
      "Bugün bir fikri küçük denemeye dönüştür.",
      "Bugün farklı bir açıdan bakmayı dene."
    ],
    general: [
      "Bugün netlik sağlayacak tek bir soru yaz.",
      "Bugün bir küçük adım at.",
      "Bugün düşünmek yerine kısa bir deneme yap."
    ]
  };

  const title = titleMap[topic] || titleMap.genel;
  const intro = pick(introsByTone[tone] || introsByTone.balanced);
  const actionPool = actionPoolByIntent[intent] || actionPoolByIntent.general;
  const chosenBodies = shuffle(topicBodies[topic] || topicBodies.genel).slice(0, 3);

  const blocks = chosenBodies.map((body, index) => {
    return `FİKİR ${index + 1}\n\n${intro}\n\n${body}\n\nBugün yap:\n${pick(actionPool)}\n\nFİKRÂ notu: ${pick(notes)}`;
  });

  const intentLine = `FİKRÂ analizi • konu: ${topicLabel(topic)} • alt konu: ${subtopicLabel(subtopic)} • istek: ${intentLabel(intent)} • ton: ${toneLabel(tone)}`;

  return `${title}\n\n${intentLine}\n\n${blocks.join("\n\n────────────\n\n")}`;
}

function topicLabel(topic) {
  const labels = {
    ask: "Aşk / ilişki",
    aile: "Aile",
    arkadaslik: "Arkadaşlık",
    cocuk: "Çocuk",
    bakim: "Kişisel bakım",
    saglik: "Sağlıklı yaşam",
    spor: "Spor",
    beslenme: "Beslenme",
    uyku: "Uyku",
    motivasyon: "Motivasyon",
    disiplin: "Disiplin",
    aliskanlik: "Alışkanlık",
    odak: "Odak",
    uretkenlik: "Üretkenlik",
    zaman: "Zaman yönetimi",
    karar: "Karar verme",
    para: "Para",
    is: "İş hayatı",
    kariyer: "Kariyer",
    girisim: "Girişim",
    yazilim: "Yazılım",
    sosyalmedya: "Sosyal medya",
    icerik: "İçerik üretimi",
    marka: "Marka",
    egitim: "Eğitim",
    sinav: "Sınav",
    universite: "Üniversite",
    kitap: "Kitap",
    iletisim: "İletişim",
    ozguven: "Özgüven",
    stres: "Stres",
    hayat: "Hayat",
    evduzeni: "Ev düzeni",
    hobi: "Hobi",
    yaraticilik: "Yaratıcılık",
    liderlik: "Liderlik",
    dijital: "Dijital yaşam",
    genel: "Genel"
  };
  return labels[topic] || "Genel";
}

function subtopicLabel(subtopic) {
  const map = {
    baslangic: "Başlangıç",
    iletisim: "İletişim",
    guven: "Güven",
    ayrilik: "Ayrılık",
    birikim: "Birikim",
    kazanc: "Kazanç",
    butce: "Bütçe",
    yatirim: "Yatırım",
    proje: "Proje",
    hata: "Hata çözme",
    gelisim: "Gelişim",
    dusukenerji: "Düşük enerji",
    devam: "Devamlılık",
    isgorusmesi: "İş görüşmesi",
    cv: "CV",
    yon: "Yön bulma",
    terfi: "Terfi",
    netlik: "Netlik",
    genel: "Genel"
  };
  return map[subtopic] || "Genel";
}

function intentLabel(intent) {
  const map = {
    solution: "Çözüm arıyor",
    start: "Başlangıç istiyor",
    struggle: "Zorlanıyor",
    idea: "Yeni fikir arıyor",
    growth: "Gelişmek istiyor",
    general: "Genel yön istiyor"
  };
  return map[intent] || "Genel yön istiyor";
}

function toneLabel(tone) {
  const map = {
    anxious: "Kaygılı",
    ambitious: "Hırslı / istekli",
    tired: "Yorgun",
    sad: "Üzgün",
    balanced: "Dengeli"
  };
  return map[tone] || "Dengeli";
}
