"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const laundry_flow_1 = require("./flows/laundry.flow");
const TOKEN = process.env.BOT_TOKEN;
const VENDOR_GROUP_ID = -1003883737847;
const bot = new node_telegram_bot_api_1.default(TOKEN, { polling: true });
const userStates = new Map();
// Maps vendor-group message_id -> customer chat_id
const requestMap = new Map();
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userStates.set(chatId, {
        stepIndex: 0,
        answers: {},
    });
    bot.sendMessage(chatId, `👕 *${laundry_flow_1.LAUNDRY_FLOW.serviceName} Request*\n\n${laundry_flow_1.LAUNDRY_FLOW.questions[0].question}`, { parse_mode: "Markdown" });
});
bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text || text.startsWith("/"))
        return;
    const state = userStates.get(chatId);
    if (!state)
        return;
    const currentQuestion = laundry_flow_1.LAUNDRY_FLOW.questions[state.stepIndex];
    if (!currentQuestion)
        return;
    // save answer
    state.answers[currentQuestion.key] = text;
    state.stepIndex++;
    // ask next question
    if (state.stepIndex < laundry_flow_1.LAUNDRY_FLOW.questions.length) {
        const nextQ = laundry_flow_1.LAUNDRY_FLOW.questions[state.stepIndex];
        bot.sendMessage(chatId, nextQ.question);
        return;
    }
    // all answers collected → send to vendor group
    const vendorMessage = `
${laundry_flow_1.LAUNDRY_FLOW.vendorTitle}

👕 Clothes: ${state.answers.clothes}
📍 Area: ${state.answers.area}
⏰ Time: ${state.answers.time}
`;
    bot.sendMessage(VENDOR_GROUP_ID, vendorMessage, {
        parse_mode: "Markdown",
    }).then(sentMsg => {
        requestMap.set(sentMsg.message_id, chatId);
    }).catch(err => console.error("Failed to send to vendor group:", err.message));
    bot.sendMessage(chatId, "✅ Your request is shared with local pressing vendors.\nThey may reply with price & timing.");
    userStates.delete(chatId);
});
bot.on("message", (msg) => {
    // Only messages from vendor group
    if (msg.chat.id !== VENDOR_GROUP_ID)
        return;
    // Must be a reply to the original request
    if (!msg.reply_to_message)
        return;
    const originalMsgId = msg.reply_to_message.message_id;
    const customerChatId = requestMap.get(originalMsgId);
    if (!customerChatId)
        return; // not our tracked request
    const vendorName = msg.from?.first_name ||
        msg.from?.username ||
        "Vendor";
    const replyText = msg.text || "[non-text message]";
    bot.sendMessage(customerChatId, `📩 *Vendor reply received*\n\n👤 ${vendorName}\n💬 ${replyText}`, { parse_mode: "Markdown" }).catch(err => {
        console.error("Failed to send reply to customer:", err.message);
    });
});
