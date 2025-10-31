export default async function handler(req, res) {
    

  // Only accept POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST"); 
    return res.status(405).json({ error: "Method Not Allowed" });
  }


    try {
        
      const message = req.body?.message || req.query?.message;
      
        if (!message || !message.trim()) {
            return res.status(400).json({ error: "Message is required" });
          }

          const response = await fetch("https://router.huggingface.co/v1/chat/completions",{
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
                          - Explain things like I’m a kid.
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
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}
