const Express = require("express");
const app = Express();

app.use(Express.json());

const BOT_TOKEN = process.env.BOT_TOKEN || "8828282862:AAE6gnK7g5e-IFyXaQ_OoskgcRYzoUJ7BIY";
const PHOTO_URL = "https://i.ibb.co/1JvTsrpN/d795e3af442a.jpg";

// Telegram Photo with Caption Sending Helper Function
async function sendPhotoMessage(chatId, userName) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
  
  const captionText = `👋 Hi, ${userName} Welcome To The NO.1 Trading Community🔥

💸 Join Public Channel Daily Tournament And NON MTG SIGNAL 🚀
~~~~ 
Consistent 98% Accuracy 🔥 
Guaranteed Loss Recovery 💰 
8+ Years Experience 🚀 
~~~~
👇🏻Open Below Link And Start Now 👇🏻

40$ TO 700$ DAILY TOURNAMENT JOIN NOW CHECK 👇

https://t.me/+V5lZvh2Po0dkNzhk

SUPER BINARY TRADER DAILY 3 NON MTG SIGNAL PROVIDE JOIN NOW CHECK 👇

https://t.me/+jMXUHZHKgQY0NjZk

30$ TO 300$ TOURNAMENT JOIN NOW CHECK 👇

https://t.me/+tnWlS8fu2rVjMDJk

Official Regards 🚀

40$ TO 700$ TOURNAMENT ✔️
SUPER BINARY TRADER ✔️
30$ TO 300$ TOURNAMENT✔️`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        photo: PHOTO_URL,
        caption: captionText,
      }),
    });
    const data = await response.json();
    console.log("Telegram Response:", data);
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

// Vercel Webhook Endpoint
app.post("/api/index", async (req, res) => {
  const update = req.body;

  // 1. Handle /start command
  if (update.message && update.message.text === "/start") {
    const chatId = update.message.chat.id;
    const from = update.message.from;
    
    // User Name extraction (First Name + Last Name)
    const fullName = [from.first_name, from.last_name].filter(Boolean).join(" ") || "Trader";
    
    await sendPhotoMessage(chatId, fullName);
  }

  // 2. Handle Chat Join Request
  if (update.chat_join_request) {
    const userId = update.chat_join_request.from.id;
    const from = update.chat_join_request.from;
    
    const fullName = [from.first_name, from.last_name].filter(Boolean).join(" ") || "Trader";
    
    await sendPhotoMessage(userId, fullName);
  }

  res.status(200).send("OK");
});

app.get("/", (req, res) => {
  res.send("Bot status: Active");
});

module.exports = app;
