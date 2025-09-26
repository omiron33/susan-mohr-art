import Stripe from "stripe";
import { getRequiredEnv } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (!stripeClient) {
    const apiKey = getRequiredEnv("STRIPE_SECRET_KEY");
    stripeClient = new Stripe(apiKey, {
      apiVersion: "2025-08-27.basil",
    });
  }
  return stripeClient;
}
