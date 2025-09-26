import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please share your name"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().optional(),
  message: z.string().min(10, "Tell us a little more about your project"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
