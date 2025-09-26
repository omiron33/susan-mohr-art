import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { fetchCategories, getAssetUrl } from "@/lib/cms";
import { getHomePageContent } from "@/lib/site-content";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HeroCanvas = dynamic(
  () => import("@/components/hero/hero-canvas").then((mod) => mod.HeroCanvas),
  { ssr: false },
);

export default async function HomePage() {
  const [categories, home] = await Promise.all([
    fetchCategories(),
    getHomePageContent(),
  ]);

  const featuredCategories = [
    ...categories,
    {
      slug: "prints",
      name: "Fine Art Prints",
      description: "Editioned prints with archival inks and matting options.",
      hero_image: null,
    },
  ];

  return (
    <div className="relative">
      <HeroCanvas className="fixed inset-0 h-full w-full" />
      <div className="relative space-y-28 pb-28">
        <section className="relative w-full overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
          <div className="relative z-10">
            <Container className="grid gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
              <div className="space-y-10">
                <div className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-background/90 px-5 py-2 text-xs uppercase tracking-[0.32em] text-foreground/90 shadow-sm backdrop-blur-sm dark:border-border/70 dark:bg-background/85 dark:text-foreground">
                  Susan Mohr Artistry
                </div>
                <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground drop-shadow-sm sm:text-5xl lg:text-6xl">
                  {home.heroHeadline ?? "Light-drenched paintings for collectors and dreamers."}
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground/90 dark:text-foreground/85 sm:text-xl">
                  I craft luminous acrylic stories—quiet still lifes, spirited pet portraits, and memory-rich landscapes—all layered with archival glazes and meaning.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5">
                    <Link href="/prints">Collect a Print</Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    size="lg"
                    className="border-border/70 bg-background/80 text-foreground backdrop-blur-sm hover:bg-background dark:border-border/60 dark:bg-background/70 dark:text-foreground dark:hover:bg-background/80"
                  >
                    <Link href="/contact">Commission a Story</Link>
                  </Button>
                </div>
              </div>
              <div className="space-y-5 rounded-3xl border border-border/50 bg-background/85 p-6 shadow-xl shadow-black/10 backdrop-blur-sm dark:border-border/40 dark:bg-background/75 dark:shadow-black/40">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Studio Notes</p>
                {home.sections.slice(0, 4).map((section) => (
                  <p key={section} className="text-sm leading-relaxed text-muted-foreground/90">
                    {section}
                  </p>
                ))}
              </div>
            </Container>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_80%,rgba(255,182,182,0.16),transparent_62%),radial-gradient(65%_55%_at_90%_25%,rgba(156,198,255,0.22),transparent_65%)]" />
        </section>

        <Container className="space-y-12">
          <header className="space-y-2 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Explore the work</h2>
            <p className="text-muted-foreground">Originals and prints that shimmer with layered acrylic light.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCategories.map((category) => {
              const imageUrl = getAssetUrl(category.hero_image, "width=800&quality=80");
              return (
                <Card
                  key={category.slug}
                  className="group relative overflow-hidden border border-border/60 bg-gradient-to-br from-card/95 via-background/85 to-secondary/50 shadow-lg shadow-black/10 transition-transform backdrop-blur-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 dark:border-border/40 dark:from-card/80 dark:via-background/70 dark:to-secondary/25 dark:shadow-black/40"
                >
                  <Link href={category.slug === "prints" ? "/prints" : `/galleries/${category.slug}`} className="flex h-full flex-col">
                    {imageUrl ? (
                      <div className="relative h-60 w-full overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority={category.slug === "still-life"}
                        />
                      </div>
                    ) : (
                      <div className="flex h-60 items-center justify-center bg-muted text-muted-foreground">Image coming soon</div>
                    )}
                    <CardContent className="flex flex-1 flex-col space-y-3 p-6">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                        <span className="inline-flex h-2 w-2 rounded-full bg-primary/80" />
                        Collection
                      </div>
                      <h3 className="text-2xl font-semibold tracking-tight text-foreground">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description ?? "Immersive gallery experience"}
                      </p>
                      <span className="mt-auto inline-flex w-fit items-center gap-2 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                        Enter gallery
                        <span aria-hidden className="text-lg">→</span>
                      </span>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </Container>

        <section className="relative overflow-hidden py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_10%_10%,rgba(255,204,160,0.18),transparent_62%),radial-gradient(55%_60%_at_88%_88%,rgba(132,202,255,0.18),transparent_68%)]" />
          <Container className="relative grid gap-12 rounded-[2.5rem] border border-border/60 bg-background/80 p-10 shadow-2xl shadow-black/10 backdrop-blur-sm dark:border-border/40 dark:bg-background/70 dark:shadow-black/40 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Commission a custom piece</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                From heirloom portraits to storied housecapes, we’ll co-create a one-of-a-kind painting composed with archival materials, layered color, and your narrative at the center.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="shadow-md shadow-primary/25">
                  <Link href="/contact">Share your idea</Link>
                </Button>
                <Button variant="ghost" asChild className="text-foreground hover:text-primary">
                  <Link href="/process">See the process</Link>
                </Button>
              </div>
            </div>
            <div className="relative rounded-3xl border border-border/60 bg-background/70 p-7 shadow-lg shadow-black/10 backdrop-blur-sm dark:border-border/40 dark:bg-background/70 dark:shadow-black/30">
              <div className="absolute -top-14 left-6 hidden h-24 w-24 rounded-full bg-gradient-to-br from-primary/45 to-accent/35 blur-3xl lg:block" />
              <div className="relative grid gap-6 text-sm text-muted-foreground">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Timeline</p>
                  <p className="mt-2 text-base text-foreground">4–8 weeks from kickoff, including sketches, revisions, and final delivery.</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Materials</p>
                  <p className="mt-2 text-base text-foreground">Museum-grade acrylics on gallery-depth canvas, sealed and ready to hang.</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Collaboration</p>
                  <p className="mt-2 text-base text-foreground">We align on palette, mood, and storytelling details before the first brushstroke.</p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </div>
  );
}
