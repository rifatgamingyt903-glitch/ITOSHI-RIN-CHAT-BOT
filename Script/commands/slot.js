module.exports = {
  config: {
    name: "slot",
    version: "1.0",
    author: "Samir",
    countDown: 5,
    role: 0,
    shortDescription: "Slot game 🎰",
    longDescription: "Try your luck in slot machine and win double, triple or jackpot!",
    category: "games",
    guide: "{pn} <amount>"
  },

  langs: {
    en: {
      invalid_amount: "⚠️ Enter a valid and positive amount to play.",
      not_enough_money: "❌ You don’t have enough balance to play.",
      win_message: "🎉 You won $%1, buddy!\nResult: [ %2 | %3 | %4 ]",
      lose_message: "😢 You lost $%1, buddy.\nResult: [ %2 | %3 | %4 ]",
      jackpot_message: "💎 Jackpot!!! You won $%1 with three %2 symbols, buddy!\nResult: [ %3 | %4 | %5 ]"
    }
  },

  onStart: async function ({ args, message, event, usersData, getLang }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);
    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply(getLang("invalid_amount"));
    }

    if (amount > userData.money) {
      return message.reply(getLang("not_enough_money"));
    }

    const slots = ["🍒", "🍇", "🍊", "🍉", "🍋", "🍎", "🍓", "🍑", "🥝"];
    const slot1 = slots[Math.floor(Math.random() * slots.length)];
    const slot2 = slots[Math.floor(Math.random() * slots.length)];
    const slot3 = slots[Math.floor(Math.random() * slots.length)];

    const winnings = calculateWinnings(slot1, slot2, slot3, amount);

    // update money
    await usersData.set(senderID, {
      money: userData.money + winnings,
      data: userData.data
    });

    // message text
    const messageText = getSpinResultMessage(slot1, slot2, slot3, winnings, getLang);

    return message.reply(messageText);
  }
};

// helper functions
function calculateWinnings(slot1, slot2, slot3, betAmount) {
  if (slot1 === "🍒" && slot2 === "🍒" && slot3 === "🍒") {
    return betAmount * 10;
  } else if (slot1 === "🍇" && slot2 === "🍇" && slot3 === "🍇") {
    return betAmount * 5;
  } else if (slot1 === slot2 && slot2 === slot3) {
    return betAmount * 3;
  } else if (slot1 === slot2 || slot1 === slot3 || slot2 === slot3) {
    return betAmount * 2;
  } else {
    return -betAmount;
  }
}

function getSpinResultMessage(slot1, slot2, slot3, winnings, getLang) {
  if (winnings > 0) {
    if (slot1 === "🍒" && slot2 === "🍒" && slot3 === "🍒") {
      return getLang("jackpot_message", winnings, "🍒", slot1, slot2, slot3);
    } else {
      return getLang("win_message", winnings, slot1, slot2, slot3);
    }
  } else {
    return getLang("lose_message", -winnings, slot1, slot2, slot3);
  }
      }
