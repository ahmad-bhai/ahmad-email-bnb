const Express = require("express");
const app = Express();

app.use(Express.json());

const BOT_TOKEN = process.env.BOT_TOKEN || "8828282862:AAGtZbNu8sPGmPQihArUr8Kc8HICRPRjlj0";
// Naya Logo URL
const PHOTO_URL = "https://i.ibb.co/bRJJJcCv/a155df819f25.jpg";

// Telegram Photo with Caption & Inline Button Helper Function
async function sendPhotoMessage(chatId, userName) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
  
  const captionText = `WELCOME DEAR ${userName}!
✨ WELCOME TO OUR AI SIGNALS GROUP! 🤖📈
⏰ 24/7 AI SIGNALS — SMART & AUTOMATED TRADING SIGNALS 🚀

🔗 [ https://t.me/+KEYIwc5Y-480ZDY0 ] 🔗
🔗 [ https://t.me/+KEYIwc5Y-480ZDY0 ] 🔗

💎 DON’T WASTE YOUR TIME & MONEY!

JOIN NOW & WORK TOWARD YOUR DAILY RECOVERY & TRADING GOALS. 💰🔥
🚀 JOIN NOW • TRADE SMART • STAY CONSISTENT`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        photo: PHOTO_URL,
        caption: captionText,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "FREE BOT 🤖",
                url: "https://t.me/+KEYIwc5Y-480ZDY0"
              }
            ]
          ]
        }
      }),
    });
    const data = await response.json();
    console.log("Telegram Response:", data);
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

// Main Endpoint (Root Route handles both Vercel function routes)
app.all("*", async (req, res) => {
  if (req.method === "GET") {
    return res.status(200).send("Bot status: Active");
  }

  if (req.method === "POST") {
    const update = req.body;

    // 1. Handle /start command
    if (update && update.message && update.message.text === "/start") {
      const chatId = update.message.chat.id;
      const from = update.message.from;
      
      const fullName = [from.first_name, from.last_name].filter(Boolean).join(" ") || "Trader";
      
      await sendPhotoMessage(chatId, fullName);
    }

    // 2. Handle Chat Join Request
    if (update && update.chat_join_request) {
      const userId = update.chat_join_request.from.id;
      const from = update.chat_join_request.from;
      
      const fullName = [from.first_name, from.last_name].filter(Boolean).join(" ") || "Trader";
      
      await sendPhotoMessage(userId, fullName);
    }

    return res.status(200).send("OK");
  }

  return res.status(404).send("Not Found");
});

module.exports = app;
