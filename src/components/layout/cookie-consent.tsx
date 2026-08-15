"use client";

import { useEffect, useRef, useState } from "react";
import { currentConsentPolicyVersion } from "@/src/lib/validation/lead";
import { NativeLink as Link } from "@/src/components/ui/native-link";

export type ConsentChoice = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  policyVersion: string;
};

const storageKey = "needfoundry-consent-v1";
export const consentPolicyVersion = currentConsentPolicyVersion;

export function readConsent(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentChoice>;
    if (
      parsed.necessary !== true ||
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.marketing !== "boolean" ||
      typeof parsed.updatedAt !== "string" ||
      parsed.policyVersion !== consentPolicyVersion
    ) return null;
    return parsed as ConsentChoice;
  } catch {
    return null;
  }
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
      const existing = readConsent();
      if (existing) {
        setAnalytics(existing.analytics);
        setMarketing(existing.marketing);
        window.dispatchEvent(new CustomEvent("needfoundry:consent", { detail: existing }));
      } else {
        setVisible(true);
      }
    }, 0);

    const open = () => {
      setSettings(true);
      setVisible(true);
    };
    window.addEventListener("needfoundry:cookie-settings", open);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("needfoundry:cookie-settings", open);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const panel = panelRef.current;
    const timer = window.setTimeout(() => {
      panel?.querySelector<HTMLElement>("button, input, a[href]")?.focus();
    }, 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!panel) return;
      if (event.key === "Escape" && readConsent()) {
        setVisible(false);
        setSettings(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [settings, visible]);

  const save = (nextAnalytics: boolean, nextMarketing: boolean) => {
    const choice: ConsentChoice = {
      necessary: true,
      analytics: nextAnalytics,
      marketing: nextMarketing,
      updatedAt: new Date().toISOString(),
      policyVersion: consentPolicyVersion,
    };
    localStorage.setItem(storageKey, JSON.stringify(choice));
    window.dispatchEvent(new CustomEvent("needfoundry:consent", { detail: choice }));
    setVisible(false);
    setSettings(false);
  };

  if (!mounted || !visible) return null;

  return (
    <div className="consent-layer" role={settings ? "presentation" : undefined}>
      <section
        ref={panelRef}
        className={`consent-panel ${settings ? "consent-panel--settings" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
      >
        <p className="eyebrow">Your choices</p>
        <h2 id="consent-title">{settings ? "Cookie settings" : "A calm, useful cookie notice"}</h2>
        <p>
          Necessary storage keeps the site and enquiry working. With your permission, analytics helps us understand use and marketing helps measure campaigns. You can change this later. See our <Link href="/cookies">cookie notice</Link>.
        </p>

        {settings ? (
          <div className="consent-options">
            <div className="consent-option">
              <div><strong>Necessary</strong><span>Enquiry results, security, and saved choices.</span></div>
              <span className="status-chip">Always active</span>
            </div>
            <label className="consent-option" htmlFor="consent-analytics">
              <span><strong>Analytics</strong><span>Helps us understand pages and journeys without form free text.</span></span>
              <input id="consent-analytics" aria-label="Allow analytics cookies" type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />
            </label>
            <label className="consent-option" htmlFor="consent-marketing">
              <span><strong>Marketing</strong><span>Allows consent-aware ad measurement such as Meta Pixel.</span></span>
              <input id="consent-marketing" aria-label="Allow marketing cookies" type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} />
            </label>
          </div>
        ) : null}

        <div className="consent-actions">
          {settings ? (
            <button className="button button--primary" type="button" onClick={() => save(analytics, marketing)}>Save choices</button>
          ) : (
            <button className="button button--primary" type="button" onClick={() => save(true, true)}>Accept optional cookies</button>
          )}
          <button className="button button--secondary" type="button" onClick={() => save(false, false)}>Necessary only</button>
          {!settings ? <button className="text-button" type="button" onClick={() => setSettings(true)}>Choose settings</button> : null}
        </div>
      </section>
    </div>
  );
}
