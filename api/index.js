const Express = require("express");
const app = Express();

app.use(Express.json());

const BOT_TOKEN = process.env.BOT_TOKEN || "8909766691:AAEcEwo0igphiYoSpJ6Wxs5ChOVQTL16uZ0";
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

  const payload = {
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
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    console.log("Telegram Response:", data);
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

// Universal Webhook Handler (Vercel ke routing issues ko permanently fix karne ke liye)
app.post("*", async (req, res) => {
  try {
    const update = req.body;

    if (update) {
      // 1. Handle /start command
      if (update.message && update.message.text === "/start") {
        const chatId = update.message.chat.id;
        const from = update.message.from || {};
        const fullName = [from.first_name, from.last_name].filter(Boolean).join(" ") || "Trader";
        
        await sendPhotoMessage(chatId, fullName);
      }

      // 2. Handle Chat Join Request
      if (update.chat_join_request) {
        const userId = update.chat_join_request.from.id;
        const from = update.chat_join_request.from || {};
        const fullName = [from.first_name, from.last_name].filter(Boolean).join(" ") || "Trader";
        
        await sendPhotoMessage(userId, fullName);
      }
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
  }

  res.status(200).send("OK");
});

app.get("*", (req, res) => {
  res.send("Bot status: Active");
});

module.exports = app;
