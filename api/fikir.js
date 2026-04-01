export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ fikir: "Sadece POST isteği kabul edilir." });
  }

  try {
    const mesaj = String(req.body?.mesaj || "").trim();

    if (!mesaj) {
      return res.status(400).json({ fikir: "Lütfen bir konu yaz." });
    }

    const text = mesaj.toLowerCase();

    // 🔒 Güvenlik filtresi
    const unsafeWords = [
      "intihar","kendime zarar","öldür","bomba","silah",
      "uyuşturucu","hackleme","dolandırıcılık","zehir"
    ];

    if (unsafeWords.some(w => text.includes(w))) {
      return res.status(200).json({
        fikir: "FİKRÂ bu konuda fikir veremez.\n\nBu konu tehlikeli veya zararlı olabilir.\n\nİstersen başka bir konuda yardımcı olabilirim."
      });
    }

    // 🧠 Gemini prompt
    const prompt = `
Sen FİKRÂ adında güçlü bir yapay fikir asistanısın.

Kurallar:
- Türkçe yaz
- 3 farklı fikir üret
- fikirler uzun, açıklamalı ve uygulanabilir olsun
- her fikir başlık ile başlasın
- yaratıcı ol
- tekrar etme
- en sonda kısa "FİKRÂ notu" yaz

Format:

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

    // 🔥 DOĞRU MODEL BURADA
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    if (!response.ok) {
      console.log("GEMINI ERROR:", data);
      return res.status(500).json({
        fikir: "AI hata verdi. Anahtar veya model kontrol et."
      });
    }

    const fikir =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Şu anda fikir üretilemedi.";

    return res.status(200).json({ fikir });

  } catch (error) {
    console.log("SERVER ERROR:", error);
    return res.status(500).json({ fikir: "Sunucu hatası oluştu." });
  }
}
