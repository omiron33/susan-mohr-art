import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BuyPrintButton } from "@/components/products/buy-print-button";
import { fetchPrints, getAssetUrl } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Fine Art Prints | Susan Mohr Art",
  description:
    "Limited edition acrylic art prints with archival inks, ready for gifting or display.",
};

export default async function PrintsPage() {
  const prints = await fetchPrints();

  return (
    <div className="bg-muted/30 py-16">
      <Container className="space-y-12">
        <header className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Print Shop</p>
          <h1 className="text-4xl font-semibold tracking-tight">Fine art prints</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Museum-quality giclées printed on archival stock, matted and ready to frame. Each edition is hand finished and signed.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {prints.map((print) => {
            const imageUrl = getAssetUrl(print.image, "width=1400&quality=85");
            const available = Boolean(print.stripe_price_id) && (print.in_stock ?? 0) > 0;
            return (
              <Card key={print.id} className="flex h-full flex-col overflow-hidden">
                {imageUrl ? (
                  <div className="relative h-60 w-full">
                    <Image
                      src={imageUrl}
                      alt={print.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="flex h-60 items-center justify-center bg-muted text-muted-foreground">
                    Image coming soon
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{print.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{print.size ?? "Matting included"}</p>
                </CardHeader>
                <CardContent className="mt-auto space-y-3">
                  <p className="text-lg font-semibold">
                    {print.price ? `$${print.price.toLocaleString()}` : "Contact for pricing"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(print.in_stock ?? 0) > 0 ? `${print.in_stock} remaining` : "Currently out of stock"}
                  </p>
                </CardContent>
                <CardFooter>
                  {available ? (
                    <BuyPrintButton printId={print.id} />
                  ) : (
                    <Link
                      href="/contact"
                      className="w-full rounded-md border px-4 py-2 text-center text-sm font-medium text-muted-foreground transition hover:bg-muted"
                    >
                      Join waitlist
                    </Link>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
