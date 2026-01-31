// src/flows/microgig.flow.ts

export type FlowQuestion = {
  key: string;
  question: string;
};

export type ServiceFlow = {
  serviceName: string;
  vendorTitle: string;
  questions: FlowQuestion[];
};

export const MICRO_GIG_FLOW: ServiceFlow = {
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
