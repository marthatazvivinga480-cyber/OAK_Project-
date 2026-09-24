import QRCode from 'qrcode';
type Confirmation = { id: string; registration_id: string; role: string; email: string; first_name: string; last_name: string; organization: string; qr_code_id: string | null };
export async function sendConfirmation(entry: Confirmation, recoveryCode: string) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return 'not-configured';
  try {
    const attachments = entry.qr_code_id ? [{ filename: 'OAK-entry-pass.png', content: (await QRCode.toBuffer(entry.qr_code_id, { width: 600, margin: 4 })).toString('base64') }] : [];
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(10000),
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `registration-${entry.id}` },
      body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [entry.email], subject: 'Your OAK Partner Convening registration', text: `You are registered, ${entry.first_name} ${entry.last_name}.\nRole: ${entry.role}\n9-11 November 2026, Harare.\nRegistration ID: ${entry.registration_id}\nRecovery code: ${recoveryCode}\nKeep this recovery code private. Use it on the registration page to sign in again.`, attachments }),
    });
    return response.ok ? 'sent' : 'failed';
  } catch { return 'failed'; }
}
