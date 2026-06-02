import Newsletter from '../models/Newsletter.js';
import transporter from '../configs/nodemailer.js';

// POST /api/newsletter/subscribe
export const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.json({ success: false, message: 'Please provide a valid email address.' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Duplicate check
        const existing = await Newsletter.findOne({ email: normalizedEmail });
        if (existing) {
            return res.json({ success: false, message: 'This email is already subscribed.' });
        }

        // Save to DB
        await Newsletter.create({ email: normalizedEmail });

        const year = new Date().getFullYear();

        const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Subscription Confirmed – BookEase</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">

        <tr>
          <td style="background:#1a1a2e;padding:28px 40px;">
            <p style="margin:0;color:#ffffff;font-size:22px;font-family:Georgia,serif;">BookEase</p>
          </td>
        </tr>

        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 12px;color:#111827;font-size:15px;line-height:1.7;">Hi,</p>
            <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.7;">
              Your subscription to the BookEase newsletter has been confirmed.
            </p>
            <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.7;">
              You will receive hotel updates, new destination highlights, and travel guides from us.
            </p>
            <p style="margin:24px 0 0;color:#374151;font-size:15px;line-height:1.7;">
              Best regards,<br/>
              <strong>Abhisek Panigrahy</strong><br/>
              <span style="color:#6b7280;font-size:13px;">BookEase</span>
            </p>
          </td>
        </tr>

        <tr>
          <td style="border-top:1px solid #e5e7eb;padding:16px 40px;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">
              Sent to ${normalizedEmail} &nbsp;&middot;&nbsp; &copy; ${year} BookEase
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

        const textBody = `Hi there,

Thanks for subscribing to BookEase!

Your subscription is confirmed. Here is what you will receive:
- Exclusive hotel deals up to 40% off
- Curated destination guides every week
- Members-only early access offers
- Travel tips from seasoned explorers

Browse hotels: https://bookease.vercel.app/

Best,
Abhisek Panigrahy
BookEase Team

You subscribed with ${normalizedEmail}.
(c) ${year} BookEase`;

        await transporter.sendMail({
            from: `"Abhisek from BookEase" <${process.env.SENDER_EMAIL}>`,
            to: email,
            replyTo: process.env.SENDER_EMAIL,
            subject: 'Your BookEase subscription is confirmed',
            text: textBody,
            html: htmlBody,
        });

        res.json({ success: true, message: 'Subscribed successfully! Check your inbox.' });

    } catch (error) {
        console.error('Newsletter subscribe error:', error);
        res.json({ success: false, message: 'Subscription failed. Please try again.' });
    }
};
