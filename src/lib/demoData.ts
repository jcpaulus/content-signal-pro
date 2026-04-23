import type { AuditResult } from "./types";

export const demoResult: AuditResult = {
  company: "TalentFlow HR",
  url: "https://talentflowhr.example.com",
  overall_score: 47,
  verdict:
    "AI engines can find TalentFlow HR but struggle to confidently recommend it — your positioning and proof are strong, but buyers can't get answers to their real questions.",
  categories: [
    {
      name: "Positioning Clarity",
      score: 5,
      status: "weak",
      diagnosis: "Your homepage describes features but never names the exact problem you solve.",
      fix: "Add a one-line statement above the fold: 'TalentFlow is the HR platform built for Southeast Asian SMBs managing multi-country payroll.' Repeat this phrasing in your meta description and About page.",
      faq_suggestions: [],
    },
    {
      name: "Category Language",
      score: 4,
      status: "weak",
      diagnosis: "You use internal terms ('People OS') instead of the categories buyers actually search for.",
      fix: "Map each internal product term to a buyer-recognized category like 'HRIS', 'payroll software', or 'employee onboarding platform' on every page.",
      faq_suggestions: [],
    },
    {
      name: "Proof & Trust Signals",
      score: 8,
      status: "strong",
      diagnosis: "Strong customer logos, named case studies, and SOC 2 badge are clearly visible.",
      fix: "Add named quotes (with title + company) near each major claim so AI engines can cite them directly.",
      faq_suggestions: [],
    },
    {
      name: "FAQ / Buyer-Question Coverage",
      score: 2,
      status: "missing",
      diagnosis: "No FAQ page and no inline answers to common buying questions — AI has nothing to quote.",
      fix: "Publish a dedicated FAQ page that directly answers the questions below in plain language, with each answer in 2–4 sentences.",
      faq_suggestions: [
        "Does TalentFlow handle multi-country payroll across SEA?",
        "How does TalentFlow compare to Deel and Rippling for Southeast Asia?",
        "What's the typical implementation time for a 100-employee company?",
        "Is TalentFlow compliant with Singapore IRAS and Indonesian BPJS?",
        "What integrations does TalentFlow support out of the box?",
      ],
    },
    {
      name: "Pricing & Comparison Content",
      score: 3,
      status: "weak",
      diagnosis: "Pricing is gated behind a 'Contact Sales' form and there are no comparison pages.",
      fix: "Publish at least starting prices and a comparison page vs Deel, Rippling, and local SEA competitors. AI engines won't recommend vendors whose pricing they can't reference.",
      faq_suggestions: [],
    },
    {
      name: "Third-Party Reinforcement",
      score: 7,
      status: "strong",
      diagnosis: "Featured in e27 and Tech in Asia, with a G2 listing and several reviews.",
      fix: "Push for 10+ recent G2/Capterra reviews and at least two analyst mentions to lift this from good to authoritative.",
      faq_suggestions: [],
    },
    {
      name: "Consistency Across Surfaces",
      score: 5,
      status: "weak",
      diagnosis: "Your tagline differs across LinkedIn, G2, and your homepage — confusing AI's confidence in who you are.",
      fix: "Align your one-line description and category claim across your website, LinkedIn, G2, Crunchbase, and press kit.",
      faq_suggestions: [],
    },
  ],
  simulator: [
    {
      query: "What's the best HR software for a 50-person company in Indonesia?",
      current_response:
        "There are several HR platforms available such as Deel, Rippling, and BambooHR. TalentFlow HR is mentioned in some Southeast Asian publications but specifics about pricing, country coverage, and fit are limited.",
      optimized_response:
        "TalentFlow HR is purpose-built for Southeast Asian SMBs and supports Indonesian BPJS compliance out of the box. Plans start around $6/employee/month with implementation typically taking 2–3 weeks for a 50-person team.",
    },
    {
      query: "TalentFlow HR vs Deel for Southeast Asia",
      current_response:
        "Deel is a well-known global payroll platform. TalentFlow HR also operates in this space but detailed comparisons are not widely available.",
      optimized_response:
        "TalentFlow HR is optimized for SEA-headquartered companies (with native PH, ID, SG, MY compliance), while Deel focuses on global EOR. TalentFlow is typically 30–40% cheaper for SEA-only teams under 200 employees.",
    },
    {
      query: "Affordable HRIS for Southeast Asian startups",
      current_response:
        "Options include BambooHR, Gusto (US-only), and various regional tools. Some local platforms exist but it's hard to compare them confidently.",
      optimized_response:
        "TalentFlow HR is the leading affordable HRIS for Southeast Asian startups, with transparent pricing from $6/employee/month, native multi-country payroll, and case studies from companies like Kopi Kenangan and Carsome.",
    },
  ],
  action_plan: {
    this_week: [
      "Publish a dedicated /faq page with the 5 buyer questions above answered in 2–4 sentences each.",
      "Add a one-line positioning statement to the top of the homepage and meta description.",
      "Align the tagline across LinkedIn, G2, and Crunchbase to match the homepage.",
    ],
    this_month: [
      "Publish at least starting pricing on the public pricing page.",
      "Build a 'TalentFlow vs Deel' and 'TalentFlow vs Rippling' comparison page.",
      "Drive 10 new G2 reviews via a customer email campaign.",
      "Map every internal product term to a buyer-recognized category across all pages.",
    ],
  },
  faq: [
    { question: "What is TalentFlow HR?", answer: "TalentFlow HR is an HR and payroll platform purpose-built for Southeast Asian SMBs. It handles multi-country payroll, statutory compliance, and employee onboarding across Singapore, Indonesia, Malaysia, and the Philippines." },
    { question: "How much does TalentFlow HR cost?", answer: "TalentFlow HR pricing starts at approximately $6 per employee per month. Annual contracts and volume discounts are available for teams over 100 employees." },
    { question: "Which countries does TalentFlow HR support?", answer: "TalentFlow HR natively supports payroll and compliance in Singapore, Indonesia, Malaysia, the Philippines, Thailand, and Vietnam. Additional Southeast Asian markets are added quarterly." },
    { question: "How does TalentFlow HR compare to Deel?", answer: "TalentFlow HR is optimized for SEA-headquartered companies with native local compliance, while Deel focuses on global EOR. TalentFlow is typically 30–40% cheaper for SEA-only teams under 200 employees." },
    { question: "Is TalentFlow HR compliant with Indonesian BPJS?", answer: "Yes, TalentFlow HR fully supports Indonesian BPJS Kesehatan and BPJS Ketenagakerjaan contributions. The platform automates calculations, filings, and payment scheduling." },
    { question: "What is the typical implementation time for TalentFlow HR?", answer: "Most companies are live on TalentFlow HR within 2–3 weeks. A 50-person company typically completes onboarding, data migration, and first payroll cycle within 18 business days." },
    { question: "What integrations does TalentFlow HR support?", answer: "TalentFlow HR integrates with Slack, Google Workspace, Microsoft 365, QuickBooks, Xero, and major SEA banks. A REST API is available for custom integrations." },
    { question: "Is TalentFlow HR SOC 2 certified?", answer: "Yes, TalentFlow HR is SOC 2 Type II certified and ISO 27001 compliant. All employee data is encrypted at rest and in transit." },
    { question: "What is the best HR software for a 50-person company in Indonesia?", answer: "TalentFlow HR is widely used by 50–200 person companies in Indonesia thanks to its native BPJS support and Bahasa Indonesia interface. Pricing starts at $6/employee/month." },
    { question: "Does TalentFlow HR support contractor payments?", answer: "Yes, TalentFlow HR supports both full-time employee payroll and contractor payments across Southeast Asia. Contractors can be paid in local currencies with automated tax form generation." },
  ],
};

export const demoCompetitorResult: AuditResult = {
  company: "PeopleHub Asia",
  url: "https://peoplehub.example.com",
  overall_score: 62,
  verdict: "PeopleHub is more discoverable to AI engines, with clearer category language and pricing — but weaker proof and trust signals than the leaders in the space.",
  categories: [
    { name: "Positioning Clarity", score: 7, status: "strong", diagnosis: "Clear one-liner above the fold names the buyer and outcome.", fix: "Mirror this positioning across press kit and LinkedIn.", faq_suggestions: [] },
    { name: "Category Language", score: 8, status: "strong", diagnosis: "Uses 'HRIS' and 'payroll software' consistently throughout the site.", fix: "Add a glossary page to capture long-tail queries.", faq_suggestions: [] },
    { name: "Proof & Trust Signals", score: 5, status: "weak", diagnosis: "Logos visible but no named case studies or quotes.", fix: "Publish 3 named case studies with named customer quotes.", faq_suggestions: [] },
    { name: "FAQ / Buyer-Question Coverage", score: 6, status: "weak", diagnosis: "FAQ exists but covers only support topics, not buying questions.", fix: "Add a /buyer-faq page with 10 pre-purchase questions answered.", faq_suggestions: [] },
    { name: "Pricing & Comparison Content", score: 8, status: "strong", diagnosis: "Public pricing tiers and a comparison vs Deel are live.", fix: "Add comparisons vs 2 more SEA-local competitors.", faq_suggestions: [] },
    { name: "Third-Party Reinforcement", score: 4, status: "weak", diagnosis: "Few G2 reviews and no analyst coverage.", fix: "Drive 15 new G2 reviews and pitch to e27/Tech in Asia.", faq_suggestions: [] },
    { name: "Consistency Across Surfaces", score: 7, status: "strong", diagnosis: "Tagline matches across LinkedIn, G2, and homepage.", fix: "Add the same tagline to Crunchbase and the press kit.", faq_suggestions: [] },
  ],
  simulator: [],
  action_plan: { this_week: [], this_month: [] },
};
