"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitContact } from "./actions";
import { contactSchema, ContactFormValues } from "./schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function ContactForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (values: ContactFormValues) => {
    startTransition(async () => {
      const result = await submitContact(values);
      if (result.status === "success") {
        toast({
          title: "Message sent",
          description: "Thank you! I’ll reply as soon as possible.",
        });
        form.reset();
      } else if (result.status === "error") {
        toast({
          title: "Unable to send message",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div>
        <label className="text-sm font-medium" htmlFor="name">
          Name
        </label>
        <Input
          id="name"
          placeholder="Your name"
          {...form.register("name")}
        />
        {form.formState.errors.name ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          placeholder="you@example.com"
          type="email"
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="subject">
          Project or subject (optional)
        </label>
        <Input
          id="subject"
          placeholder="Pet portrait, housecape, etc."
          {...form.register("subject")}
        />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="message">
          Message
        </label>
        <Textarea
          id="message"
          placeholder="Share your idea, timeline, and any details that matter."
          rows={6}
          {...form.register("message")}
        />
        {form.formState.errors.message ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.message.message}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
