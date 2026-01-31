"use strict";
// src/flows/microgig.flow.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.MICRO_GIG_FLOW = void 0;
exports.MICRO_GIG_FLOW = {
    serviceName: "Quick Home Help",
    vendorTitle: "📩 New Micro-Gig Request",
    questions: [
        {
            key: "task",
            question: "🧹 What quick task do you need help with?\n(e.g., dishes, floor cleaning, grocery pickup)"
        },
        {
            key: "duration",
            question: "⏱️ How much time is needed?\n(10 / 20 / 30 / 45 / 60 minutes)"
        },
        {
            key: "location",
            question: "📍 Which area / locality?"
        },
        {
            key: "timing",
            question: "🕒 When is this needed?\n(now / today / specific time)"
        },
        {
            key: "budget",
            question: "💰 Expected pay for this task? (₹)\n(or type 'ask vendor')"
        }
    ]
};
