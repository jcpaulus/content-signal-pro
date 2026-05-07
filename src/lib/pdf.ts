import { jsPDF } from "jspdf";
import type { AuditResult, Category } from "./types";

// Brand palette
const NAVY: [number, number, number] = [15, 23, 42]; // #0F172A
const BLUE: [number, number, number] = [59, 130, 246]; // #3B82F6
const BLUE_SOFT: [number, number, number] = [219, 234, 254];
const WHITE: [number, number, number] = [255, 255, 255];
const MUTED: [number, number, number] = [100, 116, 139];
const BORDER: [number, number, number] = [226, 232, 240];
const BG_SOFT: [number, number, number] = [248, 250, 252];
const GREEN: [number, number, number] = [34, 197, 94];
const YELLOW: [number, number, number] = [234, 179, 8];
const RED: [number, number, number] = [239, 68, 68];

function scoreColor(score10: number): [number, number, number] {
  if (score10 >= 8) return GREEN;
  if (score10 >= 6) return YELLOW;
  return RED;
}
function scoreLabel(score10: number) {
  if (score10 >= 8) return "STRONG";
  if (score10 >= 6) return "MODERATE";
  return "WEAK";
}
function overallColor(score: number): [number, number, number] {
  if (score >= 75) return GREEN;
  if (score >= 50) return YELLOW;
  return RED;
}

export function exportPdf(result: AuditResult, url: string) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;
  const siteUrl = url || result.url || "";
  const company = result.company || siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const generated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let pageNum = 0;
  let y = margin;

  const setFill = (c: [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);
  const setText = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
  const setDraw = (c: [number, number, number]) => doc.setDrawColor(c[0], c[1], c[2]);

  const addPageChrome = () => {
    pageNum++;
    // Header bar
    setFill(NAVY);
    doc.rect(0, 0, pageW, 28, "F");
    // Logo dot
    setFill(BLUE);
    doc.circle(margin + 6, 14, 4, "F");
    setText(WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("CLEARSIGNAL", margin + 16, 17);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setText([200, 215, 235]);
    doc.text("GEO Audit Report", pageW - margin, 17, { align: "right" });

    // Footer
    setDraw(BORDER);
    doc.setLineWidth(0.5);
    doc.line(margin, pageH - 30, pageW - margin, pageH - 30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setText(MUTED);
    doc.text(company, margin, pageH - 16);
    doc.text(`Page ${pageNum}`, pageW - margin, pageH - 16, { align: "right" });

    y = 56;
  };

  const ensure = (h: number) => {
    if (y + h > pageH - 50) {
      doc.addPage();
      addPageChrome();
    }
  };

  const sectionTitle = (label: string, title: string) => {
    ensure(60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setText(BLUE);
    doc.text(label.toUpperCase(), margin, y);
    y += 14;
    doc.setFontSize(20);
    setText(NAVY);
    doc.text(title, margin, y);
    y += 8;
    setDraw(BLUE);
    doc.setLineWidth(2);
    doc.line(margin, y, margin + 36, y);
    y += 18;
  };

  const wrapText = (
    text: string,
    size: number,
    color: [number, number, number],
    bold = false,
    width = contentW,
    x = margin
  ) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    setText(color);
    const lines = doc.splitTextToSize(text, width);
    for (const line of lines) {
      ensure(size + 4);
      doc.text(line, x, y);
      y += size + 4;
    }
  };

  // ============= COVER PAGE =============
  setFill(NAVY);
  doc.rect(0, 0, pageW, pageH, "F");
  // Accent stripes
  setFill(BLUE);
  doc.rect(0, 0, 6, pageH, "F");
  doc.rect(pageW - 6, 0, 6, pageH, "F");

  // Logo
  setFill(BLUE);
  doc.circle(margin + 10, 80, 8, "F");
  setText(WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("CLEARSIGNAL", margin + 26, 84);

  // Title block
  setText(WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(42);
  doc.text("GEO Audit", margin, 200);
  doc.text("Report", margin, 248);

  doc.setDrawColor(BLUE[0], BLUE[1], BLUE[2]);
  doc.setLineWidth(3);
  doc.line(margin, 268, margin + 60, 268);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  setText([180, 200, 230]);
  doc.text("AI Visibility Assessment by ClearSignal", margin, 290);

  // Site card
  setFill([30, 41, 59]);
  doc.roundedRect(margin, 320, contentW, 70, 8, 8, "F");
  setText([148, 163, 184]);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("WEBSITE AUDITED", margin + 20, 342);
  setText(WHITE);
  doc.setFontSize(18);
  doc.text(siteUrl || company, margin + 20, 368);

  // Score ring
  const cx = pageW / 2;
  const cy = 510;
  const radius = 70;
  const score = result.overall_score;
  const ringColor = overallColor(score);
  // Track
  doc.setDrawColor(40, 55, 80);
  doc.setLineWidth(12);
  doc.circle(cx, cy, radius, "S");
  // Progress arc approximated with line segments
  doc.setDrawColor(ringColor[0], ringColor[1], ringColor[2]);
  doc.setLineWidth(12);
  const segs = 80;
  const portion = Math.max(0, Math.min(1, score / 100));
  const total = Math.floor(segs * portion);
  for (let i = 0; i < total; i++) {
    const a1 = -Math.PI / 2 + (i / segs) * Math.PI * 2;
    const a2 = -Math.PI / 2 + ((i + 1) / segs) * Math.PI * 2;
    doc.line(
      cx + Math.cos(a1) * radius,
      cy + Math.sin(a1) * radius,
      cx + Math.cos(a2) * radius,
      cy + Math.sin(a2) * radius
    );
  }
  setText(WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(48);
  doc.text(String(score), cx, cy + 8, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  setText([180, 200, 230]);
  doc.text("OUT OF 100", cx, cy + 30, { align: "center" });

  // Overall label badge
  setFill(ringColor);
  const badgeLabel = score >= 75 ? "STRONG VISIBILITY" : score >= 50 ? "MODERATE VISIBILITY" : "NEEDS ATTENTION";
  const bw = doc.getTextWidth(badgeLabel) + 24;
  doc.roundedRect(cx - bw / 2, cy + 50, bw, 22, 11, 11, "F");
  setText(WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(badgeLabel, cx, cy + 65, { align: "center" });

  // Footer of cover
  setText([148, 163, 184]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated ${generated}`, margin, pageH - 60);
  doc.text("CONFIDENTIAL", pageW - margin, pageH - 60, { align: "right" });

  // ============= EXECUTIVE SUMMARY =============
  doc.addPage();
  addPageChrome();
  sectionTitle("01 — Overview", "Executive Summary");

  wrapText(result.verdict, 11, NAVY, false);
  y += 10;

  // 3 highlight cards
  const strongest = [...result.categories].sort((a, b) => b.score - a.score)[0];
  const weakest = [...result.categories].sort((a, b) => a.score - b.score)[0];
  const priority = result.action_plan.this_week[0] || weakest?.fix || "Review the action plan";

  const cards = [
    { label: "BIGGEST STRENGTH", title: strongest?.name || "—", body: strongest?.diagnosis || "", color: GREEN },
    { label: "BIGGEST GAP", title: weakest?.name || "—", body: weakest?.diagnosis || "", color: RED },
    { label: "PRIORITY ACTION", title: "Do This Week", body: priority, color: BLUE },
  ];

  ensure(140);
  const cardW = (contentW - 16) / 3;
  const cardH = 130;
  const startY = y;
  cards.forEach((card, i) => {
    const x = margin + i * (cardW + 8);
    setFill(BG_SOFT);
    doc.roundedRect(x, startY, cardW, cardH, 6, 6, "F");
    setFill(card.color);
    doc.rect(x, startY, cardW, 3, "F");
    setText(card.color);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(card.label, x + 12, startY + 22);
    setText(NAVY);
    doc.setFontSize(13);
    const tLines = doc.splitTextToSize(card.title, cardW - 24);
    doc.text(tLines, x + 12, startY + 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setText(MUTED);
    const bLines = doc.splitTextToSize(card.body, cardW - 24);
    doc.text(bLines.slice(0, 5), x + 12, startY + 70);
  });
  y = startY + cardH + 24;

  // ============= SCORE BREAKDOWN =============
  ensure(40);
  sectionTitle("02 — Scores", "Category Breakdown");

  result.categories.forEach((c) => {
    ensure(58);
    // Name + score
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setText(NAVY);
    doc.text(c.name, margin, y);
    const col = scoreColor(c.score);
    setText(col);
    doc.setFontSize(11);
    doc.text(`${c.score}/10`, pageW - margin, y, { align: "right" });
    y += 8;
    // Bar background
    setFill(BORDER);
    doc.roundedRect(margin, y, contentW, 8, 4, 4, "F");
    // Bar fill
    setFill(col);
    const fillW = Math.max(8, (c.score / 10) * contentW);
    doc.roundedRect(margin, y, fillW, 8, 4, 4, "F");
    y += 16;
    // Diagnosis
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setText(MUTED);
    const dLines = doc.splitTextToSize(c.diagnosis, contentW);
    doc.text(dLines.slice(0, 2), margin, y);
    y += 9 * Math.min(2, dLines.length) + 12;
  });

  // ============= DETAILED FINDINGS =============
  doc.addPage();
  addPageChrome();
  sectionTitle("03 — Findings", "Detailed Analysis");

  result.categories.forEach((c: Category) => {
    ensure(120);
    const blockStart = y;
    // Card background
    setFill(WHITE);
    setDraw(BORDER);
    doc.setLineWidth(0.7);
    // We'll draw the border at the end after measuring; just draw header now.
    // Header strip
    setFill(NAVY);
    doc.roundedRect(margin, y, contentW, 32, 4, 4, "F");
    setText(WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(c.name, margin + 14, y + 20);
    // Score badge
    const col = scoreColor(c.score);
    const lbl = `${c.score}/10  •  ${scoreLabel(c.score)}`;
    const lblW = doc.getTextWidth(lbl) + 18;
    setFill(col);
    doc.roundedRect(pageW - margin - lblW - 8, y + 7, lblW, 18, 9, 9, "F");
    setText(WHITE);
    doc.setFontSize(9);
    doc.text(lbl, pageW - margin - lblW / 2 - 8, y + 19, { align: "center" });
    y += 44;

    // Diagnosis
    wrapText(c.diagnosis, 10, NAVY);
    y += 6;

    // Fix callout
    const fixLines = doc.splitTextToSize(c.fix, contentW - 28);
    const calloutH = 22 + fixLines.length * 13 + 10;
    ensure(calloutH + 10);
    setFill(BLUE_SOFT);
    doc.roundedRect(margin, y, contentW, calloutH, 4, 4, "F");
    setFill(BLUE);
    doc.rect(margin, y, 3, calloutH, "F");
    setText(BLUE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("RECOMMENDED FIX", margin + 14, y + 16);
    setText(NAVY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(fixLines, margin + 14, y + 32);
    y += calloutH + 18;
    void blockStart;
  });

  // ============= SIMULATOR =============
  doc.addPage();
  addPageChrome();
  sectionTitle("04 — Simulator", "AI Visibility Preview");
  wrapText(
    "How AI engines describe you today versus after applying the recommended fixes.",
    10,
    MUTED
  );
  y += 10;

  result.simulator.slice(0, 3).forEach((s) => {
    ensure(180);
    // Query bubble
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setText(MUTED);
    doc.text("BUYER QUERY", margin, y);
    y += 12;
    const qLines = doc.splitTextToSize(`"${s.query}"`, contentW - 28);
    const qH = qLines.length * 13 + 16;
    setFill(NAVY);
    doc.roundedRect(margin, y, contentW, qH, 6, 6, "F");
    setText(WHITE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(qLines, margin + 14, y + 18);
    y += qH + 14;

    // Before bubble
    const beforeLines = doc.splitTextToSize(s.current_response, contentW - 28);
    const beforeH = beforeLines.length * 12 + 28;
    ensure(beforeH + 10);
    setFill([241, 245, 249]);
    doc.roundedRect(margin, y, contentW, beforeH, 6, 6, "F");
    setText(MUTED);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("AI RESPONSE NOW", margin + 14, y + 16);
    setText([71, 85, 105]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(beforeLines, margin + 14, y + 32);
    y += beforeH + 10;

    // After bubble
    const afterLines = doc.splitTextToSize(s.optimized_response, contentW - 28);
    const afterH = afterLines.length * 12 + 28;
    ensure(afterH + 16);
    setFill([220, 252, 231]);
    doc.roundedRect(margin, y, contentW, afterH, 6, 6, "F");
    setFill(GREEN);
    doc.rect(margin, y, 3, afterH, "F");
    setText(GREEN);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("AI RESPONSE AFTER FIXES", margin + 14, y + 16);
    setText([22, 101, 52]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(afterLines, margin + 14, y + 32);
    y += afterH + 24;
  });

  // ============= ACTION PLAN =============
  doc.addPage();
  addPageChrome();
  sectionTitle("05 — Roadmap", "Your Action Plan");

  const drawChecklist = (title: string, subtitle: string, items: string[], accent: [number, number, number]) => {
    ensure(40);
    setFill(accent);
    doc.roundedRect(margin, y, 4, 18, 2, 2, "F");
    setText(NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title, margin + 14, y + 14);
    setText(MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(subtitle, margin + 14, y + 28);
    y += 40;

    items.forEach((item) => {
      const lines = doc.splitTextToSize(item, contentW - 36);
      const h = lines.length * 13 + 14;
      ensure(h + 4);
      setFill(BG_SOFT);
      doc.roundedRect(margin, y, contentW, h, 4, 4, "F");
      // Checkbox
      setDraw(accent);
      doc.setLineWidth(1.2);
      doc.roundedRect(margin + 12, y + h / 2 - 6, 12, 12, 2, 2, "S");
      setText(NAVY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(lines, margin + 34, y + 14);
      y += h + 8;
    });
    y += 14;
  };

  drawChecklist("Do This Week", "High impact, low effort", result.action_plan.this_week, GREEN);
  drawChecklist("Do This Month", "High impact, higher effort", result.action_plan.this_month, BLUE);

  // Closing note
  ensure(60);
  setFill(NAVY);
  doc.roundedRect(margin, y, contentW, 50, 6, 6, "F");
  setText(WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Ready to improve your AI visibility?", margin + 16, y + 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setText([180, 200, 230]);
  doc.text("Re-run your audit after implementing fixes to track score improvements.", margin + 16, y + 38);

  const safe = (siteUrl || "clearsignal").replace(/[^a-z0-9]+/gi, "_").slice(0, 40);
  doc.save(`clearsignal_${safe}.pdf`);
}
