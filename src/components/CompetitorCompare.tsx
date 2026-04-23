import type { AuditResult } from "@/lib/types";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

function color(score: number) {
  if (score >= 7) return "text-success";
  if (score >= 4) return "text-warning";
  return "text-danger";
}

export function CompetitorCompare({
  you,
  competitor,
  yourUrl,
  competitorUrl,
}: {
  you: AuditResult;
  competitor: AuditResult;
  yourUrl: string;
  competitorUrl: string;
}) {
  const wins = you.categories.reduce((acc, cat, i) => {
    const compCat = competitor.categories[i];
    if (!compCat) return acc;
    return acc + (cat.score > compCat.score ? 1 : 0);
  }, 0);

  return (
    <section className="mb-12">
      <h2 className="mb-1 text-xl font-bold">Competitor comparison</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        You outperform your competitor in <span className="font-semibold text-foreground">{wins} out of 7</span> categories.
      </p>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b bg-muted/40 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid-cols-[1fr_1fr_1fr]">
          <div>Category</div>
          <div className="text-right sm:text-center">
            <div className="text-foreground">Your site</div>
            <div className="truncate text-[10px] font-normal normal-case text-muted-foreground">{yourUrl}</div>
          </div>
          <div className="text-right sm:text-center">
            <div className="text-foreground">Competitor</div>
            <div className="truncate text-[10px] font-normal normal-case text-muted-foreground">{competitorUrl}</div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b bg-primary/5 px-5 py-4 text-sm sm:grid-cols-[1fr_1fr_1fr]">
          <div className="font-semibold">Overall GEO score</div>
          <div className={cn("flex items-center justify-end gap-2 sm:justify-center", color(you.overall_score / 10))}>
            <span className="text-xl font-bold tabular-nums">{you.overall_score}</span>
            {you.overall_score > competitor.overall_score && <Check className="h-4 w-4 text-success" />}
          </div>
          <div className={cn("flex items-center justify-end gap-2 sm:justify-center", color(competitor.overall_score / 10))}>
            <span className="text-xl font-bold tabular-nums">{competitor.overall_score}</span>
            {competitor.overall_score > you.overall_score && <Check className="h-4 w-4 text-success" />}
          </div>
        </div>

        {you.categories.map((cat, i) => {
          const c = competitor.categories[i];
          if (!c) return null;
          const youWin = cat.score > c.score;
          const compWin = c.score > cat.score;
          return (
            <div
              key={cat.name}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b px-5 py-3 text-sm last:border-b-0 sm:grid-cols-[1fr_1fr_1fr]"
            >
              <div className="font-medium">{cat.name}</div>
              <div className={cn("flex items-center justify-end gap-2 sm:justify-center", color(cat.score))}>
                <span className="font-semibold tabular-nums">{cat.score}<span className="text-xs text-muted-foreground">/10</span></span>
                {youWin && <Check className="h-4 w-4 text-success" />}
              </div>
              <div className={cn("flex items-center justify-end gap-2 sm:justify-center", color(c.score))}>
                <span className="font-semibold tabular-nums">{c.score}<span className="text-xs text-muted-foreground">/10</span></span>
                {compWin && <Check className="h-4 w-4 text-success" />}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
