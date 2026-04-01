export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ fikir: "Sadece POST isteği kabul edilir." });
  }

  try {
    const body = req.body || {};
    const mesaj = String(body.mesaj || "").trim();

    if (!mesaj) {
      return res.status(400).json({ fikir: "Lütfen bir konu yaz." });
    }

    const text = mesaj.toLocaleLowerCase("tr-TR");

    const unsafeWords = [
      "intihar",
      "kendime zarar",
      "öldür",
      "bomba",
      "silah yap",
      "zehir",
      "uyuşturucu üret",
      "hackleme",
      "dolandırıcılık"
    ];

    for (const word of unsafeWords) {
      if (text.includes(word)) {
        return res.status(200).json({
          fikir:
            "FİKRÂ bu konuda fikir veremez.\n\nYazdığın konu tehlikeli, zarar verici ya da güvenlik açısından riskli görünüyor.\n\nİstersen bunun yerine güvenli ve yapıcı bir alternatif düşünebiliriz."
        });
      }
    }

    let fikir = "";

    if (text.includes("aşk") || text.includes("sevgi") || text.includes("ilişki")) {
      const list = [
        "Aşk konusunda en önemli şey netliktir.\n\nKarşındaki kişinin sözlerinden çok davranışlarına bak. Seni gerçekten isteyen insan ilgisini tutarlı şekilde gösterir.\n\nBugün atabileceğin adım: duygunu ve beklentini kendine dürüstçe yaz.",
        "İlişkilerde güçlü bağ sadece hisle değil iletişimle kurulur.\n\nBelirsizlik uzadıkça yorgunluk artar. Bu yüzden ima yerine sade ve açık konuşmak daha sağlıklıdır.\n\nBugün atabileceğin adım: duygunu tek cümleyle netleştir.",
        "Sağlıklı bir ilişki seni sürekli yormaz.\n\nGüvende, anlaşılmış ve değer görmüş hissettiğin bağ daha kıymetlidir.\n\nBugün atabileceğin adım: seni yoran ve iyi gelen şeyleri iki ayrı listeye yaz."
      ];
      fikir = pick(list);
    } else if (
      text.includes("para") ||
      text.includes("kazanç") ||
      text.includes("bütçe") ||
      text.includes("yatırım")
    ) {
      const list = [
        "Para konusunda ilk güç kontrolle başlar.\n\nDaha fazla kazanmak kadar mevcut paranın nereye gittiğini görmek de önemlidir.\n\nBugün atabileceğin adım: gün içindeki tüm harcamalarını not et.",
        "Kazanç artırmak istiyorsan sadece daha çok çalışmayı değil, daha değerli iş üretmeyi düşün.\n\nKüçük ama satılabilir bir beceri uzun vadede güçlü sonuç verir.\n\nBugün atabileceğin adım: para kazanabileceğin 1 becerini yaz.",
        "Birikim kısa vadede küçük görünür ama uzun vadede özgürlük sağlar.\n\nAsıl mesele büyük para değil, sürdürülebilir düzen kurmaktır.\n\nBugün atabileceğin adım: küçük bir tasarruf hedefi belirle."
      ];
      fikir = pick(list);
    } else if (
      text.includes("yazılım") ||
      text.includes("kod") ||
      text.includes("programlama") ||
      text.includes("web")
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
