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
- yaratıcı ve detaylı olsun
- her fikre başlık koy

Konu: ${mesaj}
`;

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

    console.log("GEMINI:", data);

    if (!response.ok) {
      return res.status(500).json({
        fikir: data?.error?.message || "Model hatası"
      });
    }

    const fikir =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Fikir üretilemedi.";

    return res.status(200).json({ fikir });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ fikir: "Sunucu hatası" });
  }
}
