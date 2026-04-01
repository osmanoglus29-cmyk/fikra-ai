export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ fikir: "Sadece POST" });
  }

  try {

    const { mesaj } = req.body;

    if (!mesaj) {
      return res.status(400).json({ fikir: "Mesaj boş" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `Kullanıcıya Türkçe, net, kısa ama güçlü bir fikir ver:\n${mesaj}`
      })
    });

    const data = await response.json();

    console.log("OPENAI DATA:", JSON.stringify(data));

    if (!response.ok) {
      return res.status(500).json({ fikir: "OpenAI hata verdi" });
    }

    let fikir = "Fikir üretilemedi";

    if (data.output && data.output[0]?.content) {
      fikir = data.output[0].content[0].text;
    } else if (data.output_text) {
      fikir = data.output_text;
    }

    return res.status(200).json({ fikir });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    return res.status(500).json({ fikir: "Sunucu hatası" });
  }
}
