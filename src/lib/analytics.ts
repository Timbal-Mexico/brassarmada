// Analytics utility — ready to connect to GA4/GTM
// Replace with actual implementation when analytics is configured

type AnalyticsEvent =
  | "click_availability"
  | "lead_submit"
  | "whatsapp_click"
  | "band_page_view";

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(event: AnalyticsEvent, params?: EventParams) {
  // Log in development
  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${event}`, params);
  }

  // GA4 via gtag (uncomment when GA is configured)
  // if (typeof window !== 'undefined' && (window as any).gtag) {
  //   (window as any).gtag('event', event, params);
  // }

  // GTM dataLayer (uncomment when GTM is configured)
  // if (typeof window !== 'undefined' && (window as any).dataLayer) {
  //   (window as any).dataLayer.push({ event, ...params });
  // }
}

export function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    page_url: window.location.href,
  };
}
