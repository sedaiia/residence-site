import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, company, email, countryCode, phone, message } = req.body ?? {}

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    await resend.emails.send({
      from: 'Sedaiia Residence <contact@sedaiia.com>',
      to: 'hello@sedaiia.com',
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <div style="font-family: 'Courier New', monospace; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="font-weight: 400; font-size: 20px; margin-bottom: 24px;">New contact form submission — Residence</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 13px; width: 120px;">Name</td>
              <td style="padding: 8px 0; font-size: 13px;">${name}</td>
            </tr>
            ${company ? `<tr>
              <td style="padding: 8px 0; color: #666; font-size: 13px;">Company</td>
              <td style="padding: 8px 0; font-size: 13px;">${company}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 13px;">Email</td>
              <td style="padding: 8px 0; font-size: 13px;"><a href="mailto:${email}" style="color: #1a1a1a;">${email}</a></td>
            </tr>
            ${phone ? `<tr>
              <td style="padding: 8px 0; color: #666; font-size: 13px;">Phone</td>
              <td style="padding: 8px 0; font-size: 13px;">${countryCode ?? ''} ${phone}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 13px; vertical-align: top;">Message</td>
              <td style="padding: 8px 0; font-size: 13px; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
        </div>
      `,
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
