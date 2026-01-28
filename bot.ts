import TelegramBot, { Message } from "node-telegram-bot-api";

const TOKEN = process.env.BOT_TOKEN!;
const VENDOR_GROUP_ID = -1003883737847;

const bot = new TelegramBot(TOKEN, { polling: true });

type UserState = {
  step: "clothes" | "area" | "time" | null;
  clothes?: string;
  area?: string;
  time?: string;
};

const userStates = new Map<number, UserState>();
// Maps vendor-group message_id -> customer chat_id
const requestMap = new Map<number, number>();


bot.onText(/\/start/, (msg: Message) => {
  const chatId = msg.chat.id;

  userStates.set(chatId, { step: "clothes" });

  bot.sendMessage(
    chatId,
    "👕 *Pressing / Ironing Request*\n\nHow many clothes?",
    { parse_mode: "Markdown" }
  );
});

bot.on("message", (msg: Message) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith("/")) return;

  const state = userStates.get(chatId);
  if (!state || !state.step) return;

  if (state.step === "clothes") {
    state.clothes = text;
    state.step = "area";
    bot.sendMessage(chatId, "📍 Which area / locality?");
    return;
  }

  if (state.step === "area") {
    state.area = text;
    state.step = "time";
    bot.sendMessage(chatId, "⏰ When do you need them?");
    return;
  }

  if (state.step === "time") {
    state.time = text;
    state.step = null;

    const vendorMessage = `
🧺 *New Pressing Request*

👕 Clothes: ${state.clothes}
📍 Area: ${state.area}
⏰ Time: ${state.time}
`;

   bot.sendMessage(VENDOR_GROUP_ID, vendorMessage, {
  parse_mode: "Markdown",
  }).then(sentMsg => {
  // 🔑 store mapping
  requestMap.set(sentMsg.message_id, chatId);
  }).catch(err => {
  console.error("Failed to send to vendor group:", err.message);
  });


  bot.sendMessage(
     chatId,
      "✅ Your request is shared with local pressing vendors.\nThey may reply with price & timing."
  );

    userStates.delete(chatId);
  bot.on("message", (msg: Message) => {
  // Only messages from vendor group
  if (msg.chat.id !== VENDOR_GROUP_ID) return;

  // Must be a reply to the original request
  if (!msg.reply_to_message) return;

  const originalMsgId = msg.reply_to_message.message_id;
  const customerChatId = requestMap.get(originalMsgId);

  if (!customerChatId) return; // not our tracked request

  const vendorName =
    msg.from?.first_name ||
    msg.from?.username ||
    "Vendor";

  const replyText = msg.text || "[non-text message]";

  bot.sendMessage(
    customerChatId,
    `📩 *Vendor reply received*\n\n👤 ${vendorName}\n💬 ${replyText}`,
    { parse_mode: "Markdown" }
  ).catch(err => {
    console.error("Failed to send reply to customer:", err.message);
  });
});



  }
});
