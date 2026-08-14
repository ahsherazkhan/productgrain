"use client";

import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/src/config/site";
import { NativeLink as Link } from "@/src/components/ui/native-link";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="wordmark" aria-label={`${siteConfig.brandName} home`} onClick={() => setOpen(false)}>
          <span className="wordmark__mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {siteConfig.brandName}
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="header-cta" href={siteConfig.primaryCta.href}>
          {siteConfig.primaryCta.label}
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <div id="mobile-navigation" className={`mobile-nav ${open ? "is-open" : ""}`} hidden={!open}>
        <nav aria-label="Mobile navigation" className="container">
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link className="button button--primary" href={siteConfig.primaryCta.href} onClick={() => setOpen(false)}>
            <span>{siteConfig.primaryCta.label}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function CampaignHeader({ market }: { market: "uk" | "us" }) {
  return (
    <header className="site-header campaign-header">
      <div className="container site-header__inner">
        <Link href="/" className="wordmark" aria-label={`${siteConfig.brandName} home`}>
          <span className="wordmark__mark" aria-hidden="true"><i /><i /><i /></span>
          {siteConfig.brandName}
        </Link>
        <nav className="campaign-nav" aria-label="Landing page navigation">
          {siteConfig.campaignNavigation.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <a className="header-cta" href="#application" aria-label={`Start the ${market.toUpperCase()} product fit application`}>
          Check your fit
        </a>
      </div>
    </header>
  );
}
