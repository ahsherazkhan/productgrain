import type { Metadata } from "next";
import { MainShell } from "@/src/components/layout/main-shell";
import { Container } from "@/src/components/ui/primitives";
import { ThankYouResult } from "@/src/components/forms/thank-you-result";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Your NeedFoundry project enquiry has been received.",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return (
    <MainShell>
      <section className="result-page ruled-bg">
        <Container>
          <ThankYouResult reference={ref} />
        </Container>
      </section>
    </MainShell>
  );
}
