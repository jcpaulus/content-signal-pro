import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { runAudit } from "@/lib/analyze";
import { demoResult, demoCompetitorResult } from "@/lib/demoData";
import { LoadingScreen } from "@/components/LoadingScreen";
import { toast } from "sonner";
import { Search, BarChart3, Wrench, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const {
    apiKey,
    setKeyModalOpen,
    setResult,
    setCompetitorResult,
    setAnalyzedUrl,
    setCompetitorUrl,
    setIsDemo,
  } = useApp();
  const [url, setUrl] = useState("");
  const [competitor, setCompetitor] = useState("");
  const [loading, setLoading] = useState(false);

  const onAnalyze = async () => {
    if (!url.trim()) {
      toast.error("Please enter a website URL.");
      return;
    }
    if (!apiKey) {
      toast.message("Please enter your Anthropic API key to analyze this site.");
      setKeyModalOpen(true);
      return;
    }
    setLoading(true);
    setAnalyzedUrl(url);
    setCompetitorUrl(competitor);
    setIsDemo(false);
    try {
      const tasks: Promise<unknown>[] = [runAudit(apiKey, url)];
      if (competitor.trim()) tasks.push(runAudit(apiKey, competitor));
      const results = await Promise.all(tasks);
      setResult(results[0] as Awaited<ReturnType<typeof runAudit>>);
      setCompetitorResult(competitor.trim() ? (results[1] as Awaited<ReturnType<typeof runAudit>>) : null);
      navigate({ to: "/results" });
    } catch (e) {
      toast.error((e as Error).message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const onDemo = () => {
    setResult(demoResult);
    setCompetitorResult(demoCompetitorResult);
    setAnalyzedUrl(demoResult.url || "talentflowhr.example.com");
    setCompetitorUrl(demoCompetitorResult.url || "peoplehub.example.com");
    setIsDemo(true);
    navigate({ to: "/results" });
  };

  if (loading) {
    return (
      <div className="bg-background">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden px-4 pt-16 pb-20 sm:pt-24 sm:pb-28"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Generative Engine Optimization audit
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Is Your Website <span className="text-primary">Invisible</span> to AI?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
            60% of B2B buyers use AI to shortlist vendors before visiting your site.
            Find out if they can find you.
          </p>

          <div className="mx-auto mt-10 flex max-w-xl flex-col gap-3">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onAnalyze()}
              placeholder="Enter your website URL"
              className="h-12 text-base shadow-sm"
            />
            <Input
              type="url"
              value={competitor}
              onChange={(e) => setCompetitor(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onAnalyze()}
              placeholder="Compare with competitor (optional)"
              className="h-12 text-base shadow-sm"
            />
            <Button onClick={onAnalyze} size="lg" className="h-12 gap-2 px-6 text-base">
              Analyze My Site <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-3">
            <Button variant="ghost" onClick={onDemo} className="text-sm text-muted-foreground hover:text-primary">
              Try Demo →
            </Button>
          </div>
        </div>
      </section>

      {/* Flow icons */}
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: Search, title: "Analyze", desc: "We read your site the way an AI does." },
            { icon: BarChart3, title: "Score", desc: "7 GEO categories, scored 0–100." },
            { icon: Wrench, title: "Fix", desc: "Get a prioritized action plan." },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-base font-semibold">{title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
