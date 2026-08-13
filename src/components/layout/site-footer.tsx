"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/src/config/site";

export function SiteFooter() {
  const reopenCookies = () => window.dispatchEvent(new Event("needfoundry:cookie-settings"));

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-lead">
          <Link href="/" className="wordmark wordmark--light">
            <span className="wordmark__mark" aria-hidden="true"><i /><i /><i /></span>
            {siteConfig.brandName}
          </Link>
          <p>{siteConfig.tagline}</p>
          <Link className="footer-cta" href="/apply">
            Discuss your idea — free <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>
        <div className="footer-grid">
          <div>
            <p className="footer-label">Explore</p>
            {siteConfig.navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </div>
          <div>
            <p className="footer-label">Markets</p>
            <Link href="/mvp-development/uk">MVP development UK</Link>
            <Link href="/mvp-development/us">MVP development US</Link>
            <Link href="/mvp-development">MVP development</Link>
          </div>
          <div>
            <p className="footer-label">Information</p>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cookies">Cookies</Link>
            <button type="button" onClick={reopenCookies}>Cookie settings</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {siteConfig.brandName}. Product direction, design, and engineering.</p>
          <p>Available to work with clients in the United Kingdom, United States, and internationally.</p>
        </div>
      </div>
    </footer>
  );
}

