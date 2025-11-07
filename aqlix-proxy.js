// بديل إذا لم يكن هناك مفتاح OpenAI
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!OPENAI_KEY) {
      // ردود ذكية عربية مسبقة الصنع
      const responses = {
        "مرحبا": "أهلاً وسهلاً! كيف يمكنني مساعدتك اليوم؟",
        "كيف حالك": "الحمدلله بخير، شكراً لسؤالك! كيف يمكنني خدمتك؟",
        "شكرا": "العفو! دائماً سعيد بمساعدتك. هل هناك شيء آخر؟",
        "default": `أهلاً بك! سؤالك هو: "${message}". للأسف الخادم الرئيسي غير متوفر حالياً، لكن يمكنني مساعدتك في مواضيع متعددة.`
      };
      
      const reply = responses[message] || responses.default;
      return res.json({ reply });
    }

    // الكود الأصلي مع OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system", 
            content: "You are a helpful Arabic assistant named Aqlix."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
    
  } catch (error) {
    res.json({ reply: `عذراً، حدث خطأ: ${error.message}` });
  }
});