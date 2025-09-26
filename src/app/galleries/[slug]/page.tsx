import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Container } from "@/components/site/container";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import {
  fetchCategoryBySlug,
  fetchArtworksByCategorySlug,
  fetchCategories,
  getAssetUrl,
} from "@/lib/cms";

interface GalleryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await fetchCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  if (!category) {
    return {
      title: "Gallery | Susan Mohr Art",
    };
  }
  return {
    title: `${category.name} | Susan Mohr Art`,
    description: category.description ?? `Original paintings in the ${category.name} collection by Susan Mohr.`,
  };
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const artworks = await fetchArtworksByCategorySlug(slug);
  const galleryItems = artworks
    .map((artwork) => ({
      id: artwork.id,
      title: artwork.title,
      imageUrl: getAssetUrl(artwork.image, "width=1600&quality=85"),
      description: artwork.description ?? null,
      medium: artwork.medium ?? undefined,
      dimensions:
        artwork.width && artwork.height
          ? `${artwork.width}\" × ${artwork.height}\"`
          : artwork.description ?? undefined,
      price: artwork.price ?? undefined,
      isSold: artwork.isSold ?? false,
      category: category.name,
    }))
    .filter((item): item is typeof item & { imageUrl: string } => Boolean(item.imageUrl));

  return (
    <div className="py-16">
      <Container className="space-y-10">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Gallery</p>
          <h1 className="text-4xl font-semibold tracking-tight">{category.name}</h1>
          {category.description ? (
            <p className="max-w-2xl text-muted-foreground">{category.description}</p>
          ) : null}
        </header>
        {galleryItems.length ? (
          <GalleryGrid artworks={galleryItems} />
        ) : (
          <p className="text-muted-foreground">Artwork is coming soon.</p>
        )}
      </Container>
    </div>
  );
}
