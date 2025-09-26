import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "./contact-form";
import { getContactPageContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Contact & Commissions | Susan Mohr Art",
  description:
    "Request a commission, inquire about originals, or ask a question about prints from Susan Mohr.",
};

export default async function ContactPage() {
  const content = await getContactPageContent();

  return (
    <div className="bg-muted/30 py-16">
      <Container className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        <div className="space-y-6">
          <header className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Contact
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">
              {content.heading ?? "Let’s collaborate"}
            </h1>
            {content.sections.slice(0, 1).map((paragraph) => (
              <p key={paragraph} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </header>
          <Card className="bg-background">
            <CardContent className="space-y-3 p-6">
              <p className="text-sm text-muted-foreground">
                Share your idea and we’ll follow up with availability, pricing, and next steps. Attach reference photos in the reply if needed.
              </p>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4 text-sm text-muted-foreground">
          {content.sections.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="rounded-lg border bg-background p-5">
            <p className="text-sm font-medium text-foreground">Email</p>
            <a
              className="mt-1 inline-block text-primary"
              href="mailto:susanmohrart@gmail.com"
            >
              susanmohrart@gmail.com
            </a>
            <p className="mt-4 text-sm font-medium text-foreground">Turnaround</p>
            <p>Most commissions complete in 4–8 weeks depending on scale and current bookings.</p>
          </div>
        </aside>
      </Container>
    </div>
  );
}
