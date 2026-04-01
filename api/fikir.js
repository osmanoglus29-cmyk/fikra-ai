export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ fikir: "Sadece POST" });
  }

  const { mesaj } = req.body || {};
  const konu = String(mesaj || "").toLowerCase().trim();

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  let baslik = "FİKRÂ öneriyor";
  let giris = "";
  let anaFikir = "";
  let adim = "";

  if (konu.includes("aşk") || konu.includes("sevgi") || konu.includes("ilişki")) {
    baslik = "Aşk konusunda fikir";
    giris = pick([
      "Aşk konusunda en büyük hata, duyguyu netliğin önüne koymaktır.",
      "İlişkilerde çoğu sorun sevgisizlikten değil, belirsizlikten doğar.",
      "Aşkta güçlü bağ kurmak için önce duyguyu değil dengeyi korumak gerekir."
    ]);
    anaFikir = pick([
      "Karşındaki insanın sözlerinden çok davranışlarına bak. Seni gerçekten isteyen biri, ilgisini tutarlı şekilde gösterir.",
      "Kendi duygunu netleştirmeden doğru ilişkiyi kurmak zordur. Önce ne istediğini, neyi istemediğini bil.",
      "Sağlıklı bir ilişki seni sürekli yormaz; seni güvende, görülmüş ve anlaşılmış hissettirir."
    ]);
    adim = pick([
      "Bugün yapacağın en iyi şey, duygularını bir kağıda yazmak: ne hissediyorsun, ne bekliyorsun, ne seni yoruyor?",
      "Bugün küçük ama net bir iletişim kur: imalı konuşmak yerine duygunu sade bir cümleyle ifade et.",
      "Bugün ilişkiyi değil, kendi sınırlarını düşün: neleri kabul edersin, neleri etmezsin?"
    ]);
  }

  else if (konu.includes("para") || konu.includes("kazanç") || konu.includes("iş")) {
    baslik = "Para konusunda fikir";
    giris = pick([
      "Para konusunda güç sadece kazançtan değil, kontrolden gelir.",
      "Çoğu insan daha fazla para ister ama önce mevcut akışı yönetmeyi unutuyor.",
      "Kazanç artmadan önce finansal farkındalık artmalı."
    ]);
    anaFikir = pick([
      "Gelirini büyütmek istiyorsan önce paran nereye gidiyor onu gör. Kontrol edilmeyen para büyümez.",
      "Ek gelir için sıfırdan büyük iş kurmak zorunda değilsin; küçük hizmet, dijital ürün ya da freelance iş bile başlangıç olabilir.",
      "Parayı kazanmak kadar elde tutmak da beceridir. Harcama alışkanlıkları düzelmeden büyüme zayıf kalır."
    ]);
    adim = pick([
      "Bugün tüm harcamalarını tek tek not etmeye başla. Bu basit hareket bile bakış açını değiştirir.",
      "Bugün gelir üretebileceğin tek bir becerini yaz ve onu nasıl satabileceğini düşün.",
      "Bugün küçük bir bütçe kuralı koy: gereksiz harcamaları bir hafta boyunca takip et."
    ]);
  }

  else if (konu.includes("yazılım") || konu.includes("kod") || konu.includes("programlama")) {
    baslik = "Yazılım konusunda fikir";
    giris = pick([
      "Yazılım öğrenirken çoğu kişi bilgiyi biriktirir ama üretimi geciktirir.",
      "Kod dünyasında asıl gelişim izlerken değil, yaparken başlar.",
      "Yazılımda hız, doğru kaynak kadar doğru pratikten gelir."
    ]);
    anaFikir = pick([
      "Sürekli ders izlemek yerine küçük bir proje seç. Gerçek öğrenme, hata çözdüğün anda başlar.",
      "Kod yazarken hata almak kötü değil, gelişimin doğal parçasıdır. Hata sana nerede düşünmen gerektiğini gösterir.",
      "Kendini başkalarıyla değil, dün yaptığın işle kıyasla. Küçük ama sürekli üretim seni hızlandırır."
    ]);
    adim = pick([
      "Bugün sadece 1 küçük özellik kodla. Büyük proje düşünme, tek parça üret.",
      "Bugün GitHub'a minicik de olsa bir commit at. Süreklilik seni geliştirir.",
      "Bugün izlediğin konudan hemen sonra 15 dakikalık mini uygulama yap."
    ]);
  }

  else if (konu.includes("motivasyon") || konu.includes("istek") || konu.includes("başlamak")) {
    baslik = "Motivasyon konusunda fikir";
    giris = pick([
      "Motivasyon çoğu zaman bekleyince gelmez, hareket edince gelir.",
      "İsteksizlik her zaman tembellik değildir; bazen sadece sistem eksikliğidir.",
      "Başlamak için yüksek enerji değil, küçük bir ilk adım gerekir."
    ]);
    anaFikir = pick([
      "Kendine büyük hedef yüklemek yerine çok küçük bir başlangıç belirle. Devamı çoğu zaman o ilk hareketten doğar.",
      "Motivasyon dalgalıdır; bu yüzden hislerine değil düzenine güvenmek daha güçlüdür.",
      "Sürekli yeniden gaz aramak yerine seni düşük enerjide de çalıştıracak bir sistem kur."
    ]);
    adim = pick([
      "Bugün sadece 10 dakika boyunca yapmak istediğin işe başla.",
      "Bugün büyük hedefi bir cümleyle küçült: şimdi sadece ilk parçayı yap.",
      "Bugün kendini suçlamak yerine küçük bir hareketle zinciri yeniden başlat."
    ]);
  }

  else if (konu.includes("odak") || konu.includes("dikkat") || konu.includes("konsantrasyon")) {
    baslik = "Odak konusunda fikir";
    giris = pick([
      "Odak sorunu çoğu zaman dikkat eksikliği değil, öncelik belirsizliğidir.",
      "Zihin aynı anda her şeyi tutmaya çalıştığında derinlik kaybolur.",
      "Odak, sadece çalışmak değil, dikkatini koruyabilmektir."
    ]);
    anaFikir = pick([
      "Tek bir işe yönelmeden güçlü sonuç almak zorlaşır. Dağınıklık enerjiyi küçük küçük tüketir.",
      "Dikkatini korumak istiyorsan önce seni bölen şeyleri azalt. Telefon, sekmeler ve gereksiz bildirimler gerçek hızını düşürür.",
      "Bir işi bitirmeden diğerine geçmek zihinsel yükü artırır. Tamamlama alışkanlığı odak üretir."
    ]);
    adim = pick([
      "Bugün 25 dakikalık tek odak seansı yap ve o sürede sadece bir işle ilgilen.",
      "Bugün çalışırken telefonu senden uzağa koy.",
      "Bugün yapacağın işleri 3’e indir ve önce en önemli olanı bitir."
    ]);
  }

  else if (konu.includes("disiplin") || konu.includes("rutin") || konu.includes("alışkanlık")) {
    baslik = "Disiplin konusunda fikir";
    giris = pick([
      "Disiplin, istemediğin günlerde de küçük doğru hareketi yapabilmektir.",
      "Rutin, zor günlerde seni taşıyan görünmez destektir.",
      "Disiplin sertlik değil, kendine verdiğin sözü koruyabilmektir."
    ]);
    anaFikir = pick([
      "Büyük hedefler yerine tekrarlanabilir küçük düzenler kur. Çünkü sürdürülen küçük şeyler, unutulan büyük planlardan daha güçlüdür.",
      "Kendini bir anda değiştirmeye çalışma. Her gün aynı saatte yapılan küçük bir hareket büyük fark yaratır.",
      "Disiplini motivasyona bağlarsan koparsın; saate ve sisteme bağlarsan güçlenirsin."
    ]);
    adim = pick([
      "Bugün yarın da yapabileceğin kadar küçük bir rutin belirle.",
      "Bugün sadece bir alışkanlığı aynı saatte tekrar et.",
      "Bugün kendine verdiğin tek bir sözü tut ve onu günün kazancı say."
    ]);
  }

  else {
    baslik = "Genel fikir";
    giris = pick([
      "Bazen insan tam olarak ne istediğini bilmeden yön arar.",
      "Netlik çoğu zaman uzun düşünceden değil, küçük hareketten doğar.",
      "Bir konuda sıkıştığında ilk çözüm mükemmel cevap değil, doğru soru olur."
    ]);
    anaFikir = pick([
      "Her şeyi aynı anda çözmeye çalışma. Tek bir konu seçmek bile zihnini rahatlatır ve ilerleme hissi oluşturur.",
      "Küçük bir deneme yapmak, uzun süre kararsız kalmaktan daha öğreticidir.",
      "Asıl farkı büyük planlar değil, küçük ama tekrar eden doğru hareketler oluşturur."
    ]);
    adim = pick([
      "Bugün seni en çok zorlayan konuyu tek cümlede yaz.",
      "Bugün çözmek istediğin şeyi bir parçaya böl ve sadece ilk kısmı yap.",
      "Bugün neyi bırakman gerektiğini de düşün; bazen ilerleme eklemekle değil azaltmakla olur."
    ]);
  }

  const fikir =
`${baslik}

${giris}

${anaFikir}

Bugün atabileceğin adım:
${adim}`;

  return res.status(200).json({ fikir });
}
