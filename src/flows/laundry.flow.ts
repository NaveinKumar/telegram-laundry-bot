// flows.ts

export type FlowQuestion = {
  key: string;
  question: string;
};

export type ServiceFlow = {
  serviceName: string;
  vendorTitle: string;
  questions: FlowQuestion[];
};

export const LAUNDRY_FLOW: ServiceFlow = {
  serviceName: "Pressing / Ironing",
  vendorTitle: "🧺 New Pressing Request",
  questions: [
    {
      key: "clothes",
      question: "👕 How many clothes?",
    },
    {
      key: "area",
      question: "📍 Which area / locality?",
    },
    {
      key: "time",
      question: "⏰ When do you need them?",
    },
  ],
};
