const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "pair3",
    version: "1.0",
    author: "YourName",
    countDown: 10,
    role: 0,
    shortDescription: "Horimiya style pair making 💞",
    longDescription: "Get your random couple with a Horimiya background theme ❤️",
    category: "love",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, usersData }) {
    try {
      const senderData = await usersData.get(event.senderID);
      const senderName = senderData.name;
      const threadData = await api.getThreadInfo(event.threadID);
      const users = threadData.userInfo;

      const me = users.find(u => u.id == event.senderID);
      if (!me || !me.gender) {
        return api.sendMessage("⚠️ Could not determine your gender.", event.threadID, event.messageID);
      }

      const myGender = me.gender.toUpperCase();
      let candidates = [];

      if (myGender === "MALE") {
        candidates = users.filter(u => u.gender === "FEMALE" && u.id != event.senderID);
      } else if (myGender === "FEMALE") {
        candidates = users.filter(u => u.gender === "MALE" && u.id != event.senderID);
      } else {
        candidates = users.filter(u => u.id != event.senderID);
      }

      if (candidates.length === 0) {
        return api.sendMessage("❌ No suitable match found in the group.", event.threadID, event.messageID);
      }

      const selected = candidates[Math.floor(Math.random() * candidates.length)];
      const matchName = selected.name;

      // Canvas setup
      const width = 1000;
      const height = 600;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Horimiya background (anime style)
      const background = await loadImage("https://files.catbox.moe/tj7xd1.jpg");
      ctx.drawImage(background, 0, 0, width, height);

      // Profile pictures
      const myAvatar = await loadImage(
        `https://graph.facebook.com/${event.senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
      );
      const matchAvatar = await loadImage(
        `https://graph.facebook.com/${selected.id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
      );

      // Helper for circle avatar
      function drawCircle(ctx, img, x, y, size) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();
      }

      // Avatars positions
      drawCircle(ctx, myAvatar, 150, 220, 220);
      drawCircle(ctx, matchAvatar, 630, 220, 220);

      // Save image
      const outputPath = path.join(__dirname, "cache", `pair3_${event.senderID}.png`);
      const out = fs.createWriteStream(outputPath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);

      out.on("finish", () => {
        const lovePercent = Math.floor(Math.random() * 41) + 60; // 60-100%

        const msg = `✨ Horimiya Style Pair ✨\n\n💞 ${senderName}\n💞 ${matchName}\n\n🌸 May your love bloom beautifully like Horimiya 💕\n\n🔗 Love Percentage: ${lovePercent}% ❤️`;

        api.sendMessage(
          {
            body: msg,
            attachment: fs.createReadStream(outputPath),
            mentions: [
              { tag: senderName, id: event.senderID },
              { tag: matchName, id: selected.id }
            ]
          },
          event.threadID,
          () => fs.unlinkSync(outputPath),
          event.messageID
        );
      });
    } catch (err) {
      api.sendMessage(
        "❌ An error occurred while trying to find a Horimiya match.\n" + err.message,
        event.threadID,
        event.messageID
      );
    }
  }
};
