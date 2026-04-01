export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ fikir: "Sadece POST isteği kabul edilir." });
  }

  const { mesaj } = req.body || {};
  const query = String(mesaj || "").trim();

  if (!query) {
    return res.status(400).json({ fikir: "Lütfen bir konu yaz." });
  }

  const text = normalize(query);

  if (isUnsafe(text)) {
    return res.status(200).json({
      fikir: buildUnsafeResponse(query)
    });
  }

  const topic = detectTopic(text);
  const intent = detectIntent(text);
  const tone = detectTone(text);

  const response = buildRichIdea({
    original: query,
    topic,
    intent,
    tone
  });

  return res.status(200).json({ fikir: response });
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

function includesAny(text, words) {
  return words.some((w) => text.includes(w));
}

function isUnsafe(text) {
  const unsafeGroups = [
    [
      "intihar", "kendimi öldür", "kendime zarar", "bilek kes", "ölmek istiyorum",
      "canıma kıy", "ölüm yöntemi", "intihar yöntemi"
    ],
    [
      "bomba", "patlayıcı", "molotof", "silah yap", "tabanca yap", "mermi yap",
      "zehir yap", "suikast", "öldürme yöntemi"
    ],
    [
      "uyuşturucu üret", "met yap", "yasadışı madde", "kaçakçılık", "sahte para",
      "hackleme", "şifre kır", "dolandırıcılık", "kart kopyalama"
    ],
    [
      "evde ilaç yap", "reçetesiz ilaç öner", "kanser tedavisi", "ameliyat gerekmez",
      "doktor gerekmez", "ilaç dozu söyle", "zehirli karışım"
    ],
    [
      "birini nasıl döverim", "zarar vermek istiyorum", "intikam almak istiyorum",
      "saldırı planı", "yaralama"
    ]
  ];

  return unsafeGroups.some((group) => includesAny(text, group));
}

function buildUnsafeResponse(original) {
  const lines = [
    "FİKRÂ bu konuda fikir veremez.",
    "",
    "Yazdığın konu tehlikeli, zarar verici ya da güvenlik açısından riskli görünüyor.",
    "",
    "Eğer istersen bunun yerine:",
    "- güvenli bir alternatif düşünebiliriz,",
    "- problemi zarar vermeden çözmenin yolunu konuşabiliriz,",
    "- daha sağlıklı ve yapıcı bir yön belirleyebiliriz.",
    "",
    `Konu: ${original}`
  ];

  return lines.join("\n");
}

function detectIntent(text) {
  if (includesAny(text, ["nasıl", "ne yapmalıyım", "ne yapayım", "çözüm", "yardım"])) {
    return "solution";
  }
  if (includesAny(text, ["fikir", "öneri", "öner", "tavsiye"])) {
    return "idea";
  }
  if (includesAny(text, ["başlamak", "başla", "ilk adım", "nereden başlayayım"])) {
    return "start";
  }
  if (includesAny(text, ["zorlanıyorum", "olmuyor", "tıkan", "yapamıyorum", "kararsızım"])) {
    return "struggle";
  }
  return "general";
}

function detectTone(text) {
  if (includesAny(text, ["korkuyorum", "çekiniyorum", "utanıyorum", "endişe", "kaygı"])) {
    return "anxious";
  }
  if (includesAny(text, ["heyecanlıyım", "çok istiyorum", "büyütmek istiyorum"])) {
    return "ambitious";
  }
  if (includesAny(text, ["yorgunum", "bıktım", "bunaldım"])) {
    return "tired";
  }
  return "balanced";
}

function detectTopic(text) {
  const topics = {
    ask: [
      "aşk", "sevgi", "ilişki", "sevgili", "flört", "ayrılık", "evlilik", "romantik"
    ],
    aile: [
      "aile", "anne", "baba", "kardeş", "akraba", "ev içi", "aile ilişkisi"
    ],
    arkadaslik: [
      "arkadaş", "dost", "çevre", "sosyalleşme", "arkadaşlık", "yakınlık"
    ],
    cocukbakimi: [
      "çocuk", "bebek", "ebeveyn", "annelik", "babalık", "çocuk bakımı", "oyun", "eğitici aktivite"
    ],
    kisiselbakim: [
      "kişisel bakım", "cilt", "saç", "temizlik", "bakım", "stil", "giyinme", "dış görünüş"
    ],
    saglikliyasam: [
      "sağlıklı yaşam", "uyku", "spor", "egzersiz", "beslenme", "rutin", "enerji", "su içmek"
    ],
    motivasyon: [
      "motivasyon", "istek", "heves", "gaz", "ilham", "başlamak", "enerji"
    ],
    disiplin: [
      "disiplin", "rutin", "istikrar", "alışkanlık", "erteleme", "düzen"
    ],
    odak: [
      "odak", "dikkat", "konsantrasyon", "dağınık", "verimlilik", "fokus"
    ],
    zaman: [
      "zaman", "plan", "program", "takvim", "günlük plan", "zaman yönetimi"
    ],
    para: [
      "para", "gelir", "kazanç", "bütçe", "birikim", "yatırım", "tasarruf", "harcama"
    ],
    ishayati: [
      "iş", "çalışma", "ofis", "toplantı", "maaş", "kurumsal", "iş hayatı"
    ],
    kariyer: [
      "kariyer", "meslek", "özgeçmiş", "cv", "iş görüşmesi", "uzmanlık", "terfi"
    ],
    girisim: [
      "girişim", "startup", "müşteri", "ürün", "fikir", "iş modeli", "satış"
    ],
    yazilim: [
      "yazılım", "kod", "programlama", "frontend", "backend", "web", "mobil", "bug"
    ],
    sosyalmedya: [
      "instagram", "youtube", "tiktok", "sosyal medya", "içerik", "takipçi", "video", "marka"
    ],
    egitim: [
      "eğitim", "ders", "sınav", "okul", "üniversite", "öğrenme", "çalışma"
    ],
    kitap: [
      "kitap", "okuma", "not alma", "özet", "okuma alışkanlığı"
    ],
    iletisim: [
      "iletişim", "konuşma", "anlaşılmak", "dinlemek", "kendini ifade", "sunum"
    ],
    ozguven: [
      "özgüven", "cesaret", "çekinmek", "utanmak", "yetersiz hissetmek"
    ],
    stres: [
      "stres", "kaygı", "baskı", "panik", "bunaldım", "gerginlik"
    ],
    hayat: [
      "hayat", "yaşam", "denge", "karar", "gelecek", "ne yapacağım", "yol"
    ],
    evduzeni: [
      "ev", "oda", "düzen", "toparlama", "minimalizm", "ev düzeni"
    ],
    hobi: [
      "hobi", "uğraş", "boş zaman", "kendime zaman", "yaratıcılık"
    ],
    liderlik: [
      "liderlik", "ekip", "yönetmek", "sorumluluk", "güven vermek"
    ],
    genel: []
  };

  let bestTopic = "genel";
  let bestScore = 0;

  for (const [topic, words] of Object.entries(topics)) {
    let score = 0;
    for (const word of words) {
      if (text.includes(word)) score += 3;
      const parts = text.split(" ");
      for (const part of parts) {
        if (part && (word.includes(part) || part.includes(word))) {
          score += 1;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  return bestTopic;
}

function buildRichIdea({ original, topic, intent, tone }) {
  const titles = {
    ask: "Aşk konusunda fikir",
    aile: "Aile konusunda fikir",
    arkadaslik: "Arkadaşlık konusunda fikir",
    cocukbakimi: "Çocuk bakımı konusunda fikir",
    kisiselbakim: "Kişisel bakım konusunda fikir",
    saglikliyasam: "Sağlıklı yaşam konusunda fikir",
    motivasyon: "Motivasyon konusunda fikir",
    disiplin: "Disiplin konusunda fikir",
    odak: "Odak konusunda fikir",
    zaman: "Zaman yönetimi konusunda fikir",
    para: "Para konusunda fikir",
    ishayati: "İş hayatı konusunda fikir",
    kariyer: "Kariyer konusunda fikir",
    girisim: "Girişim konusunda fikir",
    yazilim: "Yazılım konusunda fikir",
    sosyalmedya: "Sosyal medya konusunda fikir",
    egitim: "Eğitim konusunda fikir",
    kitap: "Kitap ve okuma konusunda fikir",
    iletisim: "İletişim konusunda fikir",
    ozguven: "Özgüven konusunda fikir",
    stres: "Stres konusunda fikir",
    hayat: "Hayat konusunda fikir",
    evduzeni: "Ev düzeni konusunda fikir",
    hobi: "Hobi konusunda fikir",
    liderlik: "Liderlik konusunda fikir",
    genel: "Genel fikir"
  };

  const intros = {
    anxious: [
      "Burada önce sakinleşip meseleyi sadeleştirmek önemli.",
      "Yazdığın şeyde biraz kaygı ve yön arayışı hissediliyor.",
      "Bu konuda önce baskıyı azaltıp netliği artırmak gerekir."
    ],
    ambitious: [
      "Burada potansiyeli iyi kullanmak önemli.",
      "Yazdığın şeyde büyütme ve ilerleme isteği var.",
      "Bu konu doğru sistem kurulursa ciddi gelişim sağlayabilir."
    ],
    tired: [
      "Burada önce yükü azaltmak ve sadeleşmek önemli.",
      "Yazdığın şey biraz yorgunluk ve sıkışmışlık taşıyor.",
      "Bu konuda ilk hedef mükemmellik değil toparlanma olmalı."
    ],
    balanced: [
      "Bu konuda en güçlü başlangıç netliktir.",
      "Burada doğru yönü seçmek her şeyi kolaylaştırır.",
      "Meseleye sade ama etkili yaklaşmak en iyisi olur."
    ]
  };

  const bodies = {
    ask: [
      "Aşkta en büyük hata, duyguyu netliğin önüne koymaktır. Karşındaki insanın sözlerinden çok davranışlarına bak. Seni gerçekten isteyen kişi ilgisini tutarlı biçimde gösterir.",
      "Romantik ilişkilerde güçlü bağ sadece hisle değil açık iletişimle kurulur. Ne beklediğini, neyi kabul etmeyeceğini ve seni neyin yorduğunu netleştirmek ilişkinin yönünü belirler.",
      "Sağlıklı bir ilişki seni sürekli yormaz; seni görülmüş, güvende ve anlaşılmış hissettirir. Yoğunluk ile değeri karıştırmamak gerekir."
    ],
    aile: [
      "Aile içinde her şeyi aynı anda düzeltmeye çalışmak yerine bir iletişim noktasını iyileştirmek daha etkilidir. Küçük ama saygılı bir konuşma büyük gerginlikleri azaltabilir.",
      "Aile ilişkilerinde haklı olmak kadar doğru üslup da önemlidir. Yumuşak ama net cümleler, savunma duvarını düşürür.",
      "Yakın ilişkilerde asıl mesele çoğu zaman sevgisizlik değil, birikmiş yanlış anlaşılmalardır. Önce anlaşılmak değil anlamak hedeflenmeli."
    ],
    arkadaslik: [
      "Arkadaşlıkta kalite, sayının önündedir. Seni tüketen çevre yerine az ama güven veren insanlarla bağ kurmak uzun vadede daha sağlıklıdır.",
      "İyi dostluk, sadece eğlencede değil zor anda da kendini gösterir. Bu yüzden ilişkiyi samimiyet ve tutarlılık üzerinden değerlendirmek gerekir.",
      "Arkadaşlıkta güçlü bağ kurmak için sürekli görünmek değil, doğru zamanda gerçek ilgi göstermek daha etkilidir."
    ],
    cocukbakimi: [
      "Çocuk bakımında mükemmel olmaya çalışmak yerine düzenli ve güvenli bir ortam kurmak daha önemlidir. Çocuklar çoğu zaman kusursuz plandan çok tutarlı ilgiye ihtiyaç duyar.",
      "Çocuğa yaklaşırken sadece öğretmeye değil, birlikte deneyim oluşturmaya odaklanmak gerekir. Oyun, iletişimin en güçlü araçlarından biridir.",
      "Çocukla ilgili konularda küçük rutinler büyük fark yaratır. Uyku, yemek, oyun ve sakin zaman dengesi çocuğun güven hissini güçlendirir."
    ],
    kisiselbakim: [
      "Kişisel bakımın amacı kusursuz görünmek değil, kendine düzenli değer vermektir. Küçük ama sürdürülebilir bakım alışkanlıkları uzun vadede daha güçlü sonuç verir.",
      "Bakım konusunda en iyi yaklaşım, seni yormayan ama iyi hissettiren basit bir sistem kurmaktır. Az ama doğru ürün ve net rutin genelde yeterlidir.",
      "Dış görünüşte asıl etki çoğu zaman pahalı detaylardan değil; temizlik, düzen ve kendine özen gösterme hissinden gelir."
    ],
    saglikliyasam: [
      "Sağlıklı yaşam, büyük değişimlerden çok düzenli küçük seçimlerle kurulur. Uyku, su, hareket ve beslenme temeli sağlam olursa enerji de toparlanır.",
      "Kendine çok yüklenmeden basit bir sağlık rutini kurmak en etkili yoldur. Az ama sürekli hareket, kısa süreli yoğun çabadan daha değerlidir.",
      "Bedenin iyi çalışmadığında zihnin de dağılır. Bu yüzden sağlıklı yaşamı dış görünüş değil, yaşam kalitesi yatırımı gibi düşünmek gerekir."
    ],
    motivasyon: [
      "Motivasyon çoğu zaman bekleyince gelmez, hareket edince gelir. Büyük hedef yerine çok küçük bir başlangıç seçmek zinciri kırar.",
      "İsteksizlik her zaman tembellik değildir; bazen sistem eksikliğidir. Seni düşük enerjide de çalıştıracak düzen kurmak daha güçlüdür.",
      "Kendini suçlamak yerine ritim kurmaya odaklan. Çünkü sürdürülen küçük hareket, büyük heveslerden daha kalıcı sonuç verir."
    ],
    disiplin: [
      "Disiplin, istemediğin günlerde de küçük doğru hareketi yapabilmektir. Büyük planlardan çok, tekrar eden küçük düzenler güç üretir.",
      "Kendini bir anda değiştirmeye çalışma. Her gün aynı saatte yapılan küçük bir rutin, karakteri sessizce güçlendirir.",
      "Disiplini duyguya bağlarsan koparsın; saate ve sisteme bağlarsan büyürsün."
    ],
    odak: [
      "Odak sorunu çoğu zaman dikkat eksikliğinden değil, öncelik belirsizliğinden doğar. Tek hedef seçildiğinde zihin daha rahat çalışır.",
      "Aynı anda her şeyi yapmak verimli görünür ama derin sonuç vermez. Bir işi bitirmeden diğerine geçmemek güçlü bir alışkanlıktır.",
      "Dikkatini korumak da üretimin parçasıdır. Seni bölen şeyleri azaltmadan yüksek kalite beklemek zordur."
    ],
    zaman: [
      "Zaman yönetiminde en büyük sorun çoğu zaman zaman azlığı değil, öncelik dağınıklığıdır. Takvime girmeyen iş çoğunlukla gerçekleşmez.",
      "Günün her saatini doldurmak yerine yüksek değerli işleri öne almak gerekir. Meşgul olmak ile ilerlemek aynı şey değildir.",
      "Zamanı daha iyi kullanmak için önce neye evet, neye hayır dediğini netleştirmelisin."
    ],
    para: [
      "Para konusunda güç sadece kazançtan değil, kontrolden gelir. Önce paran nereye gidiyor onu görmek gerekir.",
      "Gelirini büyütmek istiyorsan sadece daha çok çalışmayı değil, mevcut akışı daha iyi yönetmeyi de düşünmelisin.",
      "Birikim ve tasarruf kısa vadede küçük görünür ama uzun vadede karar özgürlüğü oluşturur."
    ],
    ishayati: [
      "İş hayatında değer, sadece görev yapmakla değil sorun çözen insan olmakla artar. Netlik ve sorumluluk seni öne çıkarır.",
      "İş yerinde çoğu sorun iletişim eksikliğinden büyür. Kimin ne yapacağı ne kadar netse stres o kadar azalır.",
      "Profesyonellik bazen en çok sakin, anlaşılır ve zamanında iletişim kurabilmektir."
    ],
    kariyer: [
      "Kariyer gelişimi için sadece çok çalışmak yetmez; görünür değer üretmek gerekir. Projeler, beceriler ve iletişim dili burada belirleyicidir.",
      "Her şeyi bilmek yerine belirli bir alanda derinleşmek seni daha hatırlanır yapar. Uzmanlık görünür bir avantajdır.",
      "Kariyerde yön bulmak için önce nasıl bir hayat istediğini, sonra hangi işin buna uyduğunu düşünmek gerekir."
    ],
    girisim: [
      "Girişimde iyi fikir, heyecan verici görünenden çok gerçek problemi çözen fikirdir. İnsanların gerçekten yaşadığı sorunu seçmek en kritik adımdır.",
      "Büyük sistem kurmadan önce küçük doğrulama yapmak gerekir. Önce insanların buna ihtiyaç duyup duymadığını test et.",
      "Girişimde hız önemlidir ama yön daha önemlidir. Yanlış problemi hızlı çözmek yerine doğru problemi net görmek daha değerlidir."
    ],
    yazilim: [
      "Yazılım öğrenmenin en hızlı yolu küçük ama çalışan işler üretmektir. Sadece ders izlemek yerine mini proje çıkarmak gerçek gelişimi başlatır.",
      "Kod yazarken hata almak başarısızlık değil, düşünme alanıdır. İyi geliştirici hatasız olan değil, hatayı çözebilen kişidir.",
      "Kendini başkalarıyla kıyaslamak yerine dün yaptığın işi biraz daha ileri taşımaya odaklan. Süreklilik burada en büyük güçtür."
    ],
    sosyalmedya: [
      "Sosyal medyada büyüme, sadece dikkat çekmekle değil düzenli değer üretmekle olur. İnsanlar fayda gördüğü hesabı takip eder.",
      "İçerik üretirken kusursuz görünmeye çalışmak seni yavaşlatır. Düzenli ve net paylaşım, uzun vadede daha güçlü marka kurar.",
      "Marka sadece görsel değil; tekrar eden tonun, yaklaşımın ve verdiğin his ile oluşur."
    ],
    egitim: [
      "Eğitim konusunda asıl fark, bilgiyi biriktirmek değil kullanabilmektir. Öğrendiğin şeyi not, tekrar veya uygulamayla sabitlemek gerekir.",
      "Çalışma düzeninde az ama sürekli sistem, bir anda yüklenmekten daha verimlidir. Dağınık çaba zihni yorar.",
      "Bir konuyu anlamak istiyorsan onu böl, sadeleştir ve kendi cümlelerinle yeniden kur."
    ],
    kitap: [
      "Okuma alışkanlığında önemli olan çok okumak değil, düzenli okumaktır. Az ama sürekli okuma daha kalıcı etki bırakır.",
      "Bir kitaptan asıl fayda, onu bitirmekten çok ana fikrini çıkarabilmekle gelir. Okudukça küçük notlar almak bu yüzden önemlidir.",
      "Kitabı tüketmek yerine ondan bir cümleyi hayata geçirmek daha değerlidir."
    ],
    iletisim: [
      "İletişimde en güçlü beceri sadece konuşmak değil, doğru tonla ve doğru zamanda konuşabilmektir.",
      "Çoğu yanlış anlaşılma niyetten değil ifade biçiminden doğar. Basit, sakin ve net cümleler büyük fark yaratır.",
      "Anlaşılmak istiyorsan önce kendini gerçekten neyin rahatsız ettiğini fark etmen gerekir."
    ],
    ozguven: [
      "Özgüven, kusursuz hissetmek değil; eksik olsan bile hareket edebilmek demektir. Küçük cesaretler büyüyerek iç güven oluşturur.",
      "Başkalarının seni nasıl gördüğüne fazla odaklanırsan kendi merkezini kaybedersin. Sağlam özgüven, iç netlikten doğar.",
      "Özgüveni artırmanın en pratik yolu küçük kanıtlar biriktirmektir: bitirdiğin iş, kurduğun ilişki, attığın adım."
    ],
    stres: [
      "Stres yükseldiğinde önce her şeyi çözmeye çalışma. Etkileyebildiğin tek noktayı bulup oraya yönelmek zihni sakinleştirir.",
      "Bazen sorun çözüm eksikliği değil, aşırı yüklenmiş zihindir. Bedeni yavaşlatmak düşünce kalitesini toparlayabilir.",
      "Stresi azaltmanın yolu mükemmel plan değil, küçük kontrol alanları oluşturmaktır."
    ],
    hayat: [
      "Hayatta netlik çoğu zaman başlamadan önce değil, yürürken gelir. Bu yüzden küçük bir adım büyük düşünceden daha öğretici olabilir.",
      "Her şeyi aynı anda düzeltmeye çalışmak yerine seni en çok zorlayan alanı seçmek daha etkilidir.",
      "Hayatını sadeleştirmek bazen yeni şey eklemekten daha güçlü sonuç verir."
    ],
    evduzeni: [
      "Ev düzeninde amaç kusursuzluk değil, akışı kolaylaştırmaktır. Sade sistemler uzun ömürlü olur.",
      "Her şeyi bir anda toplamak yerine alan alan gitmek daha gerçekçidir. Küçük düzen psikolojik ferahlık da sağlar.",
      "Evini yaşadığın zihinsel alan gibi düşün. Dıştaki dağınıklık çoğu zaman iç yükü de artırır."
    ],
    hobi: [
      "Hobi seçerken en önemli şey yetenek değil merak ve sürdürülebilirliktir. Seni hafifleten uğraş doğru başlangıçtır.",
      "Boş zamanını sadece tüketimle doldurmak yerine küçük üretim alanı açmak zihni dinlendirir.",
      "Hobiler verimsiz görünen ama hayat kalitesini ciddi biçimde artıran alanlardır."
    ],
    liderlik: [
      "Liderlik önde görünmek değil, zor anda sorumluluk alabilmektir. Güven veren insan ekipte fark yaratır.",
      "İyi liderlik talimat dağıtmaktan çok netlik ve güven üretmektir. İnsanlar baskıdan çok güvenle yürür.",
      "Lider olmak için önce iletişimde açıklık ve tutarlılık geliştirmek gerekir."
    ],
    genel: [
      "Bir konuda yön ararken ilk hedef mükemmel cevap değil, doğru soruyu bulmaktır.",
      "Kararsızlık çoğu zaman seçenek fazlalığından gelir. Konuyu biraz daraltmak zihni rahatlatır.",
      "Büyük değişimler çoğu zaman küçük ve dürüst bir başlangıçla gelir."
    ]
  };

  const actionLines = {
    ask: "Bugün atabileceğin adım: duygunu ve beklentini tek cümleyle kendine yaz; önce kendi netliğini kur.",
    aile: "Bugün atabileceğin adım: aile içinde çözmek istediğin tek konuyu seç ve onu sakin bir dille konuşmayı planla.",
    arkadaslik: "Bugün atabileceğin adım: değer verdiğin bir arkadaşına içten ve kısa bir mesaj gönder.",
    cocukbakimi: "Bugün atabileceğin adım: çocukla geçireceğin küçük ama kaliteli bir zaman bloğu planla.",
    kisiselbakim: "Bugün atabileceğin adım: seni yormayan 3 maddelik basit bir bakım rutini belirle.",
    saglikliyasam: "Bugün atabileceğin adım: su, uyku ve kısa hareketten en az birini iyileştir.",
    motivasyon: "Bugün atabileceğin adım: sadece 10 dakikalık küçük bir başlangıç yap.",
    disiplin: "Bugün atabileceğin adım: yarın da yapabileceğin kadar küçük bir rutin seç.",
    odak: "Bugün atabileceğin adım: 25 dakikalık tek bir odak seansı yap.",
    zaman: "Bugün atabileceğin adım: günün en önemli işini takvime saat vererek yaz.",
    para: "Bugün atabileceğin adım: bugünkü tüm harcamalarını kısa notla kaydet.",
    ishayati: "Bugün atabileceğin adım: işte çözebileceğin tek bir sorunu seç ve ona odaklan.",
    kariyer: "Bugün atabileceğin adım: güçlü olduğun 3 beceriyi yaz ve hangisini derinleştireceğine karar ver.",
    girisim: "Bugün atabileceğin adım: fikrini bir kişiye anlatıp geri bildirim al.",
    yazilim: "Bugün atabileceğin adım: tek bir küçük özellik kodla ve bitir.",
    sosyalmedya: "Bugün atabileceğin adım: tek bir faydalı içerik fikri yaz ve paylaş.",
    egitim: "Bugün atabileceğin adım: öğrendiğin konudan 3 maddelik kısa özet çıkar.",
    kitap: "Bugün atabileceğin adım: okuduğun şeyden tek bir ana fikir not et.",
    iletisim: "Bugün atabileceğin adım: bir konuda ima yerine net cümle kullan.",
    ozguven: "Bugün atabileceğin adım: seni biraz geren ama doğru olan tek bir küçük adım at.",
    stres: "Bugün atabileceğin adım: kontrol edebildiğin tek bir noktaya odaklan.",
    hayat: "Bugün atabileceğin adım: seni en çok zorlayan alanı tek cümlede tanımla.",
    evduzeni: "Bugün atabileceğin adım: sadece bir çekmeceyi ya da küçük bir alanı düzenle.",
    hobi: "Bugün atabileceğin adım: merak ettiğin bir uğraşı 15 dakika dene.",
    liderlik: "Bugün atabileceğin adım: ekipte ya da çevrende netleştirebileceğin tek konuyu açıklığa kavuştur.",
    genel: "Bugün atabileceğin adım: çözmek istediğin konuyu bir cümleyle netleştir."
  };

  const intros = introsForTone(tone);
  const title = titles[topic] || "Genel fikir";
  const body = pick(bodies[topic] || bodies.genel);
  const intro = pick(intros);
  const action = actionLines[topic] || actionLines.genel;

  const intentLine = intentLineFor(intent, original);

  return [
    title,
    "",
    intro,
    "",
    intentLine,
    "",
    body,
    "",
    action
  ].join("\n");
}

function introsForTone(tone) {
  if (tone === "anxious") {
    return [
      "Burada önce baskıyı azaltıp meseleyi sadeleştirmek önemli.",
      "Yazdığın şeyde biraz kaygı ve yön arayışı hissediliyor.",
      "Bu konuda sakin ve net bir çerçeve kurmak en iyi başlangıç olur."
    ];
  }

  if (tone === "ambitious") {
    return [
      "Burada doğru sistem kurulursa güçlü sonuç alınabilir.",
      "Yazdığın konuda büyütme ve ilerleme isteği var.",
      "Bu alan iyi yönetilirse ciddi gelişim sağlayabilir."
    ];
  }

  if (tone === "tired") {
    return [
      "Burada önce yükü azaltmak ve sadeleşmek önemli.",
      "Yazdığın şey biraz yorgunluk ve sıkışmışlık taşıyor.",
      "Bu konuda ilk hedef mükemmellik değil toparlanma olmalı."
    ];
  }

  return [
    "Bu konuda en güçlü başlangıç netliktir.",
    "Burada doğru yönü seçmek her şeyi kolaylaştırır.",
    "Meseleye sade ama etkili yaklaşmak en iyi sonucu verir."
  ];
}

function intentLineFor(intent, original) {
  if (intent === "solution") {
    return `FİKRÂ, yazdığın istekte doğrudan çözüm aradığını görüyor: "${original}"`;
  }
  if (intent === "start") {
    return `FİKRÂ, burada özellikle başlangıç tarafında yön istediğini görüyor: "${original}"`;
  }
  if (intent === "struggle") {
    return `FİKRÂ, bu konuda biraz zorlandığını hissediyor: "${original}"`;
  }
  if (intent === "idea") {
    return `FİKRÂ, bu konuda yeni bir bakış açısı aradığını görüyor: "${original}"`;
  }
  return `FİKRÂ, yazdığın konuda sana uygulanabilir bir yön vermeye çalışıyor: "${original}"`;
}
