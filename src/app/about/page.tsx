import { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/site/container";
import { Card, CardContent } from "@/components/ui/card";
import { getAboutPageContent } from "@/lib/site-content";
import { fetchCategories, getAssetUrl } from "@/lib/cms";

export const metadata: Metadata = {
  title: "About Susan | Susan Mohr Art",
  description:
    "Learn about Iowa-based acrylic painter Susan Mohr, her background, and approach to contemporary realism.",
};

export default async function AboutPage() {
  const [content, categories] = await Promise.all([
    getAboutPageContent(),
    fetchCategories(),
  ]);

  return (
    <div className="py-16">
      <Container className="grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-start">
        <article className="space-y-6">
          <header className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">About</p>
            <h1 className="text-4xl font-semibold tracking-tight">
              {content.heading ?? "Welcome to Susan Mohr Art"}
            </h1>
          </header>
          {content.body ? (
            <p className="whitespace-pre-line text-muted-foreground">{content.body}</p>
          ) : null}
        </article>
        <aside className="space-y-4">
          <Card className="overflow-hidden bg-muted/30">
            <CardContent className="space-y-4 p-5 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Featured galleries</p>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <a className="text-primary hover:underline" href={`/galleries/${category.slug}`}>
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          {categories[0]?.hero_image ? (
            <div className="overflow-hidden rounded-lg border">
              <Image
                src={getAssetUrl(categories[0].hero_image, "width=900&quality=85") ?? ""}
                alt={categories[0].name}
                width={600}
                height={800}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
        </aside>
      </Container>
    </div>
  );
}
