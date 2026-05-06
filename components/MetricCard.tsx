import { HudCard } from "@/components/ui/hud-card";
import { cn } from "@/lib/utils";

/**
 * KPI card for the Dashboard. Fixed 3-part layout:
 *   label (with decorative square) / big-serif value + unit / spacer / footer
 *
 * The card shell is a HudCard variant="stat" — gets the top-edge blue sheen
 * line and the hover border-darken + soft drop-shadow out of the box.
 */
export function MetricCard({
  label,
  value,
  unit,
  footer,
  className,
}: {
  label: string;
  value: string | number;
  unit?: string;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <HudCard
      variant="stat"
      className={cn("flex flex-col gap-3 p-4 md:min-h-[150px]", className)}
    >
      {/* Label row: 4x4 yellow square with deep-blue border + label text */}
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="h-[4px] w-[4px] shrink-0"
          style={{
            background: "var(--yellow)",
            border: "1px solid var(--ikea-blue-darker)",
          }}
        />
        <span
          className="text-[12px]"
          style={{
            color: "var(--text-mid)",
            letterSpacing: "0.1em",
            fontFamily: "var(--font-noto-sans-tc), sans-serif",
          }}
        >
          {label}
        </span>
      </div>

      {/* Big serif value + mono unit */}
      <div className="flex items-baseline gap-2">
        <span
          className="text-[38px] font-normal leading-none tabular-nums md:text-[44px]"
          style={{
            color: "var(--headline)",
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            className="text-[13px] font-mono"
            style={{ color: "var(--text-mid)" }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Desktop keeps KPI footers aligned in the bento grid. Mobile keeps
          the footer close to the value so tall cards do not read as empty. */}
      <div className="hidden flex-1 md:block" />

      {footer && <div>{footer}</div>}
    </HudCard>
  );
}

// --------------- Footer sub-components ---------------

/**
 * 7-bar sparkline. Default pattern (30/50/40/70/60/90/100) shows a rising
 * trend; last two bars render in --ikea-blue ("today + yesterday" emphasis),
 * earlier bars in --bg-accent as light-blue history.
 */
export function MiniBars({
  values = [30, 50, 40, 70, 60, 90, 100],
}: {
  values?: number[];
}) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-[3px] h-[30px] flex-1">
      {values.map((v, i) => {
        const isActive = i >= values.length - 2;
        return (
          <div
            key={i}
            className="flex-1 min-h-[4px]"
            style={{
              height: `${Math.max(10, (v / max) * 100)}%`,
              background: isActive ? "var(--ikea-blue)" : "var(--bg-accent)",
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * Delta pill — light-blue chip for day-over-day comparison. The "positive"
 * label in the v9 spec was always "good news", not literally yellow; under the
 * IKEA palette that's a blue-tinted confirmation, not a signal flag.
 */
export function DeltaPill({
  direction,
  value,
}: {
  direction: "up" | "down";
  value: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-mono font-semibold tabular-nums"
      style={{
        color: "var(--ikea-blue-darker)",
        background: "var(--bg-accent)",
        border: "1px solid var(--ikea-blue)",
      }}
    >
      {direction === "down" ? "↓" : "↑"} {value}
    </span>
  );
}

/**
 * Mini donut — 38x38 SVG ring. Track in --bg-accent, progress in --ikea-blue,
 * rounded stroke cap. r=16 → circumference ~= 100.5, so stroke-dashoffset
 * corresponds roughly to the remaining percentage in absolute units.
 */
export function MiniDonut({ pct }: { pct: number }) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = circ * (1 - clamped / 100);
  return (
    <div className="h-[38px] w-[38px] shrink-0">
      <svg
        width="38"
        height="38"
        viewBox="0 0 40 40"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke="var(--bg-accent)"
          strokeWidth="3"
        />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke="var(--ikea-blue)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
    </div>
  );
}

/**
 * Budget bar — 4px horizontal track with a percentage fill. Replaces the
 * earlier ProgressTrack component; renamed for clarity (used in the
 * "本月累積" card to show budget utilisation, not generic progress).
 */
export function BudgetBar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div
      className="h-[4px] w-full overflow-hidden"
      style={{ background: "var(--bg-accent)" }}
    >
      <div
        className="h-full transition-all"
        style={{
          width: `${clamped}%`,
          background: "var(--ikea-blue)",
        }}
      />
    </div>
  );
}
