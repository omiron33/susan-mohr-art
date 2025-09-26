import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/site/container";
import { Card, CardContent } from "@/components/ui/card";
import { fetchCategories, getAssetUrl } from "@/lib/cms";

export const metadata = {
  title: "Galleries | Susan Mohr Art",
  description:
    "Browse curated galleries of still life, pet portraits, and landscape paintings by Susan Mohr.",
};

export default async function GalleriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="py-16">
      <Container className="space-y-10">
        <header className="space-y-4 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">Galleries</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Explore work across subject matter. Each collection highlights layered acrylic details and a focus on light.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((category) => {
            const imageUrl = getAssetUrl(category.hero_image, "width=800&quality=80");
            return (
              <Card key={category.slug} className="overflow-hidden">
                <Link href={`/galleries/${category.slug}`}>
                  {imageUrl ? (
                    <div className="relative h-52 w-full">
                      <Image
                        src={imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-muted text-muted-foreground">
                      Image coming soon
                    </div>
                  )}
                  <CardContent className="space-y-2 p-5">
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {category.description ?? "View the collection"}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
