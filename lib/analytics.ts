import { AnalyticsEvent } from "@/types";

export function trackEvent(
  event: AnalyticsEvent["event"],
  payload: Record<string, unknown>
): void {
  const eventData: AnalyticsEvent = {
    event,
    payload,
    timestamp: new Date().toISOString(),
  };

  // Structured client logging per Section 35 of PRD
  if (process.env.NODE_ENV !== "production") {
    console.info(
      `%c[AURA ANALYTICS] %c${event}`,
      "color: #1F4E43; font-weight: bold;",
      "color: #14171A; font-weight: normal;",
      eventData
    );
  }

  // Dispatch custom window event if in browser
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("aura:analytics", { detail: eventData }));
  }
}
