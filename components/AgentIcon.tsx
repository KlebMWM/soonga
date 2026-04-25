import { Bot, Brain, LucideIcon, Newspaper, Plane, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type AgentMeta = {
  icon: LucideIcon;
  /** Base solid color — used as fallback fill or for hex-sensitive contexts. */
  color: string;
  /** Pre-built 135deg gradient (base → darker) for HUD-style avatars. */
  gradient: string;
  /** Pre-built box-shadow string — subtle colored glow matching the agent hue. */
  glow: string;
  /** Two-letter abbreviation, retained for accessibility and legacy fallbacks. */
  label: string;
  /** Human-readable display name. Lookup key is the canonical id ("ResearchBot"
   *  etc.); displayName is what the UI actually renders ("Kai"). */
  displayName: string;
};

// Canonical ids stay (ResearchBot / TravelAgent / etc.) to avoid breaking
// references in mockData / simulator. Display names are short, human, and
// shown wherever the agent surfaces in the UI. Kai swaps from sage to
// terracotta so sage stays reserved for the "auto-approved" system signal.
const AGENT_MAP: Record<string, AgentMeta> = {
  ResearchBot: {
    icon: Brain,
    color: "#a86a4f",
    gradient: "linear-gradient(135deg, #a86a4f, #8a4f3a)",
    glow: "0 0 14px rgba(168, 106, 79, 0.3)",
    label: "Ka",
    displayName: "Kai",
  },
  TravelAgent: {
    icon: Plane,
    color: "#7a8ba0",
    gradient: "linear-gradient(135deg, #7a8ba0, #5c6b82)",
    glow: "0 0 14px rgba(122, 139, 160, 0.3)",
    label: "Ma",
    displayName: "Maya",
  },
  ShoppingBot: {
    icon: ShoppingBag,
    color: "#e07856",
    gradient: "linear-gradient(135deg, #e07856, #c05f3f)",
    glow: "0 0 14px rgba(224, 120, 86, 0.3)",
    label: "Ri",
    displayName: "Rin",
  },
  NewsletterCurator: {
    icon: Newspaper,
    color: "#a06a8f",
    gradient: "linear-gradient(135deg, #a06a8f, #854c76)",
    glow: "0 0 14px rgba(160, 106, 143, 0.3)",
    label: "Lu",
    displayName: "Lumi",
  },
};

const FALLBACK: AgentMeta = {
  icon: Bot,
  color: "#6b6860",
  gradient: "linear-gradient(135deg, #6b6860, #4a4a44)",
  glow: "0 0 14px rgba(107, 104, 96, 0.25)",
  label: "AI",
  displayName: "Agent",
};

export function getAgentColor(agent: string): string {
  return (AGENT_MAP[agent] ?? FALLBACK).color;
}

export function getAgentGradient(agent: string): string {
  return (AGENT_MAP[agent] ?? FALLBACK).gradient;
}

export function getAgentGlow(agent: string): string {
  return (AGENT_MAP[agent] ?? FALLBACK).glow;
}

export function getAgentDisplay(agent: string): string {
  return (AGENT_MAP[agent] ?? FALLBACK).displayName;
}

type Size = "xs" | "sm" | "md" | "lg";

const SIZE_CLASS: Record<Size, string> = {
  xs: "h-6 w-6 rounded-md [&_svg]:h-3 [&_svg]:w-3",
  sm: "h-7 w-7 rounded-md [&_svg]:h-3.5 [&_svg]:w-3.5",
  md: "h-9 w-9 rounded-lg [&_svg]:h-4 [&_svg]:w-4",
  lg: "h-11 w-11 rounded-lg [&_svg]:h-5 [&_svg]:w-5",
};

export function AgentIcon({
  agent,
  size = "md",
  outlined = false,
  className,
}: {
  agent: string;
  size?: Size;
  /** When true, draws a 1px same-color ring offset 2px outside the icon at
      25% opacity — used in the activity list to separate adjacent icons and
      give a subtle "focused tile" feel without adding another visible edge. */
  outlined?: boolean;
  className?: string;
}) {
  const meta = AGENT_MAP[agent] ?? FALLBACK;
  const Icon = meta.icon;
  const style: React.CSSProperties & Record<string, string> = {
    background: meta.gradient,
    boxShadow: meta.glow,
  };
  if (outlined) {
    // Custom property consumed by the ::before rule on .agent-icon-ring so
    // each instance can carry its own colour without a per-agent CSS rule.
    style["--agent-ring"] = meta.color;
  }
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center text-white",
        SIZE_CLASS[size],
        outlined && "relative agent-icon-ring",
        className,
      )}
      style={style}
      aria-label={agent}
    >
      <Icon strokeWidth={2} />
    </div>
  );
}
