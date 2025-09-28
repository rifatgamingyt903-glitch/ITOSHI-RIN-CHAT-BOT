const axios = require("axios");

const baseApiUrl = async () => {
  return "https://www.noobs-api.rf.gd/dipto";
};

module.exports.config = {
  name: "bby",
  aliases: ["baby", "sakura", "bbe", "babe"],
  version: "6.9.0",
  author: "dipto",
  countDown: 0,
  role: 0,
  description: "Better than all sim simi",
  category: "chat",
  guide: {
    en: "{pn} [anyMessage]\n" +
        "teach [YourMessage] - [Reply1], [Reply2]...\n" +
        "teach [react] [YourMessage] - [react1], [react2]...\n" +
        "remove [YourMessage]\n" +
        "rm [YourMessage] - [indexNumber]\n" +
        "msg [YourMessage]\n" +
        "list / list all\n" +
        "edit [YourMessage] - [NewMessage]"
  }
};

// ========================== MAIN COMMAND ==========================
module.exports.onStart = async function({ api, event, args, usersData }) {
  const link = `${await baseApiUrl()}/baby`;
  const dipto = args.join(" ").toLowerCase();
  const uid = event.senderID;

  try {
    if (!args[0]) {
      const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
      return api.sendMessage(
        ran[Math.floor(Math.random() * ran.length)],
        event.threadID,
        event.messageID
      );
    }

    // REMOVE
    if (args[0] === "remove") {
      const fina = dipto.replace("remove ", "");
      const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
      return api.sendMessage(dat, event.threadID, event.messageID);
    }

    // RM (with index)
    if (args[0] === "rm" && dipto.includes("-")) {
      const [fi, f] = dipto.replace("rm ", "").split(" - ");
      const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
      return api.sendMessage(da, event.threadID, event.messageID);
    }

    // LIST
    if (args[0] === "list") {
      if (args[1] === "all") {
        const data = (await axios.get(`${link}?list=all`)).data;
        const teachers = await Promise.all(
          data.teacher.teacherList.map(async (item) => {
            const number = Object.keys(item)[0];
            const value = item[number];
            const name = (await usersData.get(number)).name;
            return { name, value };
          })
        );
        teachers.sort((a, b) => b.value - a.value);
        const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join("\n");
        return api.sendMessage(
          `Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`,
          event.threadID,
          event.messageID
        );
      } else {
        const d = (await axios.get(`${link}?list=all`)).data.length;
        return api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
      }
    }

    // MSG
    if (args[0] === "msg") {
      const fuk = dipto.replace("msg ", "");
      const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
      return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
    }

    // EDIT
    if (args[0] === "edit") {
      const command = dipto.split(" - ")[1];
      if (!command || command.length < 2)
        return api.sendMessage("❌ | Invalid format! Use edit [YourMessage] - [NewReply]", event.threadID, event.messageID);

      const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
      return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
    }

    // TEACH NORMAL
    if (args[0] === "teach" && args[1] !== "amar" && args[1] !== "react") {
      const [comd, command] = dipto.split(" - ");
      const final = comd.replace("teach ", "");
      if (!command || command.length < 2)
        return api.sendMessage("❌ | Invalid format!", event.threadID, event.messageID);

      const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
      const tex = re.data.message;
      const teacher = (await usersData.get(re.data.teacher)).name;
      return api.sendMessage(
        `✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`,
        event.threadID,
        event.messageID
      );
    }

    // TEACH AMAR
    if (args[0] === "teach" && args[1] === "amar") {
      const [comd, command] = dipto.split(" - ");
      const final = comd.replace("teach ", "");
      if (!command || command.length < 2)
        return api.sendMessage("❌ | Invalid format!", event.threadID, event.messageID);

      const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
      return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
    }

    // TEACH REACT
    if (args[0] === "teach" && args[1] === "react") {
      const [comd, command] = dipto.split(" - ");
      const final = comd.replace("teach react ", "");
      if (!command || command.length < 2)
        return api.sendMessage("❌ | Invalid format!", event.threadID, event.messageID);

      const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
      return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
    }

    // NAME
    if (
      dipto.includes("amar name ki") ||
      dipto.includes("amr nam ki") ||
      dipto.includes("amar nam ki") ||
      dipto.includes("amr name ki") ||
      dipto.includes("whats my name")
    ) {
      const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
      return api.sendMessage(data, event.threadID, event.messageID);
    }

    // NORMAL CHAT
    const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
    return api.sendMessage(d, event.threadID, event.messageID);

  } catch (e) {
    console.log(e);
    return api.sendMessage("⚠️ Check console for error", event.threadID, event.messageID);
  }
};

// ========================== ON REPLY ==========================
module.exports.onReply = async function({ api, event }) {
  try {
    if (event.type === "message_reply") {
      const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
      return api.sendMessage(a, event.threadID, event.messageID);
    }
  } catch (err) {
    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};

// ========================== AUTO CHAT (onChat) ==========================
module.exports.onChat = async function({ api, event }) {
  try {
    const body = event.body ? event.body.toLowerCase() : "";
    if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("jan") || body.startsWith("babu") || body.startsWith("Rifat")) {
      const arr = body.replace(/^\S+\s*/, "");
      if (!arr) {
        const replies = ["😘", "bolo jaan 🥺", "ki koibi ko taratari 😒", "Assalamu Alaikum 💖"];
        return api.sendMessage(replies[Math.floor(Math.random() * replies.length)], event.threadID, event.messageID);
      }
      const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
      return api.sendMessage(a, event.threadID, event.messageID);
    }
  } catch (err) {
    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};
