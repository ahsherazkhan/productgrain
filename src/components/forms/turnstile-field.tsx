"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { ShieldCheck } from "lucide-react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void; theme: "light"; size: "flexible" }) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

export type TurnstileHandle = { reset: () => void };

export const TurnstileField = forwardRef<TurnstileHandle, { onToken: (token: string) => void }>(function TurnstileField({ onToken }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;
    let widgetId: string | undefined;
    const render = () => {
      if (!window.turnstile || !containerRef.current || widgetId) return;
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onToken,
        "expired-callback": () => onToken(""),
        theme: "light",
        size: "flexible",
      });
      widgetIdRef.current = widgetId;
    };
    const existing = document.getElementById("cloudflare-turnstile-script") as HTMLScriptElement | null;
    if (existing) render();
    else {
      const script = document.createElement("script");
      script.id = "cloudflare-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.addEventListener("load", render);
      document.head.appendChild(script);
    }
    const timer = window.setInterval(render, 300);
    return () => {
      window.clearInterval(timer);
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
      widgetIdRef.current = undefined;
    };
  }, [onToken, siteKey]);

  useImperativeHandle(ref, () => ({
    reset() {
      onToken("");
      if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current);
    },
  }), [onToken]);

  if (!siteKey) {
    return <div className="turnstile-placeholder"><ShieldCheck aria-hidden="true" /><span><strong>Protected submission</strong>Secure verification runs before an application is accepted.</span></div>;
  }
  return <div className="turnstile-widget" ref={containerRef} aria-label="Spam protection verification" />;
});
