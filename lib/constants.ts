// Subscription plan definitions and limits for Venyto

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: "free",
    name: "Free",
    price: 0,
    currency: "₹",
    limits: {
      exams: 1,
      tests: 20,
      subjects: 5,
      calendar: false,
      messages: false,
      reports: "limited", // view only, no PDF export
      import: false,
    },
    features: ["1 Exam", "20 Tests", "5 Subjects", "Basic Dashboard", "Limited Reports"],
  },
  BASIC: {
    id: "basic",
    name: "Basic",
    price: 9,
    currency: "₹",
    limits: {
      exams: 2,
      tests: 40,
      subjects: 10,
      calendar: true,
      messages: true,
      reports: "basic", // some exports allowed
      import: false,
    },
    features: ["2 Exams", "40 Tests", "10 Subjects", "Calendar & Scheduling", "Messages", "Basic Reports & Exports"],
  },
  PRO: {
    id: "pro",
    name: "Pro",
    price: 49,
    currency: "₹",
    limits: {
      exams: Number.POSITIVE_INFINITY,
      tests: Number.POSITIVE_INFINITY,
      subjects: Number.POSITIVE_INFINITY,
      calendar: true,
      messages: true,
      reports: "full", // all exports + scheduled reports
      import: true, // CSV/XLSX
    },
    features: [
      "Unlimited Exams",
      "Unlimited Tests",
      "Unlimited Subjects",
      "Full Calendar & Scheduling",
      "Messages & Notifications",
      "Full Reports & PDF Export",
      "CSV/XLSX Import",
    ],
  },
  PRO_PLUS: {
    id: "pro_plus",
    name: "Pro+",
    price: 99,
    currency: "₹",
    limits: {
      exams: Number.POSITIVE_INFINITY,
      tests: Number.POSITIVE_INFINITY,
      subjects: Number.POSITIVE_INFINITY,
      calendar: true,
      messages: true,
      reports: "full",
      import: true,
      aiInsights: true,
      prioritySupport: true,
    },
    features: [
      "Everything in Pro",
      "AI-Powered Insights",
      "Priority Support",
      "Advanced Analytics",
      "Custom Report Scheduling",
      "Downloadable PDF Reports",
    ],
  },
} as const

export type SubscriptionPlanId = keyof typeof SUBSCRIPTION_PLANS
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[SubscriptionPlanId]
