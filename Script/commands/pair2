const axios = require("axios");
const fs = require("fs-extra");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "pair2",
    aliases: ["love", "cặpđôi"], // চাইলে shortcut কমান্ড দিতে পারো
    version: "1.0",
    author: "YourName",
    role: 0,
    countDown: 10,
    shortDescription: "Get to know your partner",
    longDescription: "Know your destiny and know who you will complete your life with",
    category: "fun",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, usersData }) {
    let pathImg = __dirname + "/cache/pair_bg.png";
    let pathAvt1 = __dirname + "/cache/avt1.png";
    let pathAvt2 = __dirname + "/cache/avt2.png";

    const { threadID, senderID } = event;
    const botID = api.getCurrentUserID();
    const threadInfo = await api.getThreadInfo(threadID);

    // user info
    let name1 = await usersData.getName(senderID);
    let gender1;
    for (let u of threadInfo.userInfo) {
      if (u.id == senderID) gender1 = u.gender;
    }

    // নির্বাচন partner
    let candidates = [];
    if (gender1 == "FEMALE") {
      candidates = threadInfo.userInfo.filter(u => u.gender == "MALE" && u.id != senderID && u.id != botID).map(u => u.id);
    } else if (gender1 == "MALE") {
      candidates = threadInfo.userInfo.filter(u => u.gender == "FEMALE" && u.id != senderID && u.id != botID).map(u => u.id);
    } else {
      candidates = threadInfo.userInfo.filter(u => u.id != senderID && u.id != botID).map(u => u.id);
    }

    if (candidates.length === 0) {
      return api.sendMessage("❌ এই গ্রুপে তোমার জন্য কোনো উপযুক্ত সঙ্গী খুঁজে পাইনি!", threadID, event.messageID);
    }

    let id2 = candidates[Math.floor(Math.random() * candidates.length)];
    let name2 = await usersData.getName(id2);

    // percentage
    let rd1 = Math.floor(Math.random() * 100) + 1;
    let special = ["0", "-1", "99.99", "-99", "-100", "101", "0.01"];
    let rd2 = special[Math.floor(Math.random() * special.length)];
    let percentList = [rd1, rd1, rd1, rd1, rd1, rd2, rd1, rd1, rd1];
    let percent = percentList[Math.floor(Math.random() * percentList.length)];

    // download images
    let avt1 = (await axios.get(`https://graph.facebook.com/${senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathAvt1, Buffer.from(avt1, "utf-8"));

    let avt2 = (await axios.get(`https://graph.facebook.com/${id2}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathAvt2, Buffer.from(avt2, "utf-8"));

    let bg = (await axios.get("https://i.ibb.co/RBRLmRt/Pics-Art-05-14-10-47-00.jpg", { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

    // draw canvas
    let baseImage = await loadImage(pathImg);
    let baseAvt1 = await loadImage(pathAvt1);
    let baseAvt2 = await loadImage(pathAvt2);

    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvt1, 111, 175, 330, 330);
    ctx.drawImage(baseAvt2, 1018, 173, 330, 330);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    // remove cache
    fs.removeSync(pathAvt1);
    fs.removeSync(pathAvt2);

    return api.sendMessage({
      body: `『💗』Congratulations ${name1} 💗\n『❤️』Looks like your destiny brought you together with ${name2} ❤️\n『🔗』Your link percentage is ${percent}% 🔗`,
      mentions: [
        { tag: name1, id: senderID },
        { tag: name2, id: id2 }
      ],
      attachment: fs.createReadStream(pathImg)
    }, threadID, () => fs.unlinkSync(pathImg), event.messageID);
  }
};
