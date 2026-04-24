/**
 * Lightweight email notification helper.
 *
 * Currently logs to console. To go production-ready:
 *   - Replace with Resend: https://resend.com
 *   - Or call a Supabase Edge Function: supabase.functions.invoke('send-email', {...})
 */

interface SubmissionEmailPayload {
  to: string;
  name: string;
  listingName: string;
  type: 'venue' | 'vendor';
  slug: string;
}

export async function sendSubmissionConfirmation(payload: SubmissionEmailPayload) {
  const { to, name, listingName, type, slug } = payload;

  const subject = `✅ Your ${type} "${listingName}" has been received — VenueConnect`;
  const body = `
Hi ${name},

Thanks for submitting your ${type} on VenueConnect!

📌 Listing: ${listingName}
🔗 Slug: venueconnect.in/${type}s/${slug}

Our team will review and publish your listing within 24–48 hours.
You'll receive another email once it goes live.

Questions? Reply to this email or WhatsApp us at +91-XXXXXXXXXX.

— Team VenueConnect
  `.trim();

  // TODO: Replace with Resend SDK or Supabase Edge Function call
  console.log('[Email] To:', to);
  console.log('[Email] Subject:', subject);
  console.log('[Email] Body:\n', body);

  /*
  // Example with Resend (install `resend` package first):
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'VenueConnect <noreply@venueconnect.in>',
    to,
    subject,
    text: body,
  });

  // Example with Supabase Edge Function:
  const supabase = await createClient();
  await supabase.functions.invoke('send-email', {
    body: { to, subject, text: body },
  });
  */
}
