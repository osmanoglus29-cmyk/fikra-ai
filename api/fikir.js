export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ fikir: "Sadece POST isteği kabul edilir." });
  }

  try {
    const mesaj = String(req.body?.mesaj || "").trim();

    if (!mesaj) {
      return res.status(400).json({ fikir: "Lütfen bir konu yaz." });
    }

    const text = mesaj.toLocaleLowerCase("tr-TR");

    const unsafeWords = [
      "intihar",
      "kendime zarar",
      "kendimi öldür",
      "öldür",
      "yarala",
      "bomba",
      "silah yap",
      "zehir",
      "uyuşturucu",
      "hackleme",
      "dolandırıcılık",
      "patlayıcı"
    ];

    if (unsafeWords.some((w) => text.includes(w))) {
      return res.status(200).json({
        fikir:
          "FİKRÂ bu konuda fikir veremez.\n\nBu konu tehlikeli, zarar verici ya da güvenlik açısından riskli görünüyor.\n\nİstersen bunun yerine güvenli ve yapıcı bir alternatif düşünebiliriz."
      });
    }

    const prompt = `
Sen FİKRÂ adında güçlü bir yapay fikir asistanısın.

Kurallar:
- Türkçe yaz.
- Kullanıcının konusuna göre 3 farklı fikir üret.
- Fikirler yaratıcı, uygulanabilir ve dolu olsun.
- Gereksiz uzatma yapma ama kısa da kesme.
- Her fikir ayrı başlıkla başlasın.
- En sonda kısa bir "FİKRÂ notu" ekle.

Cevap formatı tam olarak şöyle olsun:

FİKİR 1
...

────────────

FİKİR 2
...

────────────

FİKİR 3
...

FİKRÂ notu: ...

Kullanıcı isteği:
${mesaj}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("GEMINI RESPONSE:", JSON.stringify(data));

    if (!response.ok) {
      return res.status(response.status).json({
        fikir: data?.error?.message || "Gemini model hatası oluştu."
      });
    }

    const fikir =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Şu anda fikir üretilemedi. Lütfen tekrar dene.";

    return res.status(200).json({ fikir });
  } catch (error) {
    console.log("SERVER ERROR:", error);
    return res.status(500).json({ fikir: "Sunucu hatası oluştu." });
  }
}
