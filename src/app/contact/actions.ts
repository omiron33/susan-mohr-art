"use server";

import { sendContactSubmissionEmail } from "@/lib/email";
import { contactSchema, ContactFormValues } from "./schema";

export type ContactFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function submitContact(values: ContactFormValues): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.errors[0]?.message ?? "Invalid submission" };
  }

  try {
    await sendContactSubmissionEmail(parsed.data);
    return { status: "success" };
  } catch (error) {
    console.error("Contact submission failed", error);
    return {
      status: "error",
      message: "Unable to send your message right now. Please try again soon.",
    };
  }
}
