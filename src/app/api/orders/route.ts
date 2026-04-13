import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import nodemailer from "nodemailer";
import { appendOrderToSheet } from "@/lib/google-sheets";

const hasSupabase = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
);

/**
 * Generates a custom order number in YYMMDDSRNO format (e.g. 2604110001).
 * YYMMDD = date in IST, SRNO = zero-padded daily serial (starting at 01).
 */
async function generateOrderNumber(): Promise<string> {
  // Get current date in IST (UTC+5:30)
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // ms
  const istDate = new Date(now.getTime() + istOffset);
  const yy = String(istDate.getUTCFullYear()).slice(-2);
  const mm = String(istDate.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(istDate.getUTCDate()).padStart(2, "0");
  const prefix = `${yy}${mm}${dd}`;

  if (hasSupabase) {
    // Count orders placed today (using IST midnight boundaries in UTC)
    const todayStartIST = new Date(Date.UTC(
      istDate.getUTCFullYear(), istDate.getUTCMonth(), istDate.getUTCDate()
    ));
    todayStartIST.setTime(todayStartIST.getTime() - istOffset); // convert back to UTC midnight IST

    const tomorrowStartIST = new Date(todayStartIST.getTime() + 24 * 60 * 60 * 1000);

    const supabase = createServerSupabaseClient();
    const { count } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayStartIST.toISOString())
      .lt("created_at", tomorrowStartIST.toISOString());

    const srNo = String((count || 0) + 1).padStart(2, "0");
    return `${prefix}${srNo}`;
  } else {
    // Demo mode: use a random 2-digit serial
    const srNo = String(Math.floor(Math.random() * 99) + 1).padStart(2, "0");
    return `${prefix}${srNo}`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.user_name || !body.user_email || !body.address || !body.items?.length) {
      return NextResponse.json({ error: "Missing required order fields" }, { status: 400 });
    }

    let orderId: string;
    let orderNumber: string;
    let orderData: any;

    // Generate custom YYMMDDSRNO order number
    orderNumber = await generateOrderNumber();

    if (hasSupabase) {
      // Production: Save to Supabase
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
          order_number: orderNumber,
        }])
        .select()
        .single();

      if (error) throw error;
      orderId = data.id;
      orderNumber = data.order_number || orderNumber; // use DB value if returned
      orderData = data;
    } else {
      // Demo/Dev mode: No DB, just use the generated order number
      orderId = orderNumber;
      orderData = { id: orderNumber, order_number: orderNumber, ...body, status: "pending", created_at: new Date().toISOString() };
      console.log("📦 [DEMO MODE] Order placed:", { orderNumber, customer: body.user_name, total: body.total });
    }

    // Send confirmation email (optional — skipped if not configured)
    if (process.env.GMAIL_SENDER_EMAIL && process.env.GMAIL_APP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: process.env.GMAIL_SENDER_EMAIL, pass: process.env.GMAIL_APP_PASSWORD },
        });

        const shortId = orderNumber; // e.g. 2604110001
        const itemsHtml = body.items.map((item: any) => `
          <tr>
            <td style="padding:10px 14px;border-bottom:1px solid #ede8dc;color:#2c2c2c;font-family:Georgia,serif;">${item.name} ${item.variant ? `(${item.variant})` : ""} ${item.size || ""}</td>
            <td style="padding:10px 14px;border-bottom:1px solid #ede8dc;color:#7a7068;text-align:center;">×${item.qty}</td>
            <td style="padding:10px 14px;border-bottom:1px solid #ede8dc;color:#5a7a5a;text-align:right;font-weight:bold;">₹${(item.price * item.qty).toLocaleString("en-IN")}</td>
          </tr>
        `).join("");

        const sharedHtmlStyling = (heading: string, subheading: string, intro: string) => `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
            <body style="margin:0;padding:0;background:#f8f4ed;font-family:'DM Sans',Arial,sans-serif;">
              <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
                <div style="text-align:center;margin-bottom:40px;">
                  <h1 style="margin:0;font-size:32px;font-weight:400;font-style:italic;color:#2c2c2c;font-family:Georgia,serif;">The Aura <span style="color:#5a7a5a;">Company</span></h1>
                  <p style="color:#8faf8f;margin:8px 0 0;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;">${heading}</p>
                </div>

                <div style="background:#ffffff;border:1px solid #ede8dc;border-radius:24px;padding:28px;margin-bottom:20px;text-align:center;">
                  <p style="color:#7a7068;font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.15em;">${subheading}</p>
                  <p style="color:#2c2c2c;font-size:22px;font-weight:900;margin:0;letter-spacing:3px;font-family:monospace;">#${shortId}</p>
                </div>

                <p style="color:#2c2c2c;font-size:16px;margin-bottom:24px;font-family:Georgia,serif;font-style:italic;">${intro}</p>

                <div style="background:#ffffff;border:1px solid #ede8dc;border-radius:24px;overflow:hidden;margin-bottom:20px;">
                  <table style="width:100%;border-collapse:collapse;">
                    <thead>
                      <tr style="background:#f8f4ed;">
                        <th style="padding:12px 14px;text-align:left;color:#7a7068;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;">Product</th>
                        <th style="padding:12px 14px;text-align:center;color:#7a7068;font-size:11px;font-weight:600;text-transform:uppercase;">Qty</th>
                        <th style="padding:12px 14px;text-align:right;color:#7a7068;font-size:11px;font-weight:600;text-transform:uppercase;">Price</th>
                      </tr>
                    </thead>
                    <tbody>${itemsHtml}</tbody>
                  </table>
                  <div style="padding:14px 14px 18px;background:#f8f4ed;">
                    ${body.discount > 0 ? `<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;"><span style="color:#7a7068;">Discount (${body.discount_code})</span><span style="color:#5a7a5a;">-₹${body.discount.toLocaleString("en-IN")}</span></div>` : ""}
                    <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;"><span style="color:#7a7068;">Shipping</span><span style="color:${body.shipping === 0 ? "#5a7a5a" : "#2c2c2c"};">${body.shipping === 0 ? "Complimentary" : "₹" + body.shipping}</span></div>
                    <div style="display:flex;justify-content:space-between;padding:10px 0 0;border-top:1px solid #ede8dc;margin-top:8px;">
                      <span style="color:#2c2c2c;font-weight:700;font-size:15px;">Total</span>
                      <span style="color:#5a7a5a;font-size:20px;font-weight:900;">₹${body.total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div style="background:#ffffff;border:1px solid #ede8dc;border-radius:24px;padding:20px;margin-bottom:24px;">
                  <p style="color:#7a7068;font-size:11px;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.15em;">Customer & Delivery Details</p>
                  <p style="color:#2c2c2c;margin:0;font-style:italic;font-family:Georgia,serif;">
                    <strong>${body.user_name}</strong> (${body.user_email} ${body.user_phone ? `| ${body.user_phone}` : ""})<br/><br/>
                    ${body.address.line1}<br/>${body.address.city}, ${body.address.state} — ${body.address.pincode}
                  </p>
                </div>

                <!-- 
                <div style="text-align:center;margin-bottom:30px;">
                  <a href="${req.nextUrl.origin}/api/invoice?id=${orderId}" target="_blank" style="display:inline-block;padding:14px 28px;background-color:#5a7a5a;color:#ffffff;text-decoration:none;border-radius:30px;font-family:sans-serif;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Download Official Invoice</a>
                </div>
                -->

                <div style="text-align:center;padding-top:24px;border-top:1px solid #ede8dc;">
                  <p style="color:#7a7068;font-size:13px;">The Aura Company E-Commerce Engine</p>
                </div>
              </div>
            </body>
            </html>
        `;

        // 1. Email to Customer
        await transporter.sendMail({
          from: `"The Aura Company" <${process.env.GMAIL_SENDER_EMAIL}>`,
          to: body.user_email,
          subject: `Order Confirmed — The Aura Company #${shortId}`,
          html: sharedHtmlStyling(
            "Your order is confirmed 🌿", 
            "Order Reference", 
            `Hi ${body.user_name.split(" ")[0]}, your natural selection is being prepared with care.`
          ),
        });

        // 2. Email to Admin (Sales)
        await transporter.sendMail({
          from: `"The Aura Company System" <${process.env.GMAIL_SENDER_EMAIL}>`,
          to: "sales.theauracompany@gmail.com",
          subject: `New Order Received! [${body.user_name}] — #${shortId}`,
          html: sharedHtmlStyling(
            "Incoming Revenue 💰", 
            "New Order Registered", 
            `A new order of <strong>₹${body.total.toLocaleString("en-IN")}</strong> has been placed by <strong>${body.user_name}</strong>. Please prepare for fulfillment.`
          ),
        });
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
        // Don't fail the order if email fails
      }
    }

    // 3. Sync to Google Sheets in Real-time
    await appendOrderToSheet(orderData);

    return NextResponse.json({ id: orderNumber, order_number: orderNumber, uuid: orderId, ...orderData });
  } catch (err: any) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: err.message || "Failed to place order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!hasSupabase) {
      return NextResponse.json([]);
    }
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

export async function PUT(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    
    if (hasSupabase) {
      const supabase = createServerSupabaseClient();
      const { error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
