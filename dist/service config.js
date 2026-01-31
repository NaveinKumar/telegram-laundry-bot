"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICE = void 0;
// src/service.config.ts
exports.SERVICE = {
    name: "Maids Service",
    emoji: "🧹",
    intro: "Domestic Help Request",
    vendorGroupId: -1003883737847,
    questions: [
        { key: "type", text: "Hourly maid service(General / Cooking)" },
        { key: "area", text: "📍 Which area / locality?" },
        { key: "time", text: "⏰ Preferred timing?" }
    ]
};
