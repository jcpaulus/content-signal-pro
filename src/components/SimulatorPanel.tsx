import type { SimulatorItem } from "@/lib/types";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function SimulatorPanel({ items }: { items: SimulatorItem[] }) {
  return (
    <div className="space-y-6">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border bg-card p-5 shadow-sm animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="mb-4 text-sm font-medium text-muted-foreground">
            Buyer query
          </div>
          <h4 className="mb-4 text-base font-semibold">"{item.query}"</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-warning/40 bg-warning/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-warning">
                <AlertTriangle className="h-4 w-4" />
                How AI describes you NOW
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">{item.current_response}</p>
            </div>
            <div className="rounded-lg border border-success/40 bg-success/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-success">
                <CheckCircle2 className="h-4 w-4" />
                How AI could describe you AFTER fixes
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">{item.optimized_response}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
