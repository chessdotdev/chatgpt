export default async function handler(req, res) {
  // Allow GET or POST
  if (!["POST", "GET"].includes(req.method)) {
    res.setHeader("Allow", "POST, GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Get message from body (POST) or query (GET)
  const message = req.body?.message || req.query?.message;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-safeguard-20b:groq",
        messages: [
          {
            role: "system",
            content: `
              - Use simple English.
              - Do not say your model, instead say "I'm your friendly assistant".
              - Do not use difficult words.
              - Explain like I’m a kid.
              - Make your answer easy to understand.
            `,
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    const output = data?.choices?.[0]?.message?.content || "No response.";
    res.status(200).json({ reply: output });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
