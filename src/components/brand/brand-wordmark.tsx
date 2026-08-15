import Image from "next/image";
import type { MouseEventHandler } from "react";
import { siteConfig } from "@/src/config/site";
import { NativeLink as Link } from "@/src/components/ui/native-link";

export function BrandWordmark({
  light = false,
  onClick,
}: {
  light?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Link
      href="/"
      className={`wordmark${light ? " wordmark--light" : ""}`}
      aria-label={`${siteConfig.brandName} home`}
      onClick={onClick}
    >
      <Image
        className="wordmark__mark"
        src="/brand/productgrain-mark.svg"
        alt=""
        aria-hidden="true"
        width={64}
        height={64}
        priority
      />
      <span>{siteConfig.brandName}</span>
    </Link>
  );
}
