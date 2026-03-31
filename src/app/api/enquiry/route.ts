import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (process.env.GMAIL_SENDER_EMAIL && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.GMAIL_SENDER_EMAIL, pass: process.env.GMAIL_APP_PASSWORD },
      });

      await transporter.sendMail({
        from: `"The Aura Company Contact" <${process.env.GMAIL_SENDER_EMAIL}>`,
        to: process.env.GMAIL_SENDER_EMAIL,
        replyTo: body.email,
        subject: `New Enquiry: ${body.subject} — from ${body.name}`,
        html: `
          <div style="background:#08070F;padding:30px;font-family:Arial,sans-serif;color:#F0EDF8;">
            <h2 style="color:#00D4C8;">New Contact Enquiry</h2>
            <p><strong>Name:</strong> ${body.name}</p>
            <p><strong>Email:</strong> ${body.email}</p>
            <p><strong>Phone:</strong> ${body.phone || "Not provided"}</p>
            <p><strong>Subject:</strong> ${body.subject}</p>
            <p><strong>Message:</strong><br/>${body.message}</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
