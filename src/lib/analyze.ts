import Anthropic from "@anthropic-ai/sdk";
import type { AuditResult, FaqItem } from "./types";

const PROMPT = `You are a GEO (Generative Engine Optimization) analyst.
Analyze this website content and return ONLY a valid JSON object with this exact structure:
{
  "overall_score": number (0-100),
  "verdict": string (one sentence),
  "categories": [
    {
      "name": string,
      "score": number (0-10),
      "status": "strong" | "weak" | "missing",
      "diagnosis": string (one sentence),
      "fix": string (one to two sentences),
      "faq_suggestions": string[] (5 items, only for FAQ category, empty array for others)
    }
  ],
  "simulator": [
    {
      "query": string,
      "current_response": string (2-3 sentences),
      "optimized_response": string (2-3 sentences)
    }
  ],
  "action_plan": {
    "this_week": string[] (3-4 items),
    "this_month": string[] (3-4 items)
  }
}

The 7 categories MUST be, in this exact order:
1. Positioning Clarity
2. Category Language
3. Proof & Trust Signals
4. FAQ / Buyer-Question Coverage
5. Pricing & Comparison Content
6. Third-Party Reinforcement
7. Consistency Across Surfaces

Provide exactly 3 simulator queries that a real B2B buyer might ask an AI assistant about this company or its category.

Return only valid JSON. No markdown. No explanation. No backticks.

Website content to analyze:
`;

type ProxyAttempt = {
  make: (u: string) => string;
  parse: (raw: string) => string;
};

const PROXIES: ProxyAttempt[] = [
  {
    make: (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    parse: (raw) => raw,
  },
  {
    make: (u) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
    parse: (raw) => {
      try {
        const json = JSON.parse(raw) as { contents?: string };
        return json.contents ?? "";
      } catch {
        return "";
      }
    },
  },
];

export async function fetchSiteContent(url: string): Promise<string | null> {
  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) normalized = "https://" + normalized;

  for (const { make, parse } of PROXIES) {
    try {
      const res = await fetch(make(normalized));
      if (!res.ok) continue;
      const raw = await res.text();
      const html = parse(raw);
      if (!html) continue;
      return extractText(html).slice(0, 18000);
    } catch {
      // try next proxy
    }
  }
  return null;
}

function extractText(html: string): string {
  const noScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  // Keep title + meta description prominent
  const titleMatch = noScripts.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch = noScripts.match(
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["']/i
  );
  const ogTitle = noScripts.match(
    /<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']+)["']/i
  );
  const ogDesc = noScripts.match(
    /<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']+)["']/i
  );
  const headerLine = [
    titleMatch && `TITLE: ${titleMatch[1]}`,
    descMatch && `META DESCRIPTION: ${descMatch[1]}`,
    ogTitle && `OG TITLE: ${ogTitle[1]}`,
    ogDesc && `OG DESCRIPTION: ${ogDesc[1]}`,
  ]
    .filter(Boolean)
    .join("\n");

  const text = noScripts
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  return `${headerLine}\n\nBODY:\n${text}`;
}

export async function runAudit(apiKey: string, url: string): Promise<AuditResult> {
  const content = await fetchSiteContent(url);

  const userContent = content
    ? PROMPT + content
    : PROMPT +
      `NOTE: The website content could not be fetched directly (the site blocks scrapers or all proxies failed). ` +
      `Use your training knowledge about this website/company to generate a realistic GEO audit. ` +
      `If you do not recognize the site, infer plausible content from the domain name and still produce a realistic, useful audit.\n\n` +
      `URL: ${url}`;

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const msg = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: userContent,
      },
    ],
  });

  const textBlock = msg.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Empty response from Claude.");
  }
  let raw = textBlock.text.trim();
  if (raw.startsWith("```")) {
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  }
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Could not parse JSON from Claude response.");
  const jsonStr = raw.slice(start, end + 1);
  const parsed = JSON.parse(jsonStr) as AuditResult;
  parsed.url = url;
  return parsed;
}

const FAQ_PROMPT = `You are a GEO expert. Based on the following audit data for a company, generate exactly 10 FAQ questions and answers that an AI system (ChatGPT, Claude, Perplexity) could easily quote when buyers ask about this company or its category.

Rules:
- Each answer should be 2-3 sentences, factual, quotable, and self-contained.
- Mix branded questions ("What is X?", "How much does X cost?") with category questions ("Best HRIS for SEA startups?").
- Write answers as if they will be published verbatim on the company's FAQ page.
- Return ONLY valid JSON in this exact shape, no markdown, no backticks:
{ "faq": [ { "question": "...", "answer": "..." } ] }

Audit data:
`;

export async function generateFaq(apiKey: string, audit: AuditResult): Promise<FaqItem[]> {
  const summary = JSON.stringify(
    {
      company: audit.company,
      url: audit.url,
      verdict: audit.verdict,
      categories: audit.categories.map((c) => ({
        name: c.name,
        score: c.score,
        diagnosis: c.diagnosis,
      })),
      simulator: audit.simulator,
    },
    null,
    2
  );

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const msg = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 3000,
    messages: [{ role: "user", content: FAQ_PROMPT + summary }],
  });
  const textBlock = msg.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error("Empty FAQ response.");
  let raw = textBlock.text.trim();
  if (raw.startsWith("```")) raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Could not parse FAQ JSON.");
  const parsed = JSON.parse(raw.slice(start, end + 1)) as { faq: FaqItem[] };
  return parsed.faq;
}
