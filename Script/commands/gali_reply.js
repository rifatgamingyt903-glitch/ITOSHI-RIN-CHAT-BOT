const fs = require("fs");
module.exports.config = {
	name: "gali",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️", 
	description: "no prefix",
	commandCategory: "no prefix",
	usages: "abal",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("Rifat khanki")==0 || event.body.indexOf("Rifat mc")==0 || event.body.indexOf("chod")==0 || event.body.indexOf("Rifat gay")==0 || event.body.indexOf("bc")==0 || event.body.indexOf("Rifat re chudi")==0 || event.body.indexOf("Rifat khankir pola")==0 || event.body.indexOf("Rifat Abal")==0 || event.body.indexOf("Rifat hala")==0 || event.body.indexOf("Rifat madarchod")==0 || event.body.indexOf("Rifat re chudi")==0 || event.body.indexOf("Rifat magi")==0) {
		var msg = {
				body: "তোর মতো বোকাচোদা রে আমার বস রিফাত চু*দা বাদ দিছে🤣\nরিফাত এখন আর hetars চু*দে না🥱😈",
			}
			api.sendMessage(msg, threadID, messageID);
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
