export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ fikir: "Sadece POST isteği kabul edilir." });
  }

  try {
    const { mesaj } = req.body || {};

    if (!mesaj || !String(mesaj).trim()) {
      return res.status(400).json({ fikir: "Mesaj boş olamaz." });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content:
              "Sen FİKRÂ adında yapay fikir asistanısın. Kullanıcının yazdığı konuya göre Türkçe, net, kısa ama etkili ve uygulanabilir bir fikir ver. 4-6 cümle yaz."
          },
          {
            role: "user",
            content: `Konu: ${mesaj}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("OPENAI_ERROR_JSON:", JSON.stringify(data));
      const msg =
        data?.error?.message ||
        data?.message ||
        "OpenAI hata verdi.";
      return res.status(response.status).json({ fikir: msg });
    }

    const fikir =
      data.output_text ||
      "Şu an fikir üretilemedi. Lütfen tekrar dene.";

    return res.status(200).json({ fikir });
  } catch (err) {
    console.log("SERVER_ERROR:", err?.message || err);
    return res.status(500).json({ fikir: "Sunucu hatası oluştu." });
  }
}
