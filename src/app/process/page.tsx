import { Container } from "@/components/site/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProcessPageContent } from "@/lib/site-content";

export const metadata = {
  title: "Commission Process | Susan Mohr Art",
  description:
    "Learn how Susan approaches custom paintings from photo selection through final delivery.",
};

const STEPS = [
  {
    title: "Send reference photos",
    description:
      "Share clear, well-lit images of your subject and any notes about what matters most to you.",
  },
  {
    title: "Confirm size & timeline",
    description:
      "We’ll align on canvas dimensions, pricing, and delivery dates before a 50% deposit is collected.",
  },
  {
    title: "Painting begins",
    description:
      "Susan blocks in color, adds layered detail, and shares progress updates as the piece develops.",
  },
  {
    title: "Final approval & delivery",
    description:
      "Approve a final photo, settle the balance, and receive your painting ready to hang or frame.",
  },
];

export default async function ProcessPage() {
  const content = await getProcessPageContent();

  return (
    <div className="bg-muted/30 py-16">
      <Container className="space-y-12">
        <header className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Process
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {content.heading ?? "How commissions come to life"}
          </h1>
          {content.paragraphs.slice(0, 1).map((paragraph) => (
            <p key={paragraph} className="text-lg text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {STEPS.map((step) => (
            <Card key={step.title} className="bg-background">
              <CardHeader>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {step.description}
              </CardContent>
            </Card>
          ))}
        </div>

        {content.paragraphs.slice(1).length ? (
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Artist statement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              {content.paragraphs.slice(1).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </Container>
    </div>
  );
}
