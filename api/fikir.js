let lastIdeas = [];

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
      "intihar",
      "kendime zarar",
      "öldür",
      "bomba",
      "silah",
      "zehir",
      "uyuşturucu",
      "hackleme",
      "dolandırıcılık",
      "yaralama",
      "patlayıcı"
    ];

    if (unsafeWords.some((w) => text.includes(w))) {
      return res.status(200).json({
        fikir:
          "FİKRÂ bu konuda fikir veremez.\n\nBu konu tehlikeli, zarar verici ya da güvenlik açısından riskli görünüyor.\n\nİstersen bunun yerine güvenli ve yapıcı bir alternatif düşünebiliriz."
      });
    }

    const kategori = detectCategory(text);
    const fikirler = buildThreeIdeas(kategori);

    lastIdeas = fikirler;

    return res.status(200).json({
      fikir: formatThreeIdeas(fikirler)
    });
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

function hasAny(text, words) {
  return words.some((word) => text.includes(word));
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

function detectCategory(text) {
  if (hasAny(text, ["aşk", "sevgi", "ilişki", "sevgili", "flört", "ayrılık"])) return "ask";
  if (hasAny(text, ["aile", "anne", "baba", "kardeş", "akraba"])) return "aile";
  if (hasAny(text, ["arkadaş", "arkadaşlık", "dost", "çevre"])) return "arkadaslik";
  if (hasAny(text, ["yalnız", "yalnızlık", "tek başıma"])) return "yalnizlik";
  if (hasAny(text, ["çocuk", "bebek", "ebeveyn", "annelik", "babalık"])) return "cocuk";
  if (hasAny(text, ["kişisel bakım", "bakım", "cilt", "saç", "stil", "giyinme"])) return "bakim";
  if (hasAny(text, ["sağlık", "sağlıklı yaşam", "iyi hissetmek", "enerji"])) return "saglik";
  if (hasAny(text, ["spor", "egzersiz", "antrenman", "fitness", "hareket"])) return "spor";
  if (hasAny(text, ["beslenme", "diyet", "öğün", "protein", "yemek düzeni"])) return "beslenme";
  if (hasAny(text, ["uyku", "uykusuzluk", "erken kalkmak"])) return "uyku";
  if (hasAny(text, ["motivasyon", "heves", "başlamak", "istek", "ilham"])) return "motivasyon";
  if (hasAny(text, ["disiplin", "rutin", "istikrar", "erteleme"])) return "disiplin";
  if (hasAny(text, ["alışkanlık", "kötü alışkanlık", "iyi alışkanlık"])) return "aliskanlik";
  if (hasAny(text, ["odak", "dikkat", "konsantrasyon", "dağınık"])) return "odak";
  if (hasAny(text, ["üretkenlik", "üretmek", "iş çıkarma"])) return "uretkenlik";
  if (hasAny(text, ["zaman", "plan", "program", "takvim"])) return "zaman";
  if (hasAny(text, ["karar", "kararsız", "seçim", "hangisi"])) return "karar";
  if (hasAny(text, ["para", "gelir", "kazanç", "bütçe", "yatırım", "tasarruf"])) return "para";
  if (hasAny(text, ["iş", "ofis", "maaş", "kurumsal"])) return "is";
  if (hasAny(text, ["kariyer", "cv", "özgeçmiş", "görüşme", "terfi", "meslek"])) return "kariyer";
  if (hasAny(text, ["girişim", "startup", "müşteri", "ürün", "iş fikri", "satış"])) return "girisim";
  if (hasAny(text, ["yazılım", "kod", "programlama", "web", "frontend", "backend", "mobil"])) return "yazilim";
  if (hasAny(text, ["instagram", "youtube", "tiktok", "sosyal medya", "takipçi"])) return "sosyalmedya";
  if (hasAny(text, ["içerik", "video", "post", "reels", "içerik üretimi"])) return "icerik";
  if (hasAny(text, ["marka", "kişisel marka", "imaj", "brand"])) return "marka";
  if (hasAny(text, ["eğitim", "ders", "okul", "öğrenme", "çalışma"])) return "egitim";
  if (hasAny(text, ["sınav", "tyt", "ayt", "vize", "final", "test"])) return "sinav";
  if (hasAny(text, ["üniversite", "bölüm", "kampüs"])) return "universite";
  if (hasAny(text, ["kitap", "okuma", "özet", "not alma"])) return "kitap";
  if (hasAny(text, ["iletişim", "konuşma", "sunum", "kendimi ifade", "anlaşılmak"])) return "iletisim";
  if (hasAny(text, ["özgüven", "cesaret", "çekinmek", "utanmak", "yetersiz"])) return "ozguven";
  if (hasAny(text, ["stres", "kaygı", "panik", "bunaldım", "baskı"])) return "stres";
  if (hasAny(text, ["hayat", "yaşam", "denge", "gelecek", "amaç", "yol"])) return "hayat";
  if (hasAny(text, ["ev", "oda", "düzen", "toparlama", "minimalizm"])) return "evduzeni";
  if (hasAny(text, ["hobi", "uğraş", "boş zaman"])) return "hobi";
  if (hasAny(text, ["yaratıcılık", "yaratıcı", "ilham bulmak"])) return "yaraticilik";
  if (hasAny(text, ["liderlik", "ekip", "yönetmek", "sorumluluk"])) return "liderlik";
  if (hasAny(text, ["telefon", "ekran süresi", "internet", "uygulama", "dijital"])) return "dijital";

  return "genel";
}

function buildThreeIdeas(category) {
  const intros = [
    "Bu konuda en önemli şey netliktir.",
    "Burada küçük ama doğru bir yaklaşım büyük fark yaratır.",
    "Bu mesele doğru bakış açısıyla kolaylaşabilir.",
    "Burada önce sade düşünmek gerekir."
  ];

  const notes = [
    "Küçük başla, büyüt.",
    "Süreklilik her şeyden güçlüdür.",
    "Netlik seni hızlandırır.",
    "Düşünmek değil, denemek kazandırır.",
    "Az ama doğru ilerle.",
    "Başlamak mükemmel olmaktan daha değerlidir."
  ];

  const ideas = {
    ask: [
      "Aşkta en önemli şey netliktir. Karşındaki insanın sözlerinden çok davranışlarına bak. Seni gerçekten isteyen kişi ilgisini tutarlı şekilde gösterir.\n\nBugün atabileceğin adım: duygunu ve beklentini kendine dürüstçe yaz.",
      "Sağlıklı ilişki seni sürekli yormaz. Güvende, anlaşılmış ve değer görmüş hissettiğin bağ daha kıymetlidir.\n\nBugün atabileceğin adım: seni yoran ve iyi gelen şeyleri ayrı ayrı not et.",
      "İlişkide yoğunluk ile değeri karıştırmamak gerekir. Heyecan güçlü olabilir ama denge daha kalıcıdır.\n\nBugün atabileceğin adım: ilişkide vazgeçmeyeceğin 3 değeri belirle.",
      "İlişkilerde sevgi kadar iletişim de belirleyicidir. Hisleri saklamak çoğu zaman mesafeyi büyütür.\n\nBugün atabileceğin adım: duygunu sade bir cümleyle ifade et.",
      "Karşındaki kişiyi anlamaya çalışırken kendini kaybetmemek gerekir. Sağlıklı bağ iki tarafı da korur.\n\nBugün atabileceğin adım: sınırlarını not et."
    ],
    aile: [
      "Aile içinde her şeyi aynı anda düzeltmeye çalışma. Tek bir iletişim noktasını iyileştirmek bile büyük rahatlama sağlar.\n\nBugün atabileceğin adım: konuşulması gereken tek konuyu seç.",
      "Aile ilişkilerinde haklı olmak kadar doğru üslup da önemlidir. Yumuşak ama net cümleler savunmayı azaltır.\n\nBugün atabileceğin adım: suçlamak yerine duygunu anlat.",
      "Ailede yaşanan sorunların çoğu sevgisizlikten değil birikmiş yanlış anlaşılmalardan oluşur.\n\nBugün atabileceğin adım: bir kişiyi gerçekten dinlemeye odaklan.",
      "Yakın aile bağlarında küçük jestler büyük etki bırakır.\n\nBugün atabileceğin adım: değer verdiğin bir aile bireyine zaman ayır.",
      "Ailede düzenli ve sakin iletişim, ani tartışmalardan daha çok işe yarar.\n\nBugün atabileceğin adım: konuşmak için doğru zamanı seç."
    ],
    arkadaslik: [
      "Arkadaşlıkta kalite, sayıdan daha değerlidir. Seni yoran kalabalık yerine seni anlayan birkaç insan daha kıymetlidir.\n\nBugün atabileceğin adım: değer verdiğin bir arkadaşına içten mesaj at.",
      "İyi dostluk sadece eğlencede değil zor zamanda da görünür. İlişkiyi sözlerle değil tutarlılıkla değerlendir.\n\nBugün atabileceğin adım: sana iyi gelen çevreyi düşün.",
      "Sosyal çevren enerjini etkiler. Sürekli şikayet eden bir çevre seni de ağırlaştırabilir.\n\nBugün atabileceğin adım: daha faydalı insanlarla daha çok temas kur.",
      "Arkadaşlıkta küçük sadakat işaretleri büyük güven üretir.\n\nBugün atabileceğin adım: bir dostuna destek ol.",
      "Gerçek dostlukta görünmek değil, ihtiyaç anında yanında olmak önemlidir.\n\nBugün atabileceğin adım: samimi bir yoklama yap."
    ],
    yalnizlik: [
      "Yalnızlık her zaman insan eksikliği değil, anlamlı bağ eksikliğidir. Çok kişi içinde de yalnız hissedebilirsin.\n\nBugün atabileceğin adım: gerçek bağ kurabileceğin bir kişiye yaz.",
      "Yalnız hissettiğinde önce kendini yargılamayı bırak. Bu duygu utanılacak değil, anlaşılması gereken bir işarettir.\n\nBugün atabileceğin adım: seni neyin eksik hissettirdiğini yaz.",
      "Yalnızlık dönemleri bazen kendini yeniden kurmak için alan açar. Boşluğu sadece acı olarak görme.\n\nBugün atabileceğin adım: kendine iyi gelen bir aktivite planla.",
      "Derin bağ kurmak zaman ister; acele ilişki kurmak yerine doğru ilişki kurmak önemlidir.\n\nBugün atabileceğin adım: bir topluluk araştır.",
      "Kendiyle kaliteli vakit geçirmek yalnızlığı biraz daha yönetilebilir hale getirir.\n\nBugün atabileceğin adım: tek başına keyifli bir şey yap."
    ],
    cocuk: [
      "Çocuk bakımında en önemli şey kusursuzluk değil tutarlılıktır. Çocuklar çoğu zaman mükemmel plandan çok güvenli ve düzenli ilgiye ihtiyaç duyar.\n\nBugün atabileceğin adım: küçük bir oyun veya sakin zaman planla.",
      "Çocuklarla iletişimde açıklık ve sabır çok önemlidir. Sadece öğretmek değil, birlikte deneyim kurmak da gelişimi destekler.\n\nBugün atabileceğin adım: birlikte 15 dakikalık kaliteli zaman ayır.",
      "Ebeveynlikte yükü bir anda çözmeye çalışma. Küçük rutinler büyük rahatlık sağlar.\n\nBugün atabileceğin adım: uyku, yemek veya oyun için tek bir sabit düzen belirle.",
      "Çocuklar çoğu zaman söylenenden çok gördüğünü öğrenir.\n\nBugün atabileceğin adım: örnek olmak istediğin davranışı seç.",
      "Çocukla kurulan güven, günlük küçük temaslarla büyür.\n\nBugün atabileceğin adım: göz teması ve sakin iletişime odaklan."
    ],
    bakim: [
      "Kişisel bakımın amacı kusursuz görünmek değil, kendine düzenli değer vermektir. Az ama sürdürülebilir bir rutin en güçlü sonuçları verir.\n\nBugün atabileceğin adım: 3 maddelik basit bir bakım rutini yaz.",
      "Bakım konusunda pahalı ürünlerden önce düzen önemlidir. Temizlik, sadelik ve tutarlılık çoğu zaman yeterlidir.\n\nBugün atabileceğin adım: seni yormayan tek bir bakım alışkanlığı seç.",
      "Kendine özen göstermek sadece dış görünüş değil, özsaygı meselesidir.\n\nBugün atabileceğin adım: kendine ayıracağın kısa bir bakım zamanı belirle.",
      "Bakım rutini seni zorlamamalı; seni toparlamalı.\n\nBugün atabileceğin adım: gereksiz adımları azalt.",
      "Dış görünüşte küçük düzenli dokunuşlar büyük fark yaratabilir.\n\nBugün atabileceğin adım: en çok işe yarayan bakım adımını sabitle."
    ],
    saglik: [
      "Sağlıklı yaşam büyük değişimlerden çok düzenli küçük seçimlerle kurulur. Uyku, su, hareket ve beslenme temeli sağlam olursa enerji toparlanır.\n\nBugün atabileceğin adım: bir temel alışkanlığı iyileştir.",
      "Kendine çok yüklenmeden basit bir sağlık rutini kurmak en etkili yoldur. Az ama sürekli hareket daha değerlidir.\n\nBugün atabileceğin adım: 10 dakikalık yürüyüş yap.",
      "Beden iyi çalışmadığında zihin de dağılır. Sağlıklı yaşamı dış görünüş değil yaşam kalitesi olarak düşün.\n\nBugün atabileceğin adım: su ve uyku düzenine bak.",
      "Sağlık bir seferlik çabayla değil, tekrarlanan küçük seçimlerle korunur.\n\nBugün atabileceğin adım: tek bir sağlıklı tercih yap.",
      "Kendini iyi hissetmek çoğu zaman küçük düzenlemelerle başlar.\n\nBugün atabileceğin adım: gününe kısa hareket ekle."
    ],
    spor: [
      "Spora başlamak için mükemmel program gerekmez. Düzenli küçük hareket, plansız büyük hevesten daha değerlidir.\n\nBugün atabileceğin adım: kısa bir egzersiz yap.",
      "Antrenmanda sürdürülebilirlik yoğunluktan daha önemlidir. Seni bitiren değil devam ettiren sistem iyidir.\n\nBugün atabileceğin adım: haftalık mini plan çıkar.",
      "Sporu sadece görünüş için değil enerji ve zihinsel güç için de düşün.\n\nBugün atabileceğin adım: hareketten sonra nasıl hissettiğini not et.",
      "Küçük ama düzenli egzersiz, hiç yapmamaktan çok daha güçlüdür.\n\nBugün atabileceğin adım: 5 dakikalık başlangıç yap.",
      "Spor disiplini fiziksel olduğu kadar zihinseldir.\n\nBugün atabileceğin adım: sabit bir gün seç."
    ],
    beslenme: [
      "Beslenmede en güçlü değişim, bir anda her şeyi bozup yeniden kurmak değil, tek bir alışkanlığı düzeltmektir.\n\nBugün atabileceğin adım: tek bir öğünü iyileştir.",
      "Sağlıklı beslenme ceza gibi hissettirmemeli. Sürdürülebilir düzen geçici sıkılıktan daha etkilidir.\n\nBugün atabileceğin adım: su ve öğün dengesine bak.",
      "Yediklerin sadece bedenini değil enerjini ve odağını da etkiler.\n\nBugün atabileceğin adım: seni ağırlaştıran bir alışkanlığı azalt.",
      "Beslenmede denge, yasaktan daha güçlüdür.\n\nBugün atabileceğin adım: tek bir sağlıklı seçim ekle.",
      "Rutin hale gelen küçük tercihler büyük fark oluşturur.\n\nBugün atabileceğin adım: kahvaltı veya akşam öğününü düzenle."
    ],
    uyku: [
      "Uyku düzeni bozuksa performansın dağılması normaldir. Zihin iyi dinlenmeden net çalışamaz.\n\nBugün atabileceğin adım: sabit bir yatış saati belirle.",
      "Uykuyu sadece dinlenme değil zihinsel toparlanma olarak düşün.\n\nBugün atabileceğin adım: uyumadan önce ekranı azalt.",
      "Gece düzeni toparlanmadan sabah performansı artmaz.\n\nBugün atabileceğin adım: uyku öncesi kısa sakin rutin kur.",
      "Kaliteli uyku gün içindeki enerjinin temelidir.\n\nBugün atabileceğin adım: yatmadan önce zihnini sadeleştir.",
      "Uyku disiplini, sabah kalitesini belirler.\n\nBugün atabileceğin adım: aynı saatte uyanmayı dene."
    ],
    motivasyon: [
      "Motivasyon çoğu zaman bekleyince değil hareket edince gelir. Büyük hedefi düşünmek yerine çok küçük bir ilk adım seç.\n\nBugün atabileceğin adım: sadece 10 dakika başla.",
      "İsteksizlik her zaman tembellik değildir. Bazen mesele sistem eksikliğidir.\n\nBugün atabileceğin adım: yapacağın işi tek cümleyle tanımla.",
      "Kendini suçlamak yerine ritim kurmaya odaklan. Küçük ama tekrar eden hareketler daha kalıcıdır.\n\nBugün atabileceğin adım: yarın da yapabileceğin küçük bir görev seç.",
      "İlham beklemek yerine zinciri kıracak ilk hareketi seçmek daha güçlüdür.\n\nBugün atabileceğin adım: başlangıç süresi koy.",
      "Motivasyon dalgalı olabilir; sistem daha güvenilirdir.\n\nBugün atabileceğin adım: küçük bir düzen kur."
    ],
    disiplin: [
      "Disiplin, istemediğin günlerde de küçük doğru hareketi yapabilmektir. Tekrar eden küçük düzenler güç üretir.\n\nBugün atabileceğin adım: küçük bir rutin seç.",
      "Kendini bir anda değiştirmeye çalışma. Her gün aynı saatte yapılan küçük bir rutin karakteri güçlendirir.\n\nBugün atabileceğin adım: sabit saat belirle.",
      "Disiplini duyguya bağlarsan koparsın; saate ve sisteme bağlarsan büyürsün.\n\nBugün atabileceğin adım: en küçük sürdürülebilir görevi seç.",
      "Karakter çoğu zaman istemediğin anda yaptığın doğru hareketle oluşur.\n\nBugün atabileceğin adım: tek sözüne sadık kal.",
      "Büyük başarıların temeli çoğu zaman sıkıcı tekrarlar olur.\n\nBugün atabileceğin adım: aynı hareketi yeniden yap."
    ],
    aliskanlik: [
      "Alışkanlıklar karakterin sessiz inşasıdır. Her gün yaptığın şey kim olduğunu şekillendirir.\n\nBugün atabileceğin adım: tek alışkanlık seç.",
      "Kötü alışkanlığı bırakmak için sadece yasak koymak yetmez; yerine alternatif koymak gerekir.\n\nBugün atabileceğin adım: yerine koyacağın davranışı yaz.",
      "İyi alışkanlıklar küçük görünür ama uzun vadede büyük sonuç üretir.\n\nBugün atabileceğin adım: 2 dakikalık başlangıç kuralı uygula.",
      "Alışkanlık değişimi, kimlik değişiminin küçük halidir.\n\nBugün atabileceğin adım: kim olmak istediğini yaz.",
      "Düzenli tekrar zihni yormaz, rahatlatır.\n\nBugün atabileceğin adım: sabit başlangıç oluştur."
    ],
    odak: [
      "Odak sorunu çoğu zaman dikkat eksikliğinden değil, öncelik belirsizliğinden doğar. Tek hedef seçildiğinde zihin daha rahat çalışır.\n\nBugün atabileceğin adım: bir işi seç ve onu bitirmeden diğerine geçme.",
      "Aynı anda her şeyi yapmak verimli görünür ama derin sonuç vermez.\n\nBugün atabileceğin adım: 25 dakikalık tek odak seansı yap.",
      "Dikkatini korumak da üretimin parçasıdır. Seni bölen şeyleri azaltmadan yüksek kalite beklemek zordur.\n\nBugün atabileceğin adım: telefonu senden uzaklaştır.",
      "Zihni toparlamanın en iyi yolu yapılacak işi daraltmaktır.\n\nBugün atabileceğin adım: tek bir hedef yaz.",
      "Odak, hayır diyebilme gücüdür.\n\nBugün atabileceğin adım: bir dikkat dağıtıcıyı kaldır."
    ],
    uretkenlik: [
      "Üretkenlik, çok şey yapmak değil önemli şeyi bitirebilmektir.\n\nBugün atabileceğin adım: tek bir yüksek değerli işi bitir.",
      "Görev listesi uzadıkça zihin baskılanabilir. Az ama net öncelik daha güçlüdür.\n\nBugün atabileceğin adım: 3 ana iş belirle.",
      "Gerçek üretkenlik meşgul görünmekten değil sonuç çıkarmaktan gelir.\n\nBugün atabileceğin adım: gün sonunda ne üretmek istediğini yaz.",
      "Verimlilik için önce gereksiz yükü azaltmak gerekir.\n\nBugün atabileceğin adım: düşük değerli bir işi çıkar.",
      "Bitirmek, başlamak kadar değerlidir.\n\nBugün atabileceğin adım: yarım kalan bir işi kapat."
    ],
    zaman: [
      "Zaman yönetiminde en büyük sorun çoğu zaman zaman azlığı değil, öncelik dağınıklığıdır.\n\nBugün atabileceğin adım: en önemli işine saat ver.",
      "Meşgul olmak ile ilerlemek aynı şey değildir.\n\nBugün atabileceğin adım: 3 öncelik yaz.",
      "Zamanı daha iyi kullanmak için önce neye evet, neye hayır dediğini netleştirmelisin.\n\nBugün atabileceğin adım: gereksiz bir işi çıkar.",
      "Plan yapılmayan gün kolayca dağılır.\n\nBugün atabileceğin adım: yarını akşamdan planla.",
      "Takvime girmeyen hedef çoğu zaman ertelenir.\n\nBugün atabileceğin adım: küçük bir saat bloğu ayır."
    ],
    karar: [
      "Kararsızlık çoğu zaman seçenek fazlalığından doğar.\n\nBugün atabileceğin adım: seçenekleri 2’ye indir.",
      "Her kararın kusursuz olması gerekmez. Küçük deneme yapmak çoğu zaman daha öğreticidir.\n\nBugün atabileceğin adım: mini test yap.",
      "Yanlış karar korkusu bazen hareketsizlik üretir.\n\nBugün atabileceğin adım: ilk adımı seç.",
      "Netlik çoğu zaman düşünmekten çok denemekten doğar.\n\nBugün atabileceğin adım: düşük riskli karar ver.",
      "Karar verirken değerlerini bilmek süreci kolaylaştırır.\n\nBugün atabileceğin adım: senin için neyin önemli olduğunu yaz."
    ],
    para: [
      "Para konusunda ilk güç kontrolden gelir. Daha fazla kazanmak kadar mevcut paranın nereye gittiğini görmek de önemlidir.\n\nBugün atabileceğin adım: gün içindeki harcamalarını not et.",
      "Kazanç artırmak istiyorsan sadece daha çok çalışmayı değil, daha değerli iş üretmeyi düşün.\n\nBugün atabileceğin adım: para kazanabileceğin 1 becerini yaz.",
      "Birikim kısa vadede küçük görünür ama uzun vadede özgürlük sağlar.\n\nBugün atabileceğin adım: küçük tasarruf hedefi belirle.",
      "Para yönetimi, gelir kadar psikoloji meselesidir.\n\nBugün atabileceğin adım: harcama tetikleyicilerini fark et.",
      "Küçük finansal disiplin büyük rahatlık getirir.\n\nBugün atabileceğin adım: haftalık bütçe taslağı yap."
    ],
    is: [
      "İş hayatında fark, sadece çok çalışmakla değil sorun çözmekle oluşur.\n\nBugün atabileceğin adım: çözebileceğin tek bir problemi seç.",
      "İş yerinde çoğu sorun iletişim eksikliğinden büyür.\n\nBugün atabileceğin adım: iş akışında netleştireceğin tek noktayı belirle.",
      "Profesyonellik bazen en çok sakin, anlaşılır ve zamanında iletişim kurabilmektir.\n\nBugün atabileceğin adım: bir mesajı daha net yaz.",
      "İşte güven veren insan olmak görünenden daha değerlidir.\n\nBugün atabileceğin adım: verdiğin sözü takip et.",
      "Çalışma hayatında görünür katkı seni öne çıkarır.\n\nBugün atabileceğin adım: katkı sunduğun alanı yaz."
    ],
    kariyer: [
      "Kariyerini büyütmek istiyorsan görünür değer üretmelisin.\n\nBugün atabileceğin adım: güçlü olduğun 3 yönü yaz.",
      "İş görüşmesi veya kariyer değişiminde önce netlik gerekir.\n\nBugün atabileceğin adım: sana uygun iş tarzını yaz.",
      "Belirli bir alanda derinleşmek seni daha hatırlanır yapar.\n\nBugün atabileceğin adım: derinleşeceğin tek alan seç.",
      "Kariyer sadece unvan değil, yaşam yönüdür.\n\nBugün atabileceğin adım: uzun vadeli hedefini düşün.",
      "Güçlü kariyer görünür beceri ister.\n\nBugün atabileceğin adım: portföyüne ekleyeceğin şeyi belirle."
    ],
    girisim: [
      "Girişimde iyi fikir, gerçek problemi çözen fikirdir.\n\nBugün atabileceğin adım: çözmek istediğin problemi yaz.",
      "Büyük sistem kurmadan önce küçük doğrulama yapmak gerekir.\n\nBugün atabileceğin adım: fikrini birine anlat.",
      "Girişimde hız önemlidir ama yön daha önemlidir.\n\nBugün atabileceğin adım: müşteriyi düşün.",
      "İnsanların gerçekten para vereceği şeyi anlamak kritik farktır.\n\nBugün atabileceğin adım: hedef kitle yaz.",
      "İyi girişim büyük görünmeden önce faydalı olur.\n\nBugün atabileceğin adım: mini teklif oluştur."
    ],
    yazilim: [
      "Yazılım öğrenmenin en hızlı yolu küçük proje yapmaktır.\n\nBugün atabileceğin adım: tek bir küçük özellik kodla.",
      "Kod yazarken hata almak gelişimin doğal parçasıdır.\n\nBugün atabileceğin adım: son hatanı not edip çözümünü araştır.",
      "Yazılımda ilerlemek için süreklilik çok önemlidir.\n\nBugün atabileceğin adım: GitHub'a minicik de olsa bir commit at.",
      "Teori ile pratiği aynı gün içinde birleştirmek gelişimi hızlandırır.\n\nBugün atabileceğin adım: izlediğin şeyi uygula.",
      "Küçük çalışan sistemler, büyük hayallerin temelidir.\n\nBugün atabileceğin adım: mini proje seç."
    ],
    sosyalmedya: [
      "Sosyal medyada büyüme düzenli değer üretmekle olur.\n\nBugün atabileceğin adım: tek bir faydalı içerik fikri yaz.",
      "İçerik üretirken kusursuz görünmeye çalışmak seni yavaşlatır.\n\nBugün atabileceğin adım: paylaşılabilir bir içerik hazırla.",
      "Marka sadece görsel değil; tekrar eden tonunla da oluşur.\n\nBugün atabileceğin adım: içerik tonunu belirle.",
      "Takipçi değil güven biriktirmek uzun vadede daha değerlidir.\n\nBugün atabileceğin adım: tek bir soruna çözüm anlat.",
      "Düzenli görünmek, ara sıra parlamaktan daha etkilidir.\n\nBugün atabileceğin adım: yayın takvimi düşün."
    ],
    icerik: [
      "İçerik üretiminde önce değer, sonra görünürlük gelir.\n\nBugün atabileceğin adım: tek bir probleme çözüm anlat.",
      "Sürekli ilham beklemek üretimi yavaşlatır. Şablon kurmak daha etkilidir.\n\nBugün atabileceğin adım: 3 içerik başlığı yaz.",
      "İçerik üretirken mükemmel olmaya değil anlaşılır olmaya odaklan.\n\nBugün atabileceğin adım: bir fikri sadeleştir.",
      "İyi içerik dikkat çekmekten önce bağ kurar.\n\nBugün atabileceğin adım: hedef kitlene soru sor.",
      "Tekrarlanan tema içerikte marka oluşturur.\n\nBugün atabileceğin adım: bir seri fikri belirle."
    ],
    marka: [
      "Marka, sadece logo değil; verdiğin his ve çözdüğün problemle oluşur.\n\nBugün atabileceğin adım: markanın temsil ettiği şeyi yaz.",
      "Kişisel marka inşa ederken önce ne değer sunduğun net olmalı.\n\nBugün atabileceğin adım: faydanı tek cümleyle yaz.",
      "Güçlü marka, tutarlılıkla oluşur.\n\nBugün atabileceğin adım: sabit içerik tarzı belirle.",
      "İnsanlar markayı gördüğünde bir duygu hissetmelidir.\n\nBugün atabileceğin adım: hissettirmek istediğin şeyi yaz.",
      "Marka inşası görünürlük kadar tekrar ister.\n\nBugün atabileceğin adım: aynı tonda devam et."
    ],
    egitim: [
      "Eğitimde asıl fark, bilgiyi biriktirmek değil kullanabilmektir.\n\nBugün atabileceğin adım: 3 maddelik kısa özet çıkar.",
      "Az ama sürekli sistem, bir anda yüklenmekten daha verimlidir.\n\nBugün atabileceğin adım: 25 dakikalık çalışma bloğu yap.",
      "Bir konuyu anlamak istiyorsan onu sadeleştirip kendi cümlelerinle kur.\n\nBugün atabileceğin adım: zor konuyu basitleştir.",
      "Öğrenme, üretimle güçlenir.\n\nBugün atabileceğin adım: mini uygulama yap.",
      "Bilgi tekrarlanmadığında kolay dağılır.\n\nBugün atabileceğin adım: kısa tekrar planı yap."
    ],
    sinav: [
      "Sınav sürecinde sadece çok çalışmak yetmez; doğru tekrar ve düzen gerekir.\n\nBugün atabileceğin adım: zayıf olduğun bir konuyu seç.",
      "Sınav kaygısını azaltmanın yolu kontrol edebildiğin parçaya odaklanmaktır.\n\nBugün atabileceğin adım: bugünkü hedefini net yaz.",
      "Uzun çalışma yerine kaliteli bloklar daha etkilidir.\n\nBugün atabileceğin adım: süre tutarak kısa çalışma seansı yap.",
      "Deneme sonucu moral bozmak için değil yön görmek içindir.\n\nBugün atabileceğin adım: hataları incele.",
      "Sınav başarısı tempo kadar psikoloji de ister.\n\nBugün atabileceğin adım: bir baskı kaynağını azalt."
    ],
    universite: [
      "Üniversite sadece ders değil, yön arama ve çevre kurma alanıdır.\n\nBugün atabileceğin adım: geliştirmek istediğin tek alanı belirle.",
      "Her şeyin hemen net olması gerekmez. Deneyim yönü zamanla açar.\n\nBugün atabileceğin adım: ilgini çeken alanları yaz.",
      "Kampüs hayatında görünür olmak fırsat doğurabilir.\n\nBugün atabileceğin adım: yeni bir topluluk araştır.",
      "Üniversite dönemi aynı zamanda kendini tanıma dönemidir.\n\nBugün atabileceğin adım: güçlü yönlerini yaz.",
      "Bölüm dışında geliştirdiğin beceriler de seni büyütür.\n\nBugün atabileceğin adım: ek beceri seç."
    ],
    kitap: [
      "Okuma alışkanlığında önemli olan çok okumak değil, düzenli okumaktır.\n\nBugün atabileceğin adım: 10 sayfa oku.",
      "Bir kitaptan asıl fayda ana fikrini çıkarabilmektir.\n\nBugün atabileceğin adım: tek cümlelik özet yaz.",
      "Kitabı tüketmek yerine ondan bir cümleyi hayata geçirmek daha değerlidir.\n\nBugün atabileceğin adım: bir fikri uygula.",
      "Okuma kalitesi, seçilen kitapla da ilgilidir.\n\nBugün atabileceğin adım: okuyacağın kitabı bilinçli seç.",
      "Küçük notlar büyük fark yaratır.\n\nBugün atabileceğin adım: bir anahtar cümleyi kaydet."
    ],
    iletisim: [
      "İletişimde en güçlü beceri doğru tonla ve doğru zamanda konuşabilmektir.\n\nBugün atabileceğin adım: kısa ve net cümle kur.",
      "Çoğu yanlış anlaşılma niyetten değil ifade biçiminden doğar.\n\nBugün atabileceğin adım: ima yerine açık konuş.",
      "Anlaşılmak istiyorsan önce seni neyin rahatsız ettiğini fark etmelisin.\n\nBugün atabileceğin adım: hissettiğini adlandır.",
      "İletişim sadece konuşmak değil, doğru dinleyebilmektir.\n\nBugün atabileceğin adım: birini gerçekten dinle.",
      "Basit cümleler çoğu zaman en güçlü etkiyi bırakır.\n\nBugün atabileceğin adım: cümleni sadeleştir."
    ],
    ozguven: [
      "Özgüven, kusursuz hissetmek değil; eksik olsan bile hareket edebilmektir.\n\nBugün atabileceğin adım: seni geren küçük bir adım at.",
      "Sağlam özgüven iç netlikten doğar.\n\nBugün atabileceğin adım: güçlü yanlarını yaz.",
      "Özgüveni artırmanın en pratik yolu küçük kanıtlar biriktirmektir.\n\nBugün atabileceğin adım: tamamlayacağın tek bir iş seç.",
      "Kendini küçümsemek tevazu değildir; netlik kaybıdır.\n\nBugün atabileceğin adım: yaptığın iyi bir şeyi hatırla.",
      "Cesaret, korkusuz olmak değil korkuya rağmen hareket etmektir.\n\nBugün atabileceğin adım: küçük cesaret göster."
    ],
    stres: [
      "Stres yükseldiğinde önce her şeyi çözmeye çalışma.\n\nBugün atabileceğin adım: kontrol alanını yaz.",
      "Bazen sorun çözüm eksikliği değil, aşırı yüklenmiş zihindir.\n\nBugün atabileceğin adım: kısa nefes molası ver.",
      "Stresi azaltmanın yolu mükemmel plan değil, küçük kontrol alanları oluşturmaktır.\n\nBugün atabileceğin adım: tek bir sonraki adımı belirle.",
      "Zihni sadeleştirmek baskıyı azaltır.\n\nBugün atabileceğin adım: bir yükü geçici olarak bırak.",
      "Her kaygı hemen çözülmek zorunda değildir.\n\nBugün atabileceğin adım: dinlenmeye izin ver."
    ],
    hayat: [
      "Hayatta netlik çoğu zaman başlamadan önce değil, yürürken gelir.\n\nBugün atabileceğin adım: bir küçük karar ver.",
      "Her şeyi aynı anda düzeltmek yerine seni en çok zorlayan alanı seç.\n\nBugün atabileceğin adım: en önemli alanı belirle.",
      "Hayatını sadeleştirmek bazen yeni şey eklemekten daha güçlüdür.\n\nBugün atabileceğin adım: bir gereksiz yükü bırak.",
      "Hayat yönü bazen tek bir dürüst soruyla açılır.\n\nBugün atabileceğin adım: ne istediğini yaz.",
      "Yavaş ilerlemek, ilerlememek değildir.\n\nBugün atabileceğin adım: küçük ama net adım seç."
    ],
    evduzeni: [
      "Ev düzeninde amaç kusursuzluk değil, akışı kolaylaştırmaktır.\n\nBugün atabileceğin adım: küçük bir alan düzenle.",
      "Her şeyi bir anda toplamak yerine alan alan gitmek daha gerçekçidir.\n\nBugün atabileceğin adım: sadece bir çekmeceyi toparla.",
      "Dıştaki dağınıklık çoğu zaman iç yükü artırır.\n\nBugün atabileceğin adım: fazlalıkları ayır.",
      "Sade alanlar zihinsel ferahlık da sağlar.\n\nBugün atabileceğin adım: görünür bir yeri sadeleştir.",
      "Düzen, estetikten önce işlevdir.\n\nBugün atabileceğin adım: bir alanın kullanımını kolaylaştır."
    ],
    hobi: [
      "Hobi seçerken en önemli şey yetenek değil merak ve sürdürülebilirliktir.\n\nBugün atabileceğin adım: 15 dakikalık deneme yap.",
      "Boş zamanını sadece tüketimle doldurmak yerine küçük üretim alanı açmak zihni dinlendirir.\n\nBugün atabileceğin adım: ilgini çeken bir şeyi dene.",
      "Hobiler hayat kalitesini ciddi biçimde artıran alanlardır.\n\nBugün atabileceğin adım: keyif aldığın şeyi yaz.",
      "Yeni hobi, yeni enerji üretir.\n\nBugün atabileceğin adım: uzun zamandır merak ettiğin şeyi dene.",
      "Hobi alanı baskısız gelişim alanıdır.\n\nBugün atabileceğin adım: sonucu düşünmeden başla."
    ],
    yaraticilik: [
      "Yaratıcılık ilham beklemekle değil üretim alanı açmakla güçlenir.\n\nBugün atabileceğin adım: 10 fikri filtrelemeden yaz.",
      "İyi fikirler çoğu zaman tekrar düşününce gelir.\n\nBugün atabileceğin adım: tek bir fikri geliştir.",
      "Yaratıcılık için kusursuzluk baskısını azaltmak gerekir.\n\nBugün atabileceğin adım: kötü olmasına izin vererek başla.",
      "Zihne malzeme girmezse yaratım zorlaşır.\n\nBugün atabileceğin adım: ilham veren bir şey izle/oku.",
      "Yaratıcı süreçte tekrar da üretimin parçasıdır.\n\nBugün atabileceğin adım: eski fikri yeniden ele al."
    ],
    liderlik: [
      "Liderlik önde görünmek değil, zor anda sorumluluk alabilmektir.\n\nBugün atabileceğin adım: netleştirebileceğin tek konuyu açıklığa kavuştur.",
      "İyi liderlik talimat dağıtmaktan çok netlik ve güven üretmektir.\n\nBugün atabileceğin adım: açık bir çerçeve ver.",
      "İnsanlar yön kadar sakinlik ve tutarlılık da ister.\n\nBugün atabileceğin adım: verdiğin sözleri gözden geçir.",
      "Liderlikte örnek olmak, konuşmaktan daha güçlüdür.\n\nBugün atabileceğin adım: davranışınla yön göster.",
      "Güven kurmadan uzun vadeli etki zorlaşır.\n\nBugün atabileceğin adım: ekibinle açık iletişim kur."
    ],
    dijital: [
      "Dijital yaşamı yönetmek, zamanı ve dikkati yönetmenin parçasıdır.\n\nBugün atabileceğin adım: ekran süreni azaltacak tek ayar yap.",
      "Telefon ve internet faydalı araç olabilir ama kontrol sende kalmalı.\n\nBugün atabileceğin adım: bildirimleri sadeleştir.",
      "Dijital düzen kurulmadan odak ve üretkenlik zorlaşır.\n\nBugün atabileceğin adım: gereksiz bir uygulamayı kapat.",
      "Sürekli dijital uyarı almak zihni yorabilir.\n\nBugün atabileceğin adım: sessiz zaman bloğu oluştur.",
      "Dijital hayat sadeleşince gerçek hayat güçlenir.\n\nBugün atabileceğin adım: uygulama temizliği yap."
    ],
    genel: [
      "Bu konuda en güçlü başlangıç netliktir. Her şeyi aynı anda çözmeye çalışma.\n\nBugün atabileceğin adım: çözmek istediğin şeyi tek cümleyle yaz.",
      "Kararsız kaldığında küçük bir deneme yapmak uzun düşünceden daha faydalıdır.\n\nBugün atabileceğin adım: küçük bir ilk adım belirle.",
      "Büyük değişimler çoğu zaman küçük ama dürüst başlangıçlarla gelir.\n\nBugün atabileceğin adım: bugün yapabileceğin en küçük doğru hareketi seç.",
      "Her şeyi aynı anda düzeltmek yerine bir yeri iyileştirmen bile güç üretir.\n\nBugün atabileceğin adım: tek bir hedef seç.",
      "Net soru, daha güçlü fikir üretir.\n\nBugün atabileceğin adım: sorunu sadeleştir."
    ]
  };

  const selected = shuffle(ideas[category] || ideas.genel).slice(0, 3);

  return selected.map((idea) => ({
    intro: pick(intros),
    body: idea,
    note: pick(notes)
  }));
}

function formatThreeIdeas(items) {
  return items
    .map((item, index) => {
      return `FİKİR ${index + 1}\n\n${item.intro}\n\n${item.body}\n\nFİKRÂ notu: ${item.note}`;
    })
    .join("\n\n────────────\n\n");
}
