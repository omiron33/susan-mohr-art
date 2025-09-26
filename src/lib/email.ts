import { Resend } from "resend";
import { env, getRequiredEnv } from "@/lib/env";

let resendClient: Resend | null = null;

function getResendClient() {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  if (!resendClient) {
    resendClient = new Resend(env.RESEND_API_KEY);
  }
  return resendClient;
}

export interface OrderEmailPayload {
  to: string;
  subject?: string;
  customerName?: string | null;
  items: Array<{
    description: string;
    quantity: number;
    amountTotal: number;
  }>;
  total: number;
}

export async function sendOrderConfirmationEmail(payload: OrderEmailPayload) {
  const from = getRequiredEnv("EMAIL_FROM_ADDRESS");
  const resend = getResendClient();
  const subject = payload.subject ?? "Thank you for your order";

  const lineItems = payload.items
    .map(
      (item) =>
        `<tr><td style=\"padding:4px 0;\">${item.description} × ${item.quantity}</td><td style=\"text-align:right;\">$${(item.amountTotal / 100).toFixed(2)}</td></tr>`
    )
    .join("");

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5;">
      <p>Hi ${payload.customerName ?? "there"},</p>
      <p>Thank you for supporting Susan Mohr Art. Your order is confirmed and will be processed shortly.</p>
      <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
        <tbody>
          ${lineItems}
        </tbody>
        <tfoot>
          <tr>
            <td style="padding-top: 8px; font-weight: bold;">Total</td>
            <td style="padding-top: 8px; text-align: right; font-weight: bold;">$${(payload.total / 100).toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      <p>If you have any questions, just reply to this email.</p>
      <p>— Susan Mohr Art</p>
    </div>
  `;

  await resend.emails.send({
    from,
    to: payload.to,
    subject,
    html,
  });
}

export interface ContactSubmissionPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function sendContactSubmissionEmail(payload: ContactSubmissionPayload) {
  const from = getRequiredEnv("EMAIL_FROM_ADDRESS");
  const to = env.CONTACT_TO_ADDRESS ?? from;
  const resend = getResendClient();

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5;">
      <p><strong>New inquiry from ${payload.name}</strong></p>
      <p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
      ${payload.subject ? `<p><strong>Subject:</strong> ${payload.subject}</p>` : ""}
      <p>${payload.message.replace(/\n/g, "<br />")}</p>
    </div>
  `;

  await resend.emails.send({
    from,
    to,
    replyTo: payload.email,
    subject: payload.subject ?? "New contact submission",
    html,
  });
}
