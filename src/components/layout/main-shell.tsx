import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function MainShell({ children }: { children: ReactNode }) {
  return <><SiteHeader /><main id="main-content">{children}</main><SiteFooter /></>;
}

