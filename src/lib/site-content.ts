import { fetchSiteContent } from "@/lib/cms";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export interface HomePageContent {
  heroHeadline: string | null;
  sections: string[];
}

export interface ProcessPageContent {
  heading: string | null;
  paragraphs: string[];
}

export interface AboutPageContent {
  heading: string | null;
  body: string | null;
}

export interface ContactPageContent {
  heading: string | null;
  sections: string[];
}

export async function getHomePageContent(): Promise<HomePageContent> {
  const result = await fetchSiteContent(["page:home"]);
  const raw = result.get("page:home");
  if (isRecord(raw)) {
    return {
      heroHeadline: typeof raw.heroHeadline === "string" ? raw.heroHeadline : null,
      sections: Array.isArray(raw.sections)
        ? raw.sections.filter((item): item is string => typeof item === "string")
        : [],
    };
  }
  return { heroHeadline: null, sections: [] };
}

export async function getProcessPageContent(): Promise<ProcessPageContent> {
  const result = await fetchSiteContent(["page:process"]);
  const raw = result.get("page:process");
  if (isRecord(raw)) {
    return {
      heading: typeof raw.heading === "string" ? raw.heading : null,
      paragraphs: Array.isArray(raw.paragraphs)
        ? raw.paragraphs.filter((item): item is string => typeof item === "string")
        : [],
    };
  }
  return { heading: null, paragraphs: [] };
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  const result = await fetchSiteContent(["page:about"]);
  const raw = result.get("page:about");
  if (isRecord(raw)) {
    return {
      heading: typeof raw.heading === "string" ? raw.heading : null,
      body: typeof raw.body === "string" ? raw.body : null,
    };
  }
  return { heading: null, body: null };
}

export async function getContactPageContent(): Promise<ContactPageContent> {
  const result = await fetchSiteContent(["page:contact"]);
  const raw = result.get("page:contact");
  if (isRecord(raw)) {
    return {
      heading: typeof raw.heading === "string" ? raw.heading : null,
      sections: Array.isArray(raw.sections)
        ? raw.sections.filter((item): item is string => typeof item === "string")
        : [],
    };
  }
  return { heading: null, sections: [] };
}
