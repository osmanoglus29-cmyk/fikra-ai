export default async function handler(req, res) {
  try {
    const { mesaj } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `Kullanıcının isteğine göre kısa ama etkili bir fikir ver:\n\n${mesaj}`
      })
    });

    const data = await response.json();

    const fikir = data.output[0].content[0].text;

    res.status(200).json({ fikir });

  } catch (err) {
    res.status(500).json({ fikir: "Hata oluştu" });
  }
}
