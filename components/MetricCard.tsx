import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  unit,
  sub,
  visual,
  className,
}: {
  label: string;
  value: string | number;
  unit?: string;
  sub?: React.ReactNode;
  visual?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("p-5 flex flex-col gap-3 min-h-[140px]", className)}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>

      <div className="flex-1 flex items-end gap-2">
        <span className="text-[40px] leading-none font-semibold tabular-nums text-foreground">
          {value}
        </span>
        {unit && <span className="text-sm text-muted-foreground mb-1">{unit}</span>}
      </div>

      {visual && <div>{visual}</div>}

      {sub && <div className="text-[12px] text-muted-foreground leading-snug">{sub}</div>}
    </Card>
  );
}

// --------------- Visual sub-components ---------------

export function MiniBars({ values, highlightLast = 2 }: { values: number[]; highlightLast?: number }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-1 h-6">
      {values.map((v, i) => {
        const isHighlight = i >= values.length - highlightLast;
        return (
          <div
            key={i}
            className={cn(
              "w-1.5 rounded-sm transition-colors",
              isHighlight ? "bg-foreground" : "bg-muted-foreground/30",
            )}
            style={{ height: `${Math.max(10, (v / max) * 100)}%` }}
          />
        );
      })}
    </div>
  );
}

export function DeltaPill({
  direction,
  value,
}: {
  direction: "up" | "down";
  value: string;
}) {
  const isDown = direction === "down";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
        isDown ? "bg-success/15 text-success" : "bg-accent/15 text-accent",
      )}
    >
      {isDown ? "↓" : "↑"} {value}
    </span>
  );
}

export function ProgressTrack({ pct }: { pct: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full bg-foreground transition-all"
        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </div>
  );
}
