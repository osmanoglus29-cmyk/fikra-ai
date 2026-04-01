let lastIdea = "";

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

    const unsafeWords = [
      "intihar", "kendime zarar", "öldür", "bomba", "silah",
      "zehir", "uyuşturucu", "hackleme", "dolandırıcılık",
      "yaralama", "patlayıcı", "birine zarar", "kendimi öldür"
    ];

    if (unsafeWords.some((w) => text.includes(w))) {
      return res.status(200).json({
        fikir:
          "FİKRÂ bu konuda fikir veremez.\n\nBu konu tehlikeli, zarar verici ya da güvenlik açısından riskli görünüyor.\n\nİstersen bunun yerine güvenli ve yapıcı bir alternatif düşünebiliriz."
      });
    }

    const kategori = detectCategory(text);
    let fikir = generateIdea(kategori, mesaj);

    if (fikir === lastIdea) {
      fikir = generateIdea(kategori, mesaj);
    }

    lastIdea = fikir;

    return res.status(200).json({ fikir });
  } catch (err) {
    console.log("API ERROR:", err);
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

function detectCategory(text) {
  const map = {
    ask: ["aşk", "sevgi", "ilişki", "sevgili", "flört", "romantik"],
    ayrilik: ["ayrılık", "terk", "ayrıldık", "eski sevgili", "kalp kırıklığı"],
    aile: ["aile", "anne", "baba", "kardeş", "akraba"],
    arkadaslik: ["arkadaş", "dost", "arkadaşlık", "çevre", "yakın arkadaş"],
    yalnizlik: ["yalnız", "yalnızlık", "tek başıma", "kimsem yok"],
    cocuk: ["çocuk", "bebek", "ebeveyn", "annelik", "babalık"],
    bakim: ["kişisel bakım", "bakım", "cilt", "saç", "giyim", "stil", "görünüş"],
    saglikliyasam: ["sağlıklı yaşam", "sağlık", "iyi hissetmek", "enerji", "rutin"],
    spor: ["spor", "egzersiz", "antrenman", "hareket", "fitness"],
    beslenme: ["beslenme", "diyet", "sağlıklı yemek", "öğün", "protein"],
    uyku: ["uyku", "uykusuzluk", "erken kalkmak", "gece düzeni"],
    motivasyon: ["motivasyon", "istek", "başlamak", "heves", "ilham"],
    disiplin: ["disiplin", "rutin", "istikrar", "alışkanlık", "erteleme"],
    aliskanlik: ["alışkanlık", "alışkanlıklarımı", "kötü alışkanlık", "düzen kurmak"],
    odak: ["odak", "dikkat", "konsantrasyon", "dağınık", "verimlilik"],
    uretkenlik: ["üretkenlik", "üretmek", "çalışkanlık", "iş çıkarma"],
    zaman: ["zaman", "plan", "program", "takvim", "zaman yönetimi"],
    karar: ["karar", "kararsız", "seçim", "hangisi", "ne yapacağım"],
    para: ["para", "kazanç", "gelir", "bütçe", "yatırım", "tasarruf"],
    ishayati: ["iş", "ofis", "çalışma hayatı", "maaş", "kurumsal"],
    kariyer: ["kariyer", "cv", "özgeçmiş", "görüşme", "meslek", "terfi"],
    girisim: ["girişim", "startup", "müşteri", "ürün", "satış", "iş fikri"],
    yazilim: ["yazılım", "kod", "programlama", "frontend", "backend", "web", "mobil"],
    sosyalmedya: ["instagram", "youtube", "tiktok", "sosyal medya", "takipçi"],
    icerik: ["içerik", "video", "reels", "post", "içerik üretimi"],
    marka: ["marka", "kişisel marka", "brand", "imaj"],
    egitim: ["eğitim", "ders", "okul", "öğrenme", "çalışma"],
    sinav: ["sınav", "tyt", "ayt", "vize", "final", "test"],
    universite: ["üniversite", "bölüm", "kampüs", "ünili"],
    kitap: ["kitap", "okuma", "not alma", "özet"],
    iletisim: ["iletişim", "konuşma", "anlaşılmak", "sunum", "kendimi ifade"],
    ozguven: ["özgüven", "cesaret", "çekinmek", "utanmak", "yetersiz"],
    stres: ["stres", "kaygı", "panik", "bunaldım", "gerginlik", "baskı"],
    hayat: ["hayat", "yaşam", "gelecek", "denge", "yol", "amaç"],
    evduzeni: ["ev", "oda", "düzen", "toparlama", "minimalizm"],
    hobi: ["hobi", "uğraş", "boş zaman", "yaratıcılık"],
    yaraticilik: ["yaratıcılık", "ilginç fikir", "yaratıcı", "ilham bulmak"],
    liderlik: ["liderlik", "ekip", "yönetmek", "sorumluluk"],
    dijital: ["telefon", "dijital", "ekran süresi", "internet", "uygulama"]
  };

  let best = "genel";
  let bestScore = 0;

  for (const [key, words] of Object.entries(map)) {
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
      best = key;
    }
  }

  return best;
}

function generateIdea(kategori, mesaj) {
  const girisler = [
    "Bu konuda en önemli şey netliktir.",
    "Burada küçük ama doğru bir yaklaşım büyük fark yaratır.",
    "Bu mesele doğru bakış açısıyla kolaylaşabilir.",
    "Burada önce sade düşünmek gerekir.",
    "Asıl farkı büyük sözler değil doğru küçük adımlar oluşturur."
  ];

  const sonNotlar = [
    "Küçük başla, büyüt.",
    "Süreklilik her şeyden güçlüdür.",
    "Netlik seni hızlandırır.",
    "Düşünmek değil, denemek kazandırır.",
    "Az ama doğru ilerle.",
    "Başlamak mükemmel olmaktan daha değerlidir."
  ];

  const data = {
    ask: [
      "Aşkta en önemli şey netliktir. Karşındaki insanın sözlerinden çok davranışlarına bak. Seni gerçekten isteyen kişi ilgisini tutarlı şekilde gösterir.\n\nBugün atabileceğin adım: duygunu ve beklentini kendine dürüstçe yaz.",
      "Sağlıklı ilişki seni sürekli yormaz. Güvende, anlaşılmış ve değer görmüş hissettiğin bağ daha kıymetlidir.\n\nBugün atabileceğin adım: seni yoran ve iyi gelen şeyleri ayrı ayrı not et.",
      "İlişkide yoğunluk ile değeri karıştırmamak gerekir. Heyecan güçlü olabilir ama denge daha kalıcıdır.\n\nBugün atabileceğin adım: ilişkide vazgeçmeyeceğin 3 değeri belirle."
    ],
    ayrilik: [
      "Ayrılık sonrası en büyük ihtiyaç hızla unutmak değil, duyguyu sağlıklı şekilde işlemektir. Bastırılan duygu daha geç toparlanır.\n\nBugün atabileceğin adım: neye üzüldüğünü açıkça yaz.",
      "Kalp kırıklığı yaşarken kendini eksik hissetmen normal olabilir; ama bu, değerinin azaldığı anlamına gelmez.\n\nBugün atabileceğin adım: kendinle ilgili güçlü 3 yönü yaz.",
      "Ayrılık sonrası hemen her şeyi çözmeye çalışma. Önce düzenini, uykunu ve zihnini toparlamak gerekir.\n\nBugün atabileceğin adım: gününe küçük ama sabit bir rutin ekle."
    ],
    aile: [
      "Aile içinde her şeyi aynı anda düzeltmeye çalışma. Tek bir iletişim noktasını iyileştirmek bile büyük rahatlama sağlar.\n\nBugün atabileceğin adım: konuşulması gereken tek konuyu seç.",
      "Aile ilişkilerinde haklı olmak kadar doğru üslup da önemlidir. Yumuşak ama net cümleler savunmayı azaltır.\n\nBugün atabileceğin adım: suçlamak yerine duygunu anlat.",
      "Ailede yaşanan sorunların çoğu sevgisizlikten değil birikmiş yanlış anlaşılmalardan oluşur.\n\nBugün atabileceğin adım: bir kişiyi gerçekten dinlemeye odaklan."
    ],
    arkadaslik: [
      "Arkadaşlıkta kalite, sayıdan daha değerlidir. Seni yoran kalabalık yerine seni anlayan birkaç insan daha kıymetlidir.\n\nBugün atabileceğin adım: gerçek bağ kurduğun kişileri düşün.",
      "İyi dostluk sadece eğlencede değil zor zamanda da görünür. İlişkiyi sözlerle değil tutarlılıkla değerlendir.\n\nBugün atabileceğin adım: değer verdiğin bir arkadaşına içten mesaj at.",
      "Sosyal çevren enerjini etkiler. Sürekli şikayet eden bir çevre seni de ağırlaştırabilir.\n\nBugün atabileceğin adım: sana iyi gelen insanlarla daha çok temas kur."
    ],
    yalnizlik: [
      "Yalnızlık her zaman insan eksikliği değil, anlamlı bağ eksikliğidir. Çok kişi içinde de yalnız hissedebilirsin.\n\nBugün atabileceğin adım: gerçek bağlantı kurabileceğin bir kişiye yaz.",
      "Yalnız hissettiğinde önce kendini yargılamayı bırak. Bu duygu utanılacak değil, anlaşılması gereken bir işarettir.\n\nBugün atabileceğin adım: seni neyin eksik hissettirdiğini yaz.",
      "Yalnızlık dönemleri bazen kendini yeniden kurmak için alan açar. Boşluğu sadece acı olarak görme.\n\nBugün atabileceğin adım: kendine iyi gelen bir aktivite planla."
    ],
    cocuk: [
      "Çocuk bakımında en önemli şey kusursuzluk değil tutarlılıktır. Çocuklar çoğu zaman mükemmel plandan çok güvenli ve düzenli ilgiye ihtiyaç duyar.\n\nBugün atabileceğin adım: küçük bir oyun veya sakin zaman planla.",
      "Çocuklarla iletişimde açıklık ve sabır çok önemlidir. Sadece öğretmek değil, birlikte deneyim kurmak da gelişimi destekler.\n\nBugün atabileceğin adım: birlikte 15 dakikalık kaliteli zaman ayır.",
      "Ebeveynlikte yükü bir anda çözmeye çalışma. Küçük rutinler büyük rahatlık sağlar.\n\nBugün atabileceğin adım: uyku, yemek veya oyun için tek bir sabit düzen belirle."
    ],
    bakim: [
      "Kişisel bakımın amacı kusursuz görünmek değil, kendine düzenli değer vermektir. Az ama sürdürülebilir bir rutin en güçlü sonuçları verir.\n\nBugün atabileceğin adım: 3 maddelik basit bir bakım rutini yaz.",
      "Bakım konusunda pahalı ürünlerden önce düzen önemlidir. Temizlik, sadelik ve tutarlılık çoğu zaman yeterlidir.\n\nBugün atabileceğin adım: seni yormayan tek bir bakım alışkanlığı seç.",
      "Kendine özen göstermek sadece dış görünüş değil, özsaygı meselesidir.\n\nBugün atabileceğin adım: kendine ayıracağın kısa bir bakım zamanı belirle."
    ],
    saglikliyasam: [
      "Sağlıklı yaşam büyük değişimlerden çok düzenli küçük seçimlerle kurulur. Uyku, su, hareket ve beslenme temeli sağlam olursa enerji toparlanır.\n\nBugün atabileceğin adım: bir temel alışkanlığı iyileştir.",
      "Kendine çok yüklenmeden basit bir sağlık rutini kurmak en etkili yoldur. Az ama sürekli hareket, kısa süreli yoğun çabadan daha değerlidir.\n\nBugün atabileceğin adım: 10 dakikalık yürüyüş yap.",
      "Beden iyi çalışmadığında zihin de dağılır. Sağlıklı yaşamı dış görünüş değil yaşam kalitesi olarak düşün.\n\nBugün atabileceğin adım: su ve uyku düzenine bak."
    ],
    spor: [
      "Spora başlamak için mükemmel program gerekmez. Düzenli küçük hareket, plansız büyük hevesten daha değerlidir.\n\nBugün atabileceğin adım: kısa bir egzersiz yap.",
      "Antrenmanda sürdürülebilirlik, yoğunluktan daha önemlidir. Seni bitiren sistem değil, devam ettiren sistem iyidir.\n\nBugün atabileceğin adım: haftalık mini plan çıkar.",
      "Sporu sadece görünüş için değil enerji ve zihinsel güç için de düşün.\n\nBugün atabileceğin adım: hareketten sonra nasıl hissettiğini not et."
    ],
    beslenme: [
      "Beslenmede en güçlü değişim, bir anda her şeyi bozup yeniden kurmak değil, tek bir alışkanlığı düzeltmektir.\n\nBugün atabileceğin adım: tek bir öğünü iyileştir.",
      "Sağlıklı beslenme ceza gibi hissettirmemeli. Sürdürülebilir düzen, geçici sıkılıktan daha etkilidir.\n\nBugün atabileceğin adım: su ve öğün dengesine bak.",
      "Yediklerin sadece bedenini değil, enerjini ve odağını da etkiler.\n\nBugün atabileceğin adım: seni ağırlaştıran bir alışkanlığı azalt."
    ],
    uyku: [
      "Uyku düzeni bozuksa performansın dağılması normaldir. Zihin iyi dinlenmeden net çalışamaz.\n\nBugün atabileceğin adım: sabit bir yatış saati belirle.",
      "Uykuyu sadece dinlenme değil, zihinsel toparlanma olarak düşün. Kalitesiz uyku, gün içindeki gücünü zayıflatır.\n\nBugün atabileceğin adım: uyumadan önce ekranı azalt.",
      "Gece düzeni toparlanmadan sabah performansı artmaz.\n\nBugün atabileceğin adım: uyku öncesi kısa sakin rutin kur."
    ],
    motivasyon: [
      "Motivasyon çoğu zaman bekleyince değil hareket edince gelir. Büyük hedefi düşünmek yerine çok küçük bir ilk adım seç.\n\nBugün atabileceğin adım: sadece 10 dakika başla.",
      "İsteksizlik her zaman tembellik değildir. Bazen mesele sistem eksikliğidir; ne yapacağını netleştirince enerji toparlanır.\n\nBugün atabileceğin adım: yapacağın işi tek cümleyle tanımla.",
      "Kendini suçlamak yerine ritim kurmaya odaklan. Küçük ama tekrar eden hareketler büyük motivasyondan daha kalıcıdır.\n\nBugün atabileceğin adım: yarın da yapabileceğin küçük bir görev seç."
    ],
    disiplin: [
      "Disiplin, istemediğin günlerde de küçük doğru hareketi yapabilmektir. Büyük planlardan çok tekrar eden küçük düzenler güç üretir.\n\nBugün atabileceğin adım: yarın da yapabileceğin kadar küçük bir rutin seç.",
      "Kendini bir anda değiştirmeye çalışma. Her gün aynı saatte yapılan küçük bir rutin karakteri güçlendirir.\n\nBugün atabileceğin adım: sabit saat belirle.",
      "Disiplini duyguya bağlarsan koparsın; saate ve sisteme bağlarsan büyürsün.\n\nBugün atabileceğin adım: en küçük sürdürülebilir görevi seç."
    ],
    aliskanlik: [
      "Alışkanlıklar karakterin sessiz inşasıdır. Her gün yaptığın şey, kim olduğunu şekillendirir.\n\nBugün atabileceğin adım: tek alışkanlık seç.",
      "Kötü alışkanlığı bırakmak için sadece yasak koymak yetmez; yerine bir alternatif koymak gerekir.\n\nBugün atabileceğin adım: yerine koyacağın davranışı yaz.",
      "İyi alışkanlıklar küçük görünür ama uzun vadede büyük sonuç üretir.\n\nBugün atabileceğin adım: 2 dakikalık başlangıç kuralı uygula."
    ],
    odak: [
      "Odak sorunu çoğu zaman dikkat eksikliğinden değil, öncelik belirsizliğinden doğar. Tek hedef seçildiğinde zihin daha rahat çalışır.\n\nBugün atabileceğin adım: bir işi seç ve onu bitirmeden diğerine geçme.",
      "Aynı anda her şeyi yapmak verimli görünür ama derin sonuç vermez. Bir işi bitirmeden diğerine geçmemek güçlü alışkanlıktır.\n\nBugün atabileceğin adım: 25 dakikalık tek odak seansı yap.",
      "Dikkatini korumak da üretimin parçasıdır. Seni bölen şeyleri azaltmadan yüksek kalite beklemek zordur.\n\nBugün atabileceğin adım: telefonu senden uzaklaştır."
    ],
    uretkenlik: [
      "Üretkenlik, çok şey yapmak değil önemli şeyi bitirebilmektir.\n\nBugün atabileceğin adım: tek bir yüksek değerli işi bitir.",
      "Görev listesi uzadıkça zihin baskılanabilir. Az ama net öncelik daha güçlüdür.\n\nBugün atabileceğin adım: 3 ana iş belirle.",
      "Gerçek üretkenlik meşgul görünmekten değil sonuç çıkarmaktan gelir.\n\nBugün atabileceğin adım: günün sonunda ne üretmek istediğini yaz."
    ],
    zaman: [
      "Zaman yönetiminde en büyük sorun çoğu zaman zaman azlığı değil, öncelik dağınıklığıdır. Takvime girmeyen iş çoğunlukla gerçekleşmez.\n\nBugün atabileceğin adım: en önemli işine saat ver.",
      "Günün her saatini doldurmak yerine yüksek değerli işleri öne almak gerekir. Meşgul olmak ile ilerlemek aynı şey değildir.\n\nBugün atabileceğin adım: 3 öncelik yaz.",
      "Zamanı daha iyi kullanmak için önce neye evet, neye hayır dediğini netleştirmelisin.\n\nBugün atabileceğin adım: gereksiz bir işi çıkar."
    ],
    karar: [
      "Kararsızlık çoğu zaman seçenek fazlalığından doğar. Konuyu biraz daraltmak zihni rahatlatır.\n\nBugün atabileceğin adım: seçenekleri 2’ye indir.",
      "Her kararın kusursuz olması gerekmez. Düşük riskli küçük deneme yapmak çoğu zaman daha öğreticidir.\n\nBugün atabileceğin adım: mini test yap.",
      "Yanlış karar korkusu bazen hareketsizlik üretir. Oysa netlik çoğu zaman hareketin içinden gelir.\n\nBugün atabileceğin adım: ilk adımı seç."
    ],
    para: [
      "Para konusunda ilk güç kontrolle başlar. Daha fazla kazanmak kadar mevcut paranın nereye gittiğini görmek de önemlidir.\n\nBugün atabileceğin adım: gün içindeki tüm harcamalarını not et.",
      "Kazanç artırmak istiyorsan sadece daha çok çalışmayı değil, daha değerli iş üretmeyi düşün. Küçük ama satılabilir bir beceri güçlü sonuç verir.\n\nBugün atabileceğin adım: para kazanabileceğin 1 becerini yaz.",
      "Birikim kısa vadede küçük görünür ama uzun vadede özgürlük sağlar. Asıl mesele büyük para değil, sürdürülebilir düzen kurmaktır.\n\nBugün atabileceğin adım: küçük tasarruf hedefi belirle."
    ],
    ishayati: [
      "İş hayatında fark, sadece çok çalışmakla değil sorun çözmekle oluşur. Net ve güven veren insanlar daha kolay öne çıkar.\n\nBugün atabileceğin adım: çözebileceğin tek bir problemi seç.",
      "İş yerinde çoğu sorun iletişim eksikliğinden büyür. Kimin ne yapacağı ne kadar netse stres o kadar azalır.\n\nBugün atabileceğin adım: iş akışında netleştireceğin tek nokta belirle.",
      "Profesyonellik bazen en çok sakin, anlaşılır ve zamanında iletişim kurabilmektir.\n\nBugün atabileceğin adım: bir mesajı daha net yaz."
    ],
    kariyer: [
      "Kariyerini büyütmek istiyorsan görünür değer üretmelisin. Projeler, beceriler ve iletişim dili burada çok önemlidir.\n\nBugün atabileceğin adım: güçlü olduğun 3 yönü yaz.",
      "İş görüşmesi veya kariyer değişiminde önce netlik gerekir. Ne istediğini bilmeden doğru fırsatı seçmek zorlaşır.\n\nBugün atabileceğin adım: sana uygun iş tarzını yaz.",
      "Her şeyi bilmek yerine belirli bir alanda derinleşmek seni daha hatırlanır yapar.\n\nBugün atabileceğin adım: derinleşeceğin tek alan seç."
    ],
    girisim: [
      "Girişimde iyi fikir, heyecan verici görünenden çok gerçek problemi çözen fikirdir. İnsanların gerçekten yaşadığı sorunu seçmek en kritik adımdır.\n\nBugün atabileceğin adım: çözmek istediğin problemi yaz.",
      "Büyük sistem kurmadan önce küçük doğrulama yapmak gerekir. Önce insanların buna ihtiyaç duyup duymadığını test et.\n\nBugün atabileceğin adım: fikrini birine anlat.",
      "Girişimde hız önemlidir ama yön daha önemlidir. Yanlış problemi hızlı çözmek yerine doğru problemi net görmek daha değerlidir.\n\nBugün atabileceğin adım: müşteriyi düşün."
    ],
    yazilim: [
      "Yazılım öğrenmenin en hızlı yolu küçük proje yapmaktır. Sadece ders izlemek yerine çalışan mini parçalar üretmek seni hızlandırır.\n\nBugün atabileceğin adım: tek bir küçük özellik kodla.",
      "Kod yazarken hata almak kötü değil, gelişimin doğal parçasıdır. Asıl fark hatasız olmakta değil, hatayı çözebilmekte oluşur.\n\nBugün atabileceğin adım: aldığın son hatayı not edip çözümünü araştır.",
      "Yazılımda ilerlemek için süreklilik çok önemlidir. Büyük hedeflerden önce küçük ama düzenli üretim sistemi kur.\n\nBugün atabileceğin adım: GitHub'a minicik de olsa bir commit at."
    ],
    sosyalmedya: [
      "Sosyal medyada büyüme, sadece dikkat çekmekle değil düzenli değer üretmekle olur. İnsanlar fayda gördüğü hesabı takip eder.\n\nBugün atabileceğin adım: tek bir faydalı içerik fikri yaz.",
      "İçerik üretirken kusursuz görünmeye çalışmak seni yavaşlatır. Düzenli ve net paylaşım daha güçlü marka kurar.\n\nBugün atabileceğin adım: paylaşılabilir bir içerik hazırla.",
      "Marka sadece görsel değil; tekrar eden tonun, yaklaşımın ve verdiğin his ile oluşur.\n\nBugün atabileceğin adım: içerik tonunu belirle."
    ],
    icerik: [
      "İçerik üretiminde önce değer, sonra görünürlük gelir. İnsanlar onlara bir şey katan içeriğe döner.\n\nBugün atabileceğin adım: tek bir probleme çözüm anlat.",
      "Sürekli ilham beklemek içerik üretimini yavaşlatır. Şablon ve seri mantığı kurmak daha etkilidir.\n\nBugün atabileceğin adım: 3 içerik başlığı yaz.",
      "İçerik üretirken mükemmel olmaya değil anlaşılır olmaya odaklan. Netlik daha hızlı büyütür.\n\nBugün atabileceğin adım: bir fikri sadeleştir."
    ],
    marka: [
      "Marka, sadece logo değil; verdiğin his, tekrar eden ton ve çözdüğün problemle oluşur.\n\nBugün atabileceğin adım: markanın neyi temsil ettiğini tek cümleyle yaz.",
      "Kişisel marka inşa ederken önce kim olduğun değil, ne değer sunduğun net olmalı.\n\nBugün atabileceğin adım: insanlara sunduğun faydayı yaz.",
      "Güçlü marka, tutarlılıkla oluşur. Farklı görünmeye çalışmaktan önce aynı kaliteyi tekrar et.\n\nBugün atabileceğin adım: sabit içerik tarzı belirle."
    ],
    egitim: [
      "Eğitim konusunda asıl fark, bilgiyi biriktirmek değil kullanabilmektir. Öğrendiğin şeyi not, tekrar veya uygulamayla sabitlemek gerekir.\n\nBugün atabileceğin adım: 3 maddelik kısa özet çıkar.",
      "Çalışma düzeninde az ama sürekli sistem, bir anda yüklenmekten daha verimlidir. Dağınık çaba zihni yorar.\n\nBugün atabileceğin adım: 25 dakikalık çalışma bloğu yap.",
      "Bir konuyu anlamak istiyorsan onu böl, sadeleştir ve kendi cümlelerinle yeniden kur.\n\nBugün atabileceğin adım: zor konuyu basitleştir."
    ],
    sinav: [
      "Sınav sürecinde sadece çok çalışmak yetmez; doğru tekrar ve düzen gerekir.\n\nBugün atabileceğin adım: zayıf olduğun bir konuyu seç.",
      "Sınav kaygısını azaltmanın yolu kontrol edebildiğin parçaya odaklanmaktır.\n\nBugün atabileceğin adım: bugünkü hedefini net yaz.",
      "Uzun çalışma yerine kaliteli bloklar daha etkilidir.\n\nBugün atabileceğin adım: süre tutarak kısa çalışma seansı yap."
    ],
    universite: [
      "Üniversite sadece ders değil, yön arama ve çevre kurma alanıdır.\n\nBugün atabileceğin adım: geliştirmek istediğin tek alanı belirle.",
      "Bölüm seçimi ya da üniversite hayatında her şeyin hemen net olması gerekmez. Deneyim, yönü zamanla açar.\n\nBugün atabileceğin adım: ilgini çeken alanları yaz.",
      "Kampüs hayatında görünür olmak fırsat doğurabilir. İletişim burada çok değerlidir.\n\nBugün atabileceğin adım: yeni bir topluluk araştır."
    ],
    kitap: [
      "Okuma alışkanlığında önemli olan çok okumak değil, düzenli okumaktır. Az ama sürekli okuma daha kalıcı etki bırakır.\n\nBugün atabileceğin adım: 10 sayfa oku.",
      "Bir kitaptan asıl fayda, onu bitirmekten çok ana fikrini çıkarabilmekle gelir.\n\nBugün atabileceğin adım: tek cümlelik özet yaz.",
      "Kitabı tüketmek yerine ondan bir cümleyi hayata geçirmek daha değerlidir.\n\nBugün atabileceğin adım: bir fikri uygula."
    ],
    iletisim: [
      "İletişimde en güçlü beceri sadece konuşmak değil, doğru tonla ve doğru zamanda konuşabilmektir.\n\nBugün atabileceğin adım: kısa ve net cümle kur.",
      "Çoğu yanlış anlaşılma niyetten değil ifade biçiminden doğar. Basit, sakin ve net cümleler büyük fark yaratır.\n\nBugün atabileceğin adım: ima yerine açık konuş.",
      "Anlaşılmak istiyorsan önce seni neyin rahatsız ettiğini fark etmen gerekir.\n\nBugün atabileceğin adım: hissettiğini adlandır."
    ],
    ozguven: [
      "Özgüven, kusursuz hissetmek değil; eksik olsan bile hareket edebilmek demektir. Küçük cesaretler büyüyerek iç güven oluşturur.\n\nBugün atabileceğin adım: seni geren küçük bir adım at.",
      "Başkalarının seni nasıl gördüğüne fazla odaklanırsan kendi merkezini kaybedersin. Sağlam özgüven iç netlikten doğar.\n\nBugün atabileceğin adım: güçlü yanlarını yaz.",
      "Özgüveni artırmanın en pratik yolu küçük kanıtlar biriktirmektir. Bitirdiğin işler iç güven üretir.\n\nBugün atabileceğin adım: tamamlayacağın tek bir iş seç."
    ],
    stres: [
      "Stres yükseldiğinde önce her şeyi çözmeye çalışma. Etkileyebildiğin tek noktayı bulup oraya yönelmek zihni sakinleştirir.\n\nBugün atabileceğin adım: kontrol alanını yaz.",
      "Bazen sorun çözüm eksikliği değil, aşırı yüklenmiş zihindir. Bedeni yavaşlatmak düşünce kalitesini toparlayabilir.\n\nBugün atabileceğin adım: kısa nefes molası ver.",
      "Stresi azaltmanın yolu mükemmel plan değil, küçük kontrol alanları oluşturmaktır.\n\nBugün atabileceğin adım: tek bir sonraki adımı belirle."
    ],
    hayat: [
      "Hayatta netlik çoğu zaman başlamadan önce değil, yürürken gelir. Bu yüzden küçük bir adım büyük düşünceden daha öğretici olabilir.\n\nBugün atabileceğin adım: bir küçük karar ver.",
      "Her şeyi aynı anda düzeltmeye çalışmak yerine seni en çok zorlayan alanı seçmek daha etkilidir.\n\nBugün atabileceğin adım: en önemli alanı belirle.",
      "Hayatını sadeleştirmek bazen yeni şey eklemekten daha güçlü sonuç verir.\n\nBugün atabileceğin adım: bir gereksiz yükü bırak."
    ],
    evduzeni: [
      "Ev düzeninde amaç kusursuzluk değil, akışı kolaylaştırmaktır. Sade sistemler uzun ömürlü olur.\n\nBugün atabileceğin adım: küçük bir alan düzenle.",
      "Her şeyi bir anda toplamak yerine alan alan gitmek daha gerçekçidir.\n\nBugün atabileceğin adım: sadece bir çekmeceyi toparla.",
      "Evini yaşadığın zihinsel alan gibi düşün. Dıştaki dağınıklık çoğu zaman iç yükü artırır.\n\nBugün atabileceğin adım: fazlalıkları ayır."
    ],
    hobi: [
      "Hobi seçerken en önemli şey yetenek değil merak ve sürdürülebilirliktir. Seni hafifleten uğraş doğru başlangıçtır.\n\nBugün atabileceğin adım: 15 dakikalık deneme yap.",
      "Boş zamanını sadece tüketimle doldurmak yerine küçük üretim alanı açmak zihni dinlendirir.\n\nBugün atabileceğin adım: ilgini çeken bir şeyi dene.",
      "Hobiler verimsiz görünen ama hayat kalitesini ciddi biçimde artıran alanlardır.\n\nBugün atabileceğin adım: keyif aldığın şeyi yaz."
    ],
    yaraticilik: [
      "Yaratıcılık ilham beklemekle değil üretim alanı açmakla güçlenir.\n\nBugün atabileceğin adım: aklına gelen 10 fikri filtrelemeden yaz.",
      "İyi fikirler çoğu zaman ilk anda değil, tekrar düşünce gelir.\n\nBugün atabileceğin adım: tek bir fikri geliştir.",
      "Yaratıcılık için kusursuzluk baskısını azaltmak gerekir.\n\nBugün atabileceğin adım: kötü olmasına izin vererek başla."
    ],
    liderlik: [
      "Liderlik önde görünmek değil, zor anda sorumluluk alabilmektir. Güven veren insan ekipte fark yaratır.\n\nBugün atabileceğin adım: netleştirebileceğin tek konuyu açıklığa kavuştur.",
      "İyi liderlik talimat dağıtmaktan çok netlik ve güven üretmektir.\n\nBugün atabileceğin adım: ekibe açık bir çerçeve ver.",
      "İnsanlar sadece yön değil, sakinlik ve tutarlılık da ister.\n\nBugün atabileceğin adım: verdiğin sözleri gözden geçir."
    ],
    dijital: [
      "Dijital yaşamı yönetmek, zamanı ve dikkati yönetmenin bir parçasıdır.\n\nBugün atabileceğin adım: ekran süreni azaltacak tek ayar yap.",
      "Telefon ve internet faydalı araç olabilir ama kontrol sende kalmalı.\n\nBugün atabileceğin adım: bildirimleri sadeleştir.",
      "Dijital düzen kurulmadan odak ve üretkenlik zorlaşır.\n\nBugün atabileceğin adım: gereksiz bir uygulamayı kapat."
    ],
    genel: [
      "Bu konuda en güçlü başlangıç netliktir. Her şeyi aynı anda çözmeye çalışma; önce tek bir noktayı seç.\n\nBugün atabileceğin adım: çözmek istediğin şeyi tek cümleyle yaz.",
      "Kararsız kaldığında küçük bir deneme yapmak uzun düşünceden daha faydalıdır. Hareket ettikçe yön daha net görünür.\n\nBugün atabileceğin adım: küçük bir ilk adım belirle.",
      "Büyük değişimler çoğu zaman küçük ama dürüst başlangıçlarla gelir.\n\nBugün atabileceğin adım: bugün yapabileceğin en küçük doğru hareketi seç."
    ]
  };

  return [
    pick(girisler),
    "",
    pick(data[kategori] || data.genel),
    "",
    "FİKRÂ notu: " + pick(sonNotlar)
  ].join("\n");
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function hasAny(text, words) {
  return words.some(word => text.includes(word));
}      text.includes("web")
    ) {
      const list = [
        "Yazılım öğrenmenin en hızlı yolu küçük proje yapmaktır.\n\nSadece ders izlemek yerine çalışan mini parçalar üretmek seni hızlandırır.\n\nBugün atabileceğin adım: tek bir küçük özellik kodla.",
        "Kod yazarken hata almak kötü değil, gelişimin doğal parçasıdır.\n\nAsıl fark hatasız olmakta değil, hatayı çözebilmekte oluşur.\n\nBugün atabileceğin adım: aldığın son hatayı not edip çözümünü araştır.",
        "Yazılımda ilerlemek için süreklilik çok önemlidir.\n\nBüyük hedeflerden önce küçük ama düzenli üretim sistemi kur.\n\nBugün atabileceğin adım: GitHub'a minicik de olsa bir commit at."
      ];
      fikir = pick(list);
    } else if (
      text.includes("motivasyon") ||
      text.includes("başlamak") ||
      text.includes("istek") ||
      text.includes("ilham")
    ) {
      const list = [
        "Motivasyon çoğu zaman bekleyince değil hareket edince gelir.\n\nBüyük hedefi düşünmek yerine çok küçük bir ilk adım seç.\n\nBugün atabileceğin adım: sadece 10 dakika başla.",
        "İsteksizlik her zaman tembellik değildir.\n\nBazen mesele sistem eksikliğidir; ne yapacağını netleştirince enerji toparlanır.\n\nBugün atabileceğin adım: yapacağın işi tek cümleyle tanımla.",
        "Kendini suçlamak yerine ritim kurmaya odaklan.\n\nKüçük ama tekrar eden hareketler büyük motivasyondan daha kalıcıdır.\n\nBugün atabileceğin adım: yarın da yapabileceğin kadar küçük bir görev seç."
      ];
      fikir = pick(list);
    } else if (
      text.includes("çocuk") ||
      text.includes("bebek") ||
      text.includes("ebeveyn")
    ) {
      const list = [
        "Çocuk bakımında en önemli şey kusursuzluk değil tutarlılıktır.\n\nÇocuklar çoğu zaman mükemmel plandan çok güvenli ve düzenli ilgiye ihtiyaç duyar.\n\nBugün atabileceğin adım: küçük bir oyun veya sakin zaman planla.",
        "Çocuklarla iletişimde açıklık ve sabır çok önemlidir.\n\nSadece öğretmek değil, birlikte deneyim kurmak da gelişimi destekler.\n\nBugün atabileceğin adım: birlikte 15 dakikalık kaliteli zaman ayır.",
        "Ebeveynlikte yükü bir anda çözmeye çalışma.\n\nKüçük rutinler büyük rahatlık sağlar.\n\nBugün atabileceğin adım: uyku, yemek veya oyun için tek bir sabit düzen belirle."
      ];
      fikir = pick(list);
    } else if (
      text.includes("bakım") ||
      text.includes("cilt") ||
      text.includes("saç") ||
      text.includes("kişisel bakım")
    ) {
      const list = [
        "Kişisel bakımın amacı kusursuz görünmek değil, kendine düzenli değer vermektir.\n\nAz ama sürdürülebilir bir rutin en güçlü sonuçları verir.\n\nBugün atabileceğin adım: 3 maddelik basit bir bakım rutini yaz.",
        "Bakım konusunda pahalı ürünlerden önce düzen önemlidir.\n\nTemizlik, sadelik ve tutarlılık çoğu zaman yeterlidir.\n\nBugün atabileceğin adım: seni yormayan tek bir bakım alışkanlığı seç.",
        "Kendine özen göstermek sadece dış görünüş değil, özsaygı meselesidir.\n\nKüçük bakım adımları bile ruh halini toparlayabilir.\n\nBugün atabileceğin adım: kendine ayıracağın kısa bir bakım zamanı belirle."
      ];
      fikir = pick(list);
    } else if (
      text.includes("iş") ||
      text.includes("kariyer") ||
      text.includes("cv") ||
      text.includes("görüşme")
    ) {
      const list = [
        "İş hayatında fark, sadece çok çalışmakla değil sorun çözmekle oluşur.\n\nNet ve güven veren insanlar daha kolay öne çıkar.\n\nBugün atabileceğin adım: çözebileceğin tek bir problemi seç.",
        "Kariyerini büyütmek istiyorsan görünür değer üretmelisin.\n\nProjeler, beceriler ve iletişim dili burada çok önemlidir.\n\nBugün atabileceğin adım: güçlü olduğun 3 yönü yaz.",
        "İş görüşmesi veya kariyer değişiminde önce netlik gerekir.\n\nNe istediğini bilmeden doğru fırsatı seçmek zorlaşır.\n\nBugün atabileceğin adım: hangi iş tarzının sana uygun olduğunu yaz."
      ];
      fikir = pick(list);
    } else {
      const list = [
        "Bu konuda en güçlü başlangıç netliktir.\n\nHer şeyi aynı anda çözmeye çalışma; önce tek bir noktayı seç.\n\nBugün atabileceğin adım: çözmek istediğin şeyi tek cümleyle yaz.",
        "Kararsız kaldığında küçük bir deneme yapmak uzun düşünceden daha faydalıdır.\n\nHareket ettikçe yön daha net görünür.\n\nBugün atabileceğin adım: küçük bir ilk adım belirle.",
        "Büyük değişimler çoğu zaman küçük ama dürüst başlangıçlarla gelir.\n\nKendine fazla yüklenmeden sade bir yol seç.\n\nBugün atabileceğin adım: bugün yapabileceğin en küçük doğru hareketi seç."
      ];
      fikir = pick(list);
    }

    return res.status(200).json({ fikir });
  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ fikir: "Sunucu hatası oluştu." });
  }
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
