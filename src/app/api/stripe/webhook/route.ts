import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import { getRequiredEnv } from "@/lib/env";
import {
  createOrder,
  decrementPrintStock,
  fetchPrintByStripePriceId,
  getOrderByStripeSessionId,
} from "@/lib/cms";
import { sendOrderConfirmationEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handleCheckoutCompleted(event: Stripe.CheckoutSessionCompletedEvent) {
  const session = event.data.object;
  const stripe = getStripeClient();

  const existing = await getOrderByStripeSessionId(session.id);
  if (existing) {
    return;
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price"],
  });

  const normalizedItems = await Promise.all(
    lineItems.data.map(async (item) => {
      const priceId = item.price?.id ?? null;
      const quantity = item.quantity ?? 1;
      if (priceId) {
        const print = await fetchPrintByStripePriceId(priceId);
        if (print) {
          await decrementPrintStock(print.id, quantity);
        }
      }
      return {
        id: item.id,
        description: item.description ?? item.price?.nickname ?? "Print",
        price_id: priceId,
        quantity,
        amount_total: item.amount_total ?? item.amount_subtotal ?? 0,
      };
    })
  );

  const total = session.amount_total ??
    normalizedItems.reduce((sum, item) => sum + (item.amount_total ?? 0), 0);

  await createOrder({
    stripe_session_id: session.id,
    email: session.customer_details?.email ?? "",
    line_items: normalizedItems,
    total,
    status: session.payment_status ?? "paid",
  });

  const customerEmail = session.customer_details?.email;
  if (customerEmail) {
    try {
      await sendOrderConfirmationEmail({
        to: customerEmail,
        customerName: session.customer_details?.name,
        items: normalizedItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          amountTotal: item.amount_total,
        })),
        total,
      });
    } catch (error) {
      console.error("Failed to send order confirmation email", error);
    }
  }
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const secret = getRequiredEnv("STRIPE_WEBHOOK_SECRET");
  const payload = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error("Webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event as Stripe.CheckoutSessionCompletedEvent);
    }
  } catch (error) {
    console.error("Error handling Stripe webhook", error);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
