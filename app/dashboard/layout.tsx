import type { ReactNode } from "react";
import { DemoControls } from "@/components/DemoControls";

/**
 * Dashboard-scoped layout. Ships the DemoControls floating panel alongside
 * any /dashboard route — kept off other pages because the panel's actions
 * (approve / resolve / toggle empty) only make sense in the dashboard's
 * pendingCount + activity-feed context.
 */
export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <DemoControls />
    </>
  );
}
