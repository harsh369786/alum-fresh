import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("orders")
      .insert([{
        user_name: body.user_name,
        user_email: body.user_email,
        user_phone: body.user_phone,
        address: body.address,
        items: body.items,
        subtotal: body.subtotal,
        discount: body.discount || 0,
        discount_code: body.discount_code,
        shipping: body.shipping,
        total: body.total,
        notes: body.notes,
        status: "pending",
      }])
      .select()
      .single();

    if (error) throw error;

    // Send confirmation email
    if (process.env.GMAIL_SENDER_EMAIL && process.env.GMAIL_APP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: process.env.GMAIL_SENDER_EMAIL, pass: process.env.GMAIL_APP_PASSWORD },
        });

        const itemsHtml = body.items.map((item: any) => `
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #1a1a2e;color:#F0EDF8;">${item.name} ${item.variant ? `(${item.variant})` : ""} ${item.size ? `${item.size}` : ""}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #1a1a2e;color:#F0EDF8;text-align:center;">${item.qty}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #1a1a2e;color:#00D4C8;text-align:right;">₹${(item.price * item.qty).toLocaleString("en-IN")}</td>
          </tr>
        `).join("");

        await transporter.sendMail({
          from: `"Alum Fresh" <${process.env.GMAIL_SENDER_EMAIL}>`,
          to: body.user_email,
          subject: `Order Confirmed — Alum Fresh #${data.id.slice(0,8).toUpperCase()}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
            <body style="margin:0;padding:0;background:#08070F;font-family:'Inter',Arial,sans-serif;">
              <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
                <!-- Header -->
                <div style="text-align:center;margin-bottom:32px;">
                  <h1 style="margin:0;font-size:28px;font-weight:900;background:linear-gradient(135deg,#00D4C8,#A084CA,#D63AF9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Alum Fresh</h1>
                  <p style="color:#00D4C8;margin:8px 0 0;font-size:14px;">Your order is confirmed 🌿</p>
                </div>

                <!-- Order ID -->
                <div style="background:#0E0B1A;border:1px solid rgba(0,212,200,0.2);border-radius:16px;padding:20px;margin-bottom:24px;text-align:center;">
                  <p style="color:rgba(240,237,248,0.5);font-size:12px;margin:0 0 4px;">Order ID</p>
                  <p style="color:#00D4C8;font-size:20px;font-weight:900;margin:0;letter-spacing:2px;">#${data.id.slice(0,8).toUpperCase()}</p>
                </div>

                <!-- Greeting -->
                <p style="color:#F0EDF8;font-size:16px;margin-bottom:24px;">Hi ${body.user_name.split(" ")[0]}, thank you for your order! We&apos;re preparing it for dispatch.</p>

                <!-- Items Table -->
                <div style="background:#0E0B1A;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;margin-bottom:24px;">
                  <table style="width:100%;border-collapse:collapse;">
                    <thead>
                      <tr style="background:#130F22;">
                        <th style="padding:10px 12px;text-align:left;color:rgba(240,237,248,0.5);font-size:12px;font-weight:500;">Product</th>
                        <th style="padding:10px 12px;text-align:center;color:rgba(240,237,248,0.5);font-size:12px;font-weight:500;">Qty</th>
                        <th style="padding:10px 12px;text-align:right;color:rgba(240,237,248,0.5);font-size:12px;font-weight:500;">Price</th>
                      </tr>
                    </thead>
                    <tbody>${itemsHtml}</tbody>
                  </table>
                  <div style="padding:12px;border-top:1px solid rgba(255,255,255,0.08);">
                    ${body.discount > 0 ? `<div style="display:flex;justify-content:space-between;padding:4px 0;"><span style="color:rgba(240,237,248,0.5);">Discount (${body.discount_code})</span><span style="color:#00D4C8;">-₹${body.discount.toLocaleString("en-IN")}</span></div>` : ""}
                    <div style="display:flex;justify-content:space-between;padding:4px 0;"><span style="color:rgba(240,237,248,0.5);">Shipping</span><span style="color:${body.shipping === 0 ? "#00D4C8" : "#F0EDF8"};">${body.shipping === 0 ? "FREE" : "₹" + body.shipping}</span></div>
                    <div style="display:flex;justify-content:space-between;padding:8px 0 0;border-top:1px solid rgba(255,255,255,0.08);margin-top:8px;">
                      <span style="color:#F0EDF8;font-weight:700;">Total</span>
                      <span style="color:#00D4C8;font-size:20px;font-weight:900;">₹${body.total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <!-- Delivery Address -->
                <div style="background:#0E0B1A;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;margin-bottom:24px;">
                  <p style="color:rgba(240,237,248,0.5);font-size:12px;margin:0 0 8px;">Delivering to</p>
                  <p style="color:#F0EDF8;margin:0;">${body.address.line1}<br/>${body.address.city}, ${body.address.state} — ${body.address.pincode}</p>
                </div>

                <!-- Footer -->
                <div style="text-align:center;padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);">
                  <p style="color:rgba(240,237,248,0.5);font-size:13px;">Expected delivery: 3–5 business days</p>
                  <p style="color:rgba(240,237,248,0.5);font-size:12px;margin-top:16px;">Made with 🌿 in India &nbsp;·&nbsp; <a href="mailto:hello@alumfresh.in" style="color:#00D4C8;text-decoration:none;">hello@alumfresh.in</a></p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
      }
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
