export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ fikir: "Sadece POST" });
  }

  try {

    const { mesaj } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Sen FİKRÂ adında yapay fikir asistanısın. Türkçe, net ve güçlü fikirler ver."
          },
          {
            role: "user",
            content: mesaj
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("OPENAI ERROR:", data);
      return res.status(500).json({ fikir: "AI hata verdi" });
    }

    const fikir = data.choices[0].message.content;

    return res.status(200).json({ fikir });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    return res.status(500).json({ fikir: "Sunucu hatası" });
  }
}
