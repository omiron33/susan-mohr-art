import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripeClient } from "@/lib/stripe";
import { fetchPrintById } from "@/lib/cms";
import { env } from "@/lib/env";

const requestSchema = z.object({
  printId: z.string().min(1, "printId is required"),
  quantity: z.number().int().positive().max(10).default(1),
});

function getSiteUrl() {
  return env.SITE_URL ?? "http://localhost:3000";
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { printId, quantity } = requestSchema.parse(json);

    const print = await fetchPrintById(printId);
    if (!print) {
      return NextResponse.json({ error: "Print not found" }, { status: 404 });
    }

    if (!print.stripe_price_id) {
      return NextResponse.json({ error: "Print is not available for purchase" }, { status: 400 });
    }

    if ((print.in_stock ?? 0) < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: print.stripe_price_id,
          quantity,
        },
      ],
      metadata: {
        printId: print.id,
      },
      success_url: `${getSiteUrl()}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getSiteUrl()}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Failed to create checkout session", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
