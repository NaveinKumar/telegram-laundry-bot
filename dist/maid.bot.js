"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const maid_flow_1 = require("./flows/maid.flow");
const TOKEN = process.env.MAID_BOT_TOKEN;
const VENDOR_GROUP_ID = Number(process.env.MAID_VENDOR_GROUP_ID);
const bot = new node_telegram_bot_api_1.default(TOKEN, { polling: true });
const userStates = new Map();
const requestMap = new Map();
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userStates.set(chatId, {
        stepIndex: 0,
        answers: {},
    });
    bot.sendMessage(chatId, `🧹 *${maid_flow_1.MICRO_GIG_FLOW.serviceName} Request*\n\n${maid_flow_1.MICRO_GIG_FLOW.questions[0].question}`, { parse_mode: "Markdown" });
});
bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text || text.startsWith("/"))
        return;
    const state = userStates.get(chatId);
    if (!state)
        return;
    const currentQuestion = maid_flow_1.MICRO_GIG_FLOW.questions[state.stepIndex];
    state.answers[currentQuestion.key] = text;
    state.stepIndex++;
    if (state.stepIndex < maid_flow_1.MICRO_GIG_FLOW.questions.length) {
        const nextQ = maid_flow_1.MICRO_GIG_FLOW.questions[state.stepIndex];
        bot.sendMessage(chatId, nextQ.question);
        return;
    }
    const vendorMessage = `
${maid_flow_1.MICRO_GIG_FLOW.vendorTitle}

👩‍🍳 Type: ${state.answers.type}
📍 Area: ${state.answers.area}
⏰ Hours: ${state.answers.hours}
📝 Work: ${state.answers.work}
`;
    bot.sendMessage(VENDOR_GROUP_ID, vendorMessage, {
        parse_mode: "Markdown",
    }).then(sentMsg => {
        requestMap.set(sentMsg.message_id, chatId);
    });
    bot.sendMessage(chatId, "✅ Your request is shared with local maid service providers.\nThey may reply with availability & charges.");
    userStates.delete(chatId);
});
bot.on("message", (msg) => {
    if (msg.chat.id !== VENDOR_GROUP_ID)
        return;
    if (!msg.reply_to_message)
        return;
    const originalMsgId = msg.reply_to_message.message_id;
    const customerChatId = requestMap.get(originalMsgId);
    if (!customerChatId)
        return;
    const vendorName = msg.from?.first_name ||
        msg.from?.username ||
        "Vendor";
    bot.sendMessage(customerChatId, `📩 *Maid Service Reply*\n\n👤 ${vendorName}\n💬 ${msg.text}`, { parse_mode: "Markdown" });
});
