import * as React from "react";
import { cn } from "@/lib/utils";

type HudCardVariant = "default" | "hero" | "stat";

function HudCard({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: HudCardVariant }) {
  return (
    <div
      data-slot="hud-card"
      data-variant={variant}
      className={cn(
        "hud-card",
        variant === "hero" && "hud-card--hero",
        variant === "stat" && "hud-card--stat",
        className,
      )}
      {...props}
    />
  );
}

export { HudCard };
export type { HudCardVariant };
