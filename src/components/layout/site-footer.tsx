"use client";

import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/src/config/site";
import { NativeLink as Link } from "@/src/components/ui/native-link";

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  const reopenCookies = () => window.dispatchEvent(new Event("needfoundry:cookie-settings"));

  if (compact) {
    return (
      <footer className="site-footer site-footer--compact">
        <div className="container">
          <Link href="/" className="wordmark wordmark--light">
            <span className="wordmark__mark" aria-hidden="true"><i /><i /><i /></span>
            {siteConfig.brandName}
          </Link>
          <nav aria-label="Legal information">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cookies">Cookies</Link>
            <button type="button" onClick={reopenCookies}>Cookie settings</button>
          </nav>
          <p>© {new Date().getFullYear()} {siteConfig.brandName}</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-lead">
          <Link href="/" className="wordmark wordmark--light">
            <span className="wordmark__mark" aria-hidden="true"><i /><i /><i /></span>
            {siteConfig.brandName}
          </Link>
          <p>{siteConfig.tagline}</p>
          <p className="footer-contact">
            {siteConfig.email ? (
              <a href={`mailto:${siteConfig.email}`}>Email: {siteConfig.email}</a>
            ) : null}
            {siteConfig.socialLinks.linkedin ? (
              <a href={siteConfig.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            ) : null}
          </p>
          <Link className="footer-cta" href="/apply">
            Discuss your product idea <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>
        <div className="footer-grid">
          <div>
            <p className="footer-label">Explore</p>
            {siteConfig.footerNavigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
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
          <p>© {new Date().getFullYear()} {siteConfig.brandName}. AI-native product and engineering partner.</p>
          <p>Available to work with clients in the United Kingdom, United States, and internationally.</p>
        </div>
      </div>
    </footer>
  );
}
