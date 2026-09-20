const Express = require("express");
const https = require("https");
const app = Express();

app.use(Express.json());

const BOT_TOKEN = process.env.BOT_TOKEN || "8828282862:AAE6gnK7g5e-IFyXaQ_OoskgcRYzoUJ7BIY";
const PHOTO_URL = "https://magic-scripts.vercel.app/ubs.png";

// Helper function to send HTTP POST request to Telegram
function callTelegramApi(method, payload) {
  return new Promise((resolve) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: "api.telegram.org",
      path: `/bot${BOT_TOKEN}/${method}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ ok: false, description: body });
        }
      });
    });

    req.on("error", (err) => {
      console.error("Telegram API Error:", err);
      resolve({ ok: false, error: err });
    });

    req.write(data);
    req.end();
  });
}

// Function to send Photo or Text fallback
async function sendWelcomeMessage(chatId, userName) {
  const captionText = `WELCOME DEAR ${userName}!\n✨ WELCOME TO OUR AI SIGNALS GROUP! 🤖📈\n⏰ 24/7 AI SIGNALS — SMART & AUTOMATED TRADING SIGNALS 🚀\n\n🔗 [ https://t.me/+KEYIwc5Y-480ZDY0 ] 🔗\n🔗 [ https://t.me/+KEYIwc5Y-480ZDY0 ] 🔗\n\n💎 DON’T WASTE YOUR TIME & MONEY!\n\nJOIN NOW & WORK TOWARD YOUR DAILY RECOVERY & TRADING GOALS. 💰🔥\n🚀 JOIN NOW • TRADE SMART • STAY CONSISTENT`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: "FREE BOT 🤖",
          url: "https://t.me/+KEYIwc5Y-480ZDY0",
        },
      ],
    ],
  };

  // 1. First try sending Photo
  const photoResult = await callTelegramApi("sendPhoto", {
    chat_id: chatId,
    photo: PHOTO_URL,
    caption: captionText,
    reply_markup: inlineKeyboard,
  });

  // 2. If Photo fails (e.g. invalid URL or format issue), Send Text Message as Fallback
  if (!photoResult.ok) {
    console.log("Photo send failed, sending Text Message fallback...", photoResult.description);
    await callTelegramApi("sendMessage", {
      chat_id: chatId,
      text: captionText,
      reply_markup: inlineKeyboard,
    });
  }
}

// Single Universal Route Handler
app.use(async (req, res) => {
  if (req.method === "GET") {
    return res.status(200).send("Bot status: Active");
  }

  if (req.method === "POST") {
    try {
      const update = req.body;

      if (update) {
        // 1. Handle /start command
        if (update.message && update.message.text && update.message.text.startsWith("/start")) {
          const chatId = update.message.chat.id;
          const from = update.message.from || {};
          const fullName = [from.first_name, from.last_name].filter(Boolean).join(" ") || "Trader";

          await sendWelcomeMessage(chatId, fullName);
        }

        // 2. Handle Chat Join Request
        if (update.chat_join_request) {
          const userId = update.chat_join_request.from.id;
          const from = update.chat_join_request.from || {};
          const fullName = [from.first_name, from.last_name].filter(Boolean).join(" ") || "Trader";

          await sendWelcomeMessage(userId, fullName);
        }
      }
    } catch (err) {
      console.error("Error in webhook handler:", err);
    }

    return res.status(200).send("OK");
  }

  return res.status(200).send("OK");
});

module.exports = app;
