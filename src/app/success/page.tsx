import Link from "next/link";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Thank You | Susan Mohr Art",
};

export default function SuccessPage() {
  return (
    <div className="bg-muted/30 py-20">
      <Container className="mx-auto max-w-2xl space-y-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Thank you!</h1>
        <p className="text-muted-foreground">
          Your order is confirmed and a receipt is on the way to your inbox. I’ll be in touch with shipping details soon.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link href="/prints">Continue shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Need assistance?</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
