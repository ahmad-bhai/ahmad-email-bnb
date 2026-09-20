const Express = require("express");
const https = require("https");
const app = Express();

app.use(Express.json());

// Token aapka updated wala
const BOT_TOKEN = process.env.BOT_TOKEN || "8909766691:AAEcEwo0igphiYoSpJ6Wxs5ChOVQTL16uZ0";
const PHOTO_URL = "https://i.ibb.co/bRJJJcCv/a155df819f25.jpg";

// Telegram Photo Helper using native HTTPS module (No Fetch issues on Vercel)
function sendPhotoMessage(chatId, userName) {
  return new Promise((resolve, reject) => {
    const captionText = `WELCOME DEAR ${userName}!\n✨ WELCOME TO OUR AI SIGNALS GROUP! 🤖📈\n⏰ 24/7 AI SIGNALS — SMART & AUTOMATED TRADING SIGNALS 🚀\n\n🔗 [ https://t.me/+KEYIwc5Y-480ZDY0 ] 🔗\n🔗 [ https://t.me/+KEYIwc5Y-480ZDY0 ] 🔗\n\n💎 DON’T WASTE YOUR TIME & MONEY!\n\nJOIN NOW & WORK TOWARD YOUR DAILY RECOVERY & TRADING GOALS. 💰🔥\n🚀 JOIN NOW • TRADE SMART • STAY CONSISTENT`;

    const payload = JSON.stringify({
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
    });

    const options = {
      hostname: "api.telegram.org",
      path: `/bot${BOT_TOKEN}/sendPhoto`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        console.log("Telegram API Response:", data);
        resolve(data);
      });
    });

    req.on("error", (err) => {
      console.error("HTTPS Request Error:", err);
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

// All POST Requests Handler
app.post("*", async (req, res) => {
  try {
    const update = req.body;
    console.log("Received Update:", JSON.stringify(update));

    if (update) {
      // 1. Handle /start command
      if (update.message && update.message.text && update.message.text.startsWith("/start")) {
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
    console.error("Error handling update:", err);
  }

  res.status(200).send("OK");
});

app.get("*", (req, res) => {
  res.send("Bot status: Active");
});

module.exports = app;
