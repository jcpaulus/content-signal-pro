import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { ScoreCircle } from "@/components/ScoreCircle";
import { CategoryCard } from "@/components/CategoryCard";
import { SimulatorPanel } from "@/components/SimulatorPanel";
import { ActionPlanList } from "@/components/ActionPlanList";
import { CompetitorCompare } from "@/components/CompetitorCompare";
import { FaqGenerator } from "@/components/FaqGenerator";
import { Button } from "@/components/ui/button";
import { exportPdf } from "@/lib/pdf";
import { Download, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
});

function verdictColor(score: number) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-danger";
}

function ResultsPage() {
  const { result, competitorResult, analyzedUrl, competitorUrl, isDemo } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!result) navigate({ to: "/" });
  }, [result, navigate]);

  if (!result) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 gap-1 text-muted-foreground"
            onClick={() => navigate({ to: "/" })}
          >
            <ArrowLeft className="h-4 w-4" /> New analysis
          </Button>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            GEO Audit{isDemo && <span className="ml-2 rounded-full bg-warning/20 px-2 py-0.5 text-xs font-semibold text-warning">DEMO</span>}
          </h1>
          <p className="text-sm text-muted-foreground">
            {result.company ? `${result.company} — ` : ""}{analyzedUrl}
          </p>
        </div>
        <Button onClick={() => exportPdf(result, analyzedUrl)} className="gap-2">
          <Download className="h-4 w-4" /> Download PDF Report
        </Button>
      </div>

      {/* A — Overall score */}
      <section className="mb-12 rounded-2xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-10">
          <div className="animate-score-pop">
            <ScoreCircle score={result.overall_score} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Overall AI visibility
            </div>
            <p className={`mt-2 text-xl font-semibold leading-snug ${verdictColor(result.overall_score)}`}>
              {result.verdict}
            </p>
          </div>
        </div>
      </section>

      {/* B — Categories */}
      <section className="mb-12">
        <h2 className="mb-1 text-xl font-bold">Category breakdown</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Click any card to see the detailed diagnosis and fix.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.categories.map((c, i) => (
            <CategoryCard key={c.name} category={c} index={i} />
          ))}
        </div>
      </section>

      {competitorResult && (
        <CompetitorCompare
          you={result}
          competitor={competitorResult}
          yourUrl={analyzedUrl}
          competitorUrl={competitorUrl}
        />
      )}

      {/* C — Simulator */}
      <section className="mb-12">
        <h2 className="mb-1 text-xl font-bold">AI visibility simulator</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          How AI engines describe you today vs. after applying the fixes below.
        </p>
        <SimulatorPanel items={result.simulator} />
      </section>

      {/* D — Action plan */}
      <section className="mb-16">
        <h2 className="mb-1 text-xl font-bold">Your action plan</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Check things off as you go — your progress stays on this page.
        </p>
        <ActionPlanList plan={result.action_plan} />
      </section>

      {/* E — FAQ generator */}
      <FaqGenerator audit={result} />
    </div>
  );
}
