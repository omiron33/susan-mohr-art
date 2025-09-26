import { z } from "zod";

const envSchema = z.object({
  DIRECTUS_URL: z
    .preprocess((value) => {
      if (typeof value !== "string") {
        return value;
      }
      const trimmed = value.trim();
      if (trimmed === "") {
        return undefined;
      }
      const withProtocol = trimmed.includes("://")
        ? trimmed
        : `http://${trimmed}`;
      try {
        return new URL(withProtocol).toString();
      } catch {
        return withProtocol;
      }
    }, z.string().url().optional())
    .default("https://directus.susanmohrart.com"),
  DIRECTUS_STATIC_TOKEN: z.string().optional(),
  DIRECTUS_ADMIN_TOKEN: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM_ADDRESS: z.string().email().optional(),
  CONTACT_TO_ADDRESS: z.string().email().optional(),
  SITE_URL: z.string().url().optional(),
});

type EnvShape = z.infer<typeof envSchema>;

const parsed = envSchema.parse(process.env);

export const env: EnvShape = parsed;

export function getRequiredEnv<K extends keyof EnvShape>(key: K): NonNullable<EnvShape[K]> {
  const value = parsed[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
