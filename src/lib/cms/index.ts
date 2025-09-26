/* eslint-disable @typescript-eslint/no-explicit-any */
import { cache } from "react";
import {
  createDirectus,
  rest,
  staticToken,
  readItems,
  readItem,
  createItem,
  updateItem,
} from "@directus/sdk";
import { env, getRequiredEnv } from "@/lib/env";
import type {
  DirectusSchema,
  Category,
  Artwork,
  Print,
  SiteContent,
  Order,
} from "./types";

let directusSingleton: DirectusClient | null = null;

type DirectusClient = ReturnType<typeof createClient>;

function createClient() {
  const url = getRequiredEnv("DIRECTUS_URL");
  const token = env.DIRECTUS_STATIC_TOKEN;
  
  const client = createDirectus<DirectusSchema>(url).with(rest());
  
  // Only add static token if it exists (for admin operations)
  if (token) {
    return client.with(staticToken(token));
  }
  
  return client;
}

function getClient(): DirectusClient {
  if (!directusSingleton) {
    directusSingleton = createClient();
  }
  return directusSingleton;
}

export function getAssetUrl(fileId?: string | null, params?: string) {
  if (!fileId) return null;
  const baseUrl = env.DIRECTUS_URL?.replace(/\/$/, "");
  if (!baseUrl) return null;
  return `${baseUrl}/assets/${fileId}${params ? `?${params}` : ""}`;
}

export const fetchCategories = cache(async () => {
  const client = getClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories = await client.request(
    readItems("categories" as any, {
      fields: ["id", "slug", "name", "description", "hero_image", "sort"],
      sort: ["sort", "name"],
    })
  );
  return categories as Category[];
});

export const fetchCategoryBySlug = cache(async (slug: string) => {
  const client = getClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories = await client.request(
    readItems("categories" as any, {
      filter: { slug: { _eq: slug } },
      limit: 1,
    })
  );
  return (categories?.[0] as Category | undefined) ?? null;
});

export const fetchArtworksByCategorySlug = cache(async (slug: string) => {
  const client = getClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const artworks = await client.request(
    readItems("artworks" as any, {
      filter: {
        category: { slug: { _eq: slug } },
      },
      fields: [
        "id",
        "title",
        "slug",
        "description",
        "width",
        "height",
        "medium",
        "price",
        "isSold",
        "image",
        {
          category: ["slug", "name"],
        },
      ],
      sort: ["-id"],
    })
  );

  return artworks as Artwork[];
});

export const fetchArtworkBySlug = cache(async (slug: string) => {
  const client = getClient();
  const artwork = await client.request(
    readItems("artworks" as any, {
      filter: { slug: { _eq: slug } },
      limit: 1,
    })
  );
  return (artwork?.[0] as Artwork | undefined) ?? null;
});

export const fetchPrints = cache(async () => {
  const client = getClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prints = await client.request(
    readItems("prints" as any, {
      fields: [
        "id",
        "title",
        "slug",
        "description",
        "image",
        "stripe_product_id",
        "stripe_price_id",
        "price",
        "size",
        "in_stock",
      ],
      sort: ["title"],
    })
  );
  return prints as Print[];
});

export const fetchPrintById = cache(async (id: string) => {
  const client = getClient();
  const print = await client.request(readItem("prints", id));
  return print as Print;
});

export const fetchPrintByStripePriceId = cache(async (priceId: string) => {
  const client = getClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prints = await client.request(
    readItems("prints" as any, {
      filter: { stripe_price_id: { _eq: priceId } },
      limit: 1,
    })
  );
  return (prints?.[0] as Print | undefined) ?? null;
});

export const fetchSiteContent = cache(async (keys: string[]) => {
  const client = getClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content = await client.request(
    readItems("site_content" as any, {
      filter: { key: { _in: keys } },
      fields: ["key", "value"],
      limit: keys.length,
    })
  );

  const map = new Map<string, SiteContent["value"]>();
  for (const item of content as SiteContent[]) {
    map.set(item.key, item.value);
  }
  return map;
});

export type SiteContentMap = Awaited<ReturnType<typeof fetchSiteContent>>;

export async function createOrder(order: Omit<Order, "id">) {
  const client = getClient();
  return client.request(createItem("orders", order));
}

export async function decrementPrintStock(printId: string, quantity: number) {
  const client = getClient();
  const current = (await client.request(readItem("prints", printId))) as Print;
  const inStock = Math.max(0, (current.in_stock ?? 0) - quantity);
  await client.request(updateItem("prints", printId, { in_stock: inStock }));
}

export async function getOrderByStripeSessionId(sessionId: string) {
  const client = getClient();
  const orders = await client.request(
    readItems("orders", {
      filter: { stripe_session_id: { _eq: sessionId } },
      limit: 1,
    })
  );
  return (orders?.[0] as Order | undefined) ?? null;
}
