import { useState } from "react";
import type { Category } from "@/lib/types";
import { ChevronDown, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS = {
  strong: {
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    icon: CheckCircle2,
    label: "Strong",
  },
  weak: {
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/40",
    icon: AlertTriangle,
    label: "Needs work",
  },
  missing: {
    color: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/30",
    icon: XCircle,
    label: "Missing",
  },
} as const;

export function CategoryCard({ category, index }: { category: Category; index: number }) {
  const [open, setOpen] = useState(false);
  const meta = STATUS[category.status];
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "animate-fade-up rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md",
        meta.border
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("flex h-7 w-7 items-center justify-center rounded-md", meta.bg)}>
              <Icon className={cn("h-4 w-4", meta.color)} />
            </span>
            <h3 className="text-sm font-semibold">{category.name}</h3>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{category.diagnosis}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={cn("text-2xl font-bold tabular-nums", meta.color)}>
            {category.score}
            <span className="text-sm text-muted-foreground">/10</span>
          </div>
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
          />
        </div>
      </button>
      {open && (
        <div className="mt-4 space-y-3 border-t pt-4 animate-fade-up">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Quick fix
            </div>
            <p className="mt-1 text-sm">{category.fix}</p>
          </div>
          {category.faq_suggestions && category.faq_suggestions.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Suggested FAQ questions
              </div>
              <ul className="mt-2 space-y-1.5">
                {category.faq_suggestions.map((q, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-primary">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
