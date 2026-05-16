interface WaitlistConfirmationEmailParams {
  position: number;
}

export function getWaitlistConfirmationEmail({
  position,
}: WaitlistConfirmationEmailParams): { subject: string; html: string } {
  const subject = "You're on the list! 🎉";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 40px 0;">
    <h1 style="color: #1a1a1a; font-size: 28px; margin-bottom: 10px;">You're on the list! 🎉</h1>
    <p style="color: #666; font-size: 16px;">Welcome to Better Stack 2</p>
  </div>

  <div style="background: #f8f9fa; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px; font-size: 16px;">Hi there,</p>
    <p style="margin: 0 0 15px; font-size: 16px;">Thanks for joining the Better Stack 2 waitlist!</p>
    <p style="margin: 0; font-size: 16px;">Your position: <strong style="color: #2563eb; font-size: 24px;">#${position}</strong></p>
  </div>

  <div style="margin-bottom: 30px;">
    <p style="font-size: 15px; color: #555;">We'll notify you when you're approved. In the meantime, stay tuned for updates on our progress.</p>
  </div>

  <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
    <p style="color: #999; font-size: 13px; margin: 0;">Better Stack 2 — Social media management dashboard</p>
  </div>
</body>
</html>
  `.trim();

  return { subject, html };
}