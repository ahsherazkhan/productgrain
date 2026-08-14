import { ArrowLeft, SearchX } from "lucide-react";
import { MainShell } from "@/src/components/layout/main-shell";
import { Container } from "@/src/components/ui/primitives";
import { NativeLink as Link } from "@/src/components/ui/native-link";

export default function NotFound() {
  return (
    <MainShell>
      <section className="system-page ruled-bg">
        <Container>
          <div className="system-card">
            <SearchX aria-hidden="true" />
            <p className="eyebrow">404 · Not found</p>
            <h1>This page is not part of the current product path.</h1>
            <p>
              The link may be outdated, or the page may have moved. The homepage
              and product application are still available.
            </p>
            <div className="button-row">
              <Link href="/" className="button button--primary">
                <ArrowLeft aria-hidden="true" /> Back to the homepage
              </Link>
              <Link href="/apply" className="button button--secondary">
                Discuss your idea
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </MainShell>
  );
}
