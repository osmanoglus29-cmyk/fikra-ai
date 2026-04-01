export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ fikir: "Sadece POST isteği kabul edilir." });
  }

  try {
    const mesaj = String(req.body?.mesaj || "").trim();

    if (!mesaj) {
      return res.status(400).json({ fikir: "Lütfen bir konu yaz." });
    }

    const prompt = `
Sen FİKRÂ adında güçlü bir yapay fikir asistanısın.

- Türkçe yaz
- 3 farklı fikir üret
- detaylı ve yaratıcı olsun
- her fikre başlık koy

Konu:
${mesaj}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
        fikir: "Model hatası oluştu."
      });
    }

    const fikir =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Fikir üretilemedi.";

    res.status(200).json({ fikir });

  } catch (error) {
    console.log("SERVER ERROR:", error);
    res.status(500).json({ fikir: "Sunucu hatası." });
  }
}
