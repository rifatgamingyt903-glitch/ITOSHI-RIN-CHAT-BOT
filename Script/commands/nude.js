const axios = require("axios");

module.exports.config = {
    name: "nude", // change command name
    version: "1.0.0",
    hasPermssion: 0,
    credits: "MMRifat",
    description: "Sends a random anime girl picture",
    commandCategory: "fun",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    var link = [
        "https://i.imgur.com/XYz9PZ3.jpg",
        "https://i.imgur.com/7C7k9Tj.jpg",
        "https://i.imgur.com/m5nbqQZ.jpg",
        "https://i.imgur.com/bqdfmM8.jpg"
    ];
    
    let img = link[Math.floor(Math.random() * link.length)];
    
    api.sendMessage({
        body: "「 Here is your random pic 😻 」",
        attachment: await global.utils.getStreamFromURL(img)
    }, event.threadID, event.messageID);
};
