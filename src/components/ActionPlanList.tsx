import { useState } from "react";
import type { ActionPlan } from "@/lib/types";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

function Group({ title, subtitle, items, accent }: { title: string; subtitle: string; items: string[]; accent: string }) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className={cn("mb-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold", accent)}>
        {title}
      </div>
      <p className="mb-4 text-sm text-muted-foreground">{subtitle}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i}>
            <button
              onClick={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
              className="flex w-full items-start gap-3 rounded-md p-2 text-left transition-colors hover:bg-secondary"
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-colors",
                  done[i] ? "border-success bg-success text-success-foreground" : "border-border bg-background"
                )}
              >
                {done[i] && <Check className="h-3.5 w-3.5" />}
              </span>
              <span className={cn("text-sm", done[i] && "text-muted-foreground line-through")}>{item}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ActionPlanList({ plan }: { plan: ActionPlan }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Group
        title="Do This Week"
        subtitle="High impact, low effort"
        items={plan.this_week}
        accent="bg-success/15 text-success"
      />
      <Group
        title="Do This Month"
        subtitle="High impact, higher effort"
        items={plan.this_month}
        accent="bg-primary/15 text-primary"
      />
    </div>
  );
}
