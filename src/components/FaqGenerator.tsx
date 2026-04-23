import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { AuditResult, FaqItem } from "@/lib/types";
import { generateFaq } from "@/lib/analyze";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { Copy, Check, Sparkles, Loader2 } from "lucide-react";

export function FaqGenerator({ audit }: { audit: AuditResult }) {
  const { apiKey, setKeyModalOpen, isDemo } = useApp();
  const [items, setItems] = useState<FaqItem[]>(audit.faq ?? []);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const onGenerate = async () => {
    if (!apiKey) {
      toast.message("Please enter your Anthropic API key to generate the FAQ.");
      setKeyModalOpen(true);
      return;
    }
    setLoading(true);
    try {
      const faq = await generateFaq(apiKey, audit);
      setItems(faq);
    } catch (e) {
      toast.error((e as Error).message || "Failed to generate FAQ.");
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async () => {
    const text = items.map((i) => `Q: ${i.question}\nA: ${i.answer}`).join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("FAQ copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mb-16">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-bold">AI-Ready FAQ</h2>
        <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
          +15–20 GEO points
        </span>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Publish this FAQ page to improve your GEO score by an estimated +15–20 points. Each Q&amp;A is written so AI engines can quote it directly.
      </p>

      {items.length === 0 ? (
        <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary" />
          <p className="mb-4 text-sm text-muted-foreground">
            Generate 10 ready-to-publish Q&amp;A based on this audit.
          </p>
          <Button onClick={onGenerate} disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate AI-Ready FAQ
              </>
            )}
          </Button>
          {isDemo && (
            <p className="mt-3 text-xs text-muted-foreground">Demo mode — uses a sample FAQ.</p>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={onCopy} className="gap-2">
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy All"}
            </Button>
          </div>
          <ol className="space-y-5">
            {items.map((item, i) => (
              <li key={i} className="border-b pb-5 last:border-b-0 last:pb-0">
                <p className="text-sm font-semibold">
                  <span className="text-primary">Q{i + 1}:</span> {item.question}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">A:</span> {item.answer}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
