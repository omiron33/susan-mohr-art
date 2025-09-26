"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BuyPrintButtonProps {
  printId: string;
  disabled?: boolean;
}

export function BuyPrintButton({ printId, disabled }: BuyPrintButtonProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ printId, quantity: 1 }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({ error: "Unable to start checkout" }));
          throw new Error(data.error ?? "Unable to start checkout");
        }

        const data = (await response.json()) as { url?: string };
        if (!data.url) {
          throw new Error("Checkout session missing redirect URL");
        }

        window.location.href = data.url;
      } catch (error) {
        console.error("Checkout error", error);
        toast({
          title: "Unable to start checkout",
          description:
            error instanceof Error ? error.message : "Please try again or contact us for support.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isPending}
      className="w-full"
    >
      {isPending ? "Redirecting…" : "Buy print"}
    </Button>
  );
}
