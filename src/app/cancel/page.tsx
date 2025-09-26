import Link from "next/link";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Checkout Canceled | Susan Mohr Art",
};

export default function CancelPage() {
  return (
    <div className="bg-muted/30 py-20">
      <Container className="mx-auto max-w-2xl space-y-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Checkout canceled</h1>
        <p className="text-muted-foreground">
          No worries—your cart is intact. Feel free to revisit the print shop or reach out if you have questions.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link href="/prints">Return to prints</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
