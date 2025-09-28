const axios = require("axios");

// =================== BASE API URL ===================
const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.jan;
};

// =================== FUNCTION : GET BOT RESPONSE ===================
async function getBotResponse(message) {
  try {
    const base = await baseApiUrl();
    const response = await axios.get(`${base}/jan/font3/${encodeURIComponent(message)}`);
    return response.data?.message || "try Again";
  } catch (error) {
    console.error("API Error:", error.message || error);
    return "error janu 🥲";
  }
}

module.exports = {
  config: {
    name: "bot",
    version: "1.7",
    author: "MahMUD",
    role: 0,
    description: "No prefix chatbot (call with 'jan', 'baby', etc).",
    category: "ai",
    guide: {
      en: "Just type jan or baby followed by your message.\nExample: jan kemon acho?"
    },
  },

  // =================== ON START ===================
  onStart: async function () {},

  // =================== ON REPLY ===================
  onReply: async function ({ api, event }) {
    try {
      if (event.type === "message_reply") {
        let message = event.body?.toLowerCase() || "hello";
        const replyMessage = await getBotResponse(message);
        api.sendMessage(replyMessage, event.threadID, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "bot",
              type: "reply",
              messageID: info.messageID,
              author: event.senderID,
              text: replyMessage,
            });
          }
        }, event.messageID);
      }
    } catch (err) {
      api.sendMessage(`⚠️ Error: ${err.message}`, event.threadID, event.messageID);
    }
  },

  // =================== ON CHAT ===================
  onChat: async function ({ api, event }) {
    try {
      const responses = [
        "babu khuda lagse🥺",
        "Hop beda😾, Boss বল boss😼",
        "আমাকে ডাকলে, আমি কিন্তূ কিস করে দেবো😘",
        "🐒🐒🐒",
        "bye",
        "naw message daw https://m.me/rifat.ahmed.37800",
        "mb ney bye",
        "meww",
        "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
        "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂__😘😘",
        "𝗜 𝗵𝗮𝘁𝗲 𝘆𝗼𝘂__😏😏",
      ];

      const triggers = ["jan", "jaan", "জান", "hinata", "bby", "baby", "bbu", "বাবু", "বেবি"];
      let message = event.body ? event.body.toLowerCase() : "";
      const words = message.split(" ");
      const wordCount = words.length;

      if (event.type !== "message_reply" && triggers.some(key => message.startsWith(key))) {
        api.setMessageReaction("🪽", event.messageID, () => {}, true);
        api.sendTypingIndicator(event.threadID, true);

        if (wordCount === 1) {
          // Only "jan" or "baby"
          const randomMsg = responses[Math.floor(Math.random() * responses.length)];
          api.sendMessage(randomMsg, event.threadID, (err, info) => {
            if (!err) {
              global.GoatBot.onReply.set(info.messageID, {
                commandName: "bot",
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                text: randomMsg,
              });
            }
          }, event.messageID);
        } else {
          // User wrote something after trigger word
          words.shift();
          const userText = words.join(" ");
          const botResponse = await getBotResponse(userText);
          api.sendMessage(botResponse, event.threadID, (err, info) => {
            if (!err) {
              global.GoatBot.onReply.set(info.messageID, {
                commandName: "bot",
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                text: botResponse,
              });
            }
          }, event.messageID);
        }
      }
    } catch (err) {
      api.sendMessage(`⚠️ Error: ${err.message}`, event.threadID, event.messageID);
    }
  },
};
