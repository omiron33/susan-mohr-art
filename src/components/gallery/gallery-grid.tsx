"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface GalleryArtwork {
  id: string;
  title: string;
  imageUrl: string;
  description?: string | null;
  medium?: string | null;
  dimensions?: string | null;
  price?: number | null;
  isSold?: boolean;
  category?: string;
  createdAt?: string;
}

interface GalleryGridProps {
  artworks: GalleryArtwork[];
  className?: string;
}

export function GalleryGrid({ artworks, className }: GalleryGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeArtwork = artworks.find((art) => art.id === activeId);

  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {artworks.map((artwork) => (
        <Dialog key={artwork.id} open={activeId === artwork.id} onOpenChange={(open) => setActiveId(open ? artwork.id : null)}>
          <DialogTrigger asChild>
            <button type="button" className="group relative block overflow-hidden rounded-lg border bg-background text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                width={640}
                height={800}
                className="h-72 w-full object-cover transition group-hover:scale-[1.02]"
              />
              <div className="flex items-start justify-between gap-4 p-4">
                <div>
                  <h3 className="text-base font-semibold tracking-tight">
                    {artwork.title}
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {artwork.medium ? <p>{artwork.medium}</p> : null}
                    {artwork.dimensions ? <p>{artwork.dimensions}</p> : null}
                    {artwork.price && !artwork.isSold ? (
                      <p className="font-medium text-foreground">
                        ${artwork.price.toLocaleString()}
                      </p>
                    ) : null}
                  </div>
                </div>
                {artwork.isSold ? <Badge variant="secondary">Sold</Badge> : null}
              </div>
            </button>
          </DialogTrigger>
          {activeArtwork ? (
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-none bg-transparent p-0 shadow-none">
              <div className="grid gap-6 rounded-lg bg-background p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
                <div className="relative min-h-[320px] w-full overflow-hidden rounded-md">
                  <Image
                    src={activeArtwork.imageUrl}
                    alt={activeArtwork.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 640px"
                    priority
                  />
                </div>
                <div className="flex flex-col gap-4 text-sm">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {activeArtwork.title}
                    </h2>
                    {activeArtwork.category ? (
                      <p className="text-muted-foreground">{activeArtwork.category}</p>
                    ) : null}
                  </div>
                  {activeArtwork.dimensions ? (
                    <div>
                      <p className="font-medium">Dimensions</p>
                      <p className="text-muted-foreground">{activeArtwork.dimensions}</p>
                    </div>
                  ) : null}
                  {activeArtwork.medium ? (
                    <div>
                      <p className="font-medium">Medium</p>
                      <p className="text-muted-foreground">{activeArtwork.medium}</p>
                    </div>
                  ) : null}
                  {activeArtwork.description ? (
                    <div>
                      <p className="font-medium">About this piece</p>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {activeArtwork.description}
                      </p>
                    </div>
                  ) : null}
                  {activeArtwork.price && !activeArtwork.isSold ? (
                    <div>
                      <p className="font-medium">Price</p>
                      <p className="text-muted-foreground">
                        ${activeArtwork.price.toLocaleString()}
                      </p>
                    </div>
                  ) : null}
                  {activeArtwork.isSold ? (
                    <Badge variant="secondary" className="w-fit">
                      Sold
                    </Badge>
                  ) : null}
                </div>
              </div>
            </DialogContent>
          ) : null}
        </Dialog>
      ))}
    </div>
  );
}
