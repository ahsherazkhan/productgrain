import type { AnchorHTMLAttributes } from "react";

type NativeLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  href: string;
};

/**
 * Standards-based internal navigation for the public site.
 *
 * Vinext beta's production next/link client runtime currently throws before
 * navigation. A normal anchor keeps every route keyboard-accessible and
 * dependable while still handling fragments and query strings correctly.
 */
export function NativeLink({ href, children, ...props }: NativeLinkProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
