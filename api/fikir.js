export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ fikir: "Sadece POST" });
  }

  const { mesaj } = req.body;

  const konu = mesaj.toLowerCase();

  let fikir = "";

  // AŞK
  if (konu.includes("aşk")) {
    const list = [
      "Sevdiğin kişiye beklenmedik küçük sürprizler yap.",
      "Duygularını açıkça ifade ettiğin bir mesaj yaz.",
      "Birlikte yeni bir aktivite deneyin.",
      "Anılarınızı yazıya dök ve paylaş.",
      "Her gün küçük bir iltifat et."
    ];
    fikir = list[Math.floor(Math.random() * list.length)];
  }

  // PARA
  else if (konu.includes("para") || konu.includes("iş")) {
    const list = [
      "Freelance işlere başla (Fiverr, Bionluk).",
      "Bir skill öğrenip online sat.",
      "Küçük bir e-ticaret ürünü dene.",
      "Instagram sayfası büyütüp satış yap.",
      "Dijital ürün oluştur (ebook, tasarım)."
    ];
    fikir = list[Math.floor(Math.random() * list.length)];
  }

  // YAZILIM
  else if (konu.includes("yazılım") || konu.includes("kod")) {
    const list = [
      "Her gün 1 küçük proje yap.",
      "Frontend + backend mini uygulama geliştir.",
      "GitHub'a düzenli proje yükle.",
      "Gerçek bir problem çözmeye odaklan.",
      "UI/UX öğrenerek fark yarat."
    ];
    fikir = list[Math.floor(Math.random() * list.length)];
  }

  // GENEL AI
  else {
    const list = [
      `${mesaj} konusunda küçük bir proje başlat.`,
      `${mesaj} ile ilgili insanlara fayda sağlayacak bir içerik üret.`,
      `${mesaj} alanında farklı bir bakış açısı geliştir.`,
      `${mesaj} hakkında günlük alışkanlık oluştur.`,
      `${mesaj} ile ilgili öğrendiklerini paylaş.`
    ];
    fikir = list[Math.floor(Math.random() * list.length)];
  }

  return res.status(200).json({ fikir });
}
