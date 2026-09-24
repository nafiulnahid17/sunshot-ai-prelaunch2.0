import { NextResponse } from "next/server";

const replies = [
  {
    terms: ["benchmark", "elo", "score", "gdpval"],
    answer: "Sunshot AI has a 1203 Elo result in its internal GDPVal-AA v2 evaluation. The current experimental targets also include MMLU-Pro 79.4%, LegalBench 86.2%, HumanEval+ 84.1%, Bangla Reasoning 88.6%, GPQA Diamond 68.7% and Source-Grounded QA 91.3%. These are development-stage figures and are not yet independently verified.",
  },
  {
    terms: ["architecture", "parameter", "moe", "layer", "expert"],
    answer: "The development concept uses a 48B-parameter Hybrid Mixture-of-Experts Transformer with about 12B active parameters per token, 56 layers, 8 experts and 2 active experts per token. Its context target is 128K native, with experimental extension to 256K.",
  },
  {
    terms: ["speed", "token", "latency", "fast", "performance"],
    answer: "The current inference targets are 0.6–1.8 seconds to first token, 75–140 tokens per second, roughly 1–3 seconds for a simple query and 4–15 seconds for complex reasoning. Final performance depends on production infrastructure and testing.",
  },
  {
    terms: ["gpu", "compute", "h100", "server", "memory"],
    answer: "The example high-performance inference configuration is 2× NVIDIA H100 SXM 80GB, for 160GB HBM3 and an approximately 1.9 PFLOPS-class FP8 accelerator setup, supported by AMD EPYC-class CPU, 512GB DDR5 ECC and NVMe storage.",
  },
  {
    terms: ["price", "pricing", "cost", "cheap", "api"],
    answer: "Sunshot is targeting up to 50% lower cost through intelligent routing. Explored API pricing starts at $0.30 input and $1.20 output per 1M tokens for Standard, $0.75/$3.00 for Reasoning and $0.90/$3.50 for Legal. Final pricing will follow infrastructure testing.",
  },
  {
    terms: ["legal", "law", "lexglobal", "jurisdiction"],
    answer: "Sunshot’s legal layer is planned around jurisdiction detection, citation-aware retrieval, cross-jurisdiction understanding and a confidence gate. Dedicated legal document creation and advanced case analysis remain LexGlobal BD capabilities; Sunshot provides the intelligence foundation.",
  },
  {
    terms: ["language", "bangla", "banglish", "english"],
    answer: "Sunshot is being optimized for Bangla, English, Bangla↔English reasoning and natural Banglish, including mixed legal or technical terminology within the same conversation.",
  },
  {
    terms: ["image", "multimodal", "pdf", "vision", "file"],
    answer: "The planned multimodal system accepts text, images, PDFs, charts, screenshots and structured files. Outputs can include natural-language answers, tables, code, research summaries, source-linked responses and AI-generated images.",
  },
  {
    terms: ["water", "nature", "environment", "energy"],
    answer: "Sunshot follows a retrieval-first data strategy intended to reduce repeated full-model retraining and its associated compute demand. The application does not claim literal zero-water infrastructure: external data centres may still use electricity and water for cooling.",
  },
  {
    terms: ["inventor", "nahid", "founder", "creator", "who"],
    answer: "Sunshot AI was invented by Md. Nahid Alom, Founder & Director of Atherious Labs and LexGlobal BD. He studies CSE at North Bengal International University, and his technology journey has been featured across 57+ local and international news outlets.",
  },
  {
    terms: ["team", "raihan", "munira", "rafikul", "developer"],
    answer: "The development and research team includes Md. Nahid Alom as Project Lead and Principal Developer; Raihan Naim as Assistant Research Director and AI Systems Development Lead; Munira Khatun as Dataset and AI Integration Engineer; and Rafikul Islam as API Integration and Product Operations Developer.",
  },
  {
    terms: ["launch", "release", "when", "date", "october"],
    answer: "The target launch window for Sunshot AI is the last week of October 2026. It remains a development target and may change if readiness or infrastructure testing requires it.",
  },
  {
    terms: ["privacy", "safety", "secure", "security"],
    answer: "The planned architecture includes TLS transmission, AES-256 storage, temporary processing, history controls, training opt-out, PII redaction, prompt-injection detection and output safety checks. Final policies will be published before release.",
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json() as { message?: unknown; language?: unknown };
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!message || message.length > 1000) {
      return NextResponse.json({ error: "Ask a short question about Sunshot AI." }, { status: 400 });
    }

    const normalized = message.toLowerCase();
    const match = replies.find((entry) => entry.terms.some((term) => normalized.includes(term)));
    const answer = match?.answer ?? "I can explain Sunshot AI’s architecture, benchmarks, pricing, legal intelligence, multilingual features, launch plan, privacy approach, LexGlobal BD integration, inventor profile or development team.";
    const language = typeof body.language === "string" ? body.language : "en";
    return NextResponse.json({ answer: await translateAnswer(answer, language) });
  } catch {
    return NextResponse.json({ error: "I couldn’t process that question." }, { status: 400 });
  }
}

async function translateAnswer(text: string, language: string) {
  if (!language || language === "en") return text;
  try {
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", "en");
    url.searchParams.set("tl", language);
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", text);
    const response = await fetch(url, { headers: { "User-Agent": "SunshotAI/1.0" } });
    if (!response.ok) return text;
    const data = await response.json() as Array<Array<Array<string>>>;
    return data[0]?.map((part) => part[0]).join("") || text;
  } catch {
    return text;
  }
}
