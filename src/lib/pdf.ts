import { jsPDF } from "jspdf";
import type { AuditResult } from "./types";

export function exportPdf(result: AuditResult, url: string) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const ensure = (h: number) => {
    if (y + h > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const heading = (text: string, size = 18) => {
    ensure(size + 12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(27, 42, 74);
    doc.text(text, margin, y);
    y += size + 8;
  };

  const para = (text: string, size = 10, color: [number, number, number] = [40, 40, 40]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxWidth);
    for (const line of lines) {
      ensure(size + 4);
      doc.text(line, margin, y);
      y += size + 4;
    }
  };

  // Title
  heading("ClearSignal — GEO Audit Report", 22);
  para(url || result.url || "", 10, [100, 100, 100]);
  y += 6;

  heading(`Overall score: ${result.overall_score} / 100`, 16);
  para(result.verdict);
  y += 10;

  heading("Category scores", 14);
  for (const c of result.categories) {
    ensure(50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(27, 42, 74);
    doc.text(`${c.name} — ${c.score}/10 (${c.status})`, margin, y);
    y += 14;
    para(`Diagnosis: ${c.diagnosis}`);
    para(`Fix: ${c.fix}`);
    if (c.faq_suggestions?.length) {
      para("Suggested FAQ questions:", 10, [60, 60, 60]);
      for (const q of c.faq_suggestions) para(`  • ${q}`);
    }
    y += 6;
  }

  heading("AI visibility simulator", 14);
  for (const s of result.simulator) {
    ensure(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(27, 42, 74);
    doc.text(`Query: ${s.query}`, margin, y);
    y += 14;
    para(`Now: ${s.current_response}`);
    para(`After fixes: ${s.optimized_response}`);
    y += 6;
  }

  heading("Action plan", 14);
  para("Do this week:", 11, [27, 42, 74]);
  for (const i of result.action_plan.this_week) para(`  • ${i}`);
  y += 6;
  para("Do this month:", 11, [27, 42, 74]);
  for (const i of result.action_plan.this_month) para(`  • ${i}`);

  const safe = (url || "clearsignal").replace(/[^a-z0-9]+/gi, "_").slice(0, 40);
  doc.save(`clearsignal_${safe}.pdf`);
}
