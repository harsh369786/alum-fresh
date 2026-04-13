import { NextRequest, NextResponse } from "next/server";
// import { createServerSupabaseClient } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// INVOICE FEATURE — TEMPORARILY DISABLED
// To re-enable:
//   1. Remove the early-return block (lines marked DISABLED below)
//   2. Uncomment the import above
//   3. Uncomment the /* RE-ENABLE START ... RE-ENABLE END */ block
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(_req: NextRequest) {
  // DISABLED ▼ remove this block to re-enable invoice feature
  return NextResponse.json(
    { error: "Invoice feature is temporarily unavailable." },
    { status: 503 }
  );
  // DISABLED ▲

  /* RE-ENABLE START ──────────────────────────────────────────────────────────
  try {
    const { searchParams } = new URL(_req.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const shortId =
      String(order.id).length >= 8
        ? String(order.id).slice(0, 8).toUpperCase()
        : String(order.id).toUpperCase();

    // Extract payment ID from notes
    let paymentId = "N/A";
    if (order.notes && order.notes.includes("[Razorpay Payment ID:")) {
      const match = order.notes.match(/\[Razorpay Payment ID:\s*(.*?)\]/);
      if (match && match[1]) paymentId = match[1];
    }

    const itemsHtml = Array.isArray(order.items)
      ? order.items
          .map(
            (item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #ede8dc;">
          <strong>${item.name}</strong><br/>
          <span style="font-size: 11px; color: #7a7068;">Variant: ${item.variant} | Size: ${item.size}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #ede8dc; text-align: center;">${item.qty}</td>
        <td style="padding: 12px; border-bottom: 1px solid #ede8dc; text-align: right;">Rs. ${(item.price * item.qty).toLocaleString("en-IN")}</td>
      </tr>
    `
          )
          .join("")
      : "";

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice #${shortId}</title>
      <style>
        body { font-family: 'Georgia', serif; color: #2c2c2c; background: #fff; margin: 0; padding: 40px; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #ede8dc; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #5a7a5a; padding-bottom: 20px; }
        .header h1 { margin: 0; color: #5a7a5a; font-style: italic; }
        .header p { margin: 5px 0; color: #7a7068; font-size: 14px; font-family: sans-serif; }
        .details { display: flex; justify-content: space-between; margin-bottom: 40px; font-family: sans-serif; font-size: 14px; }
        .details h3 { font-family: 'Georgia', serif; font-style: italic; border-bottom: 1px solid #ede8dc; padding-bottom: 5px; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-family: sans-serif; font-size: 14px; }
        th { padding: 12px; background: #f8f4ed; text-align: left; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; color: #7a7068; }
        th.right { text-align: right; }
        th.center { text-align: center; }
        .totals { width: 50%; float: right; font-family: sans-serif; font-size: 14px; }
        .totals-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ede8dc; }
        .totals-row.final { font-weight: bold; font-size: 18px; color: #5a7a5a; border-bottom: none; border-top: 2px solid #5a7a5a; margin-top: 5px; padding-top: 10px; }
        .footer { clear: both; text-align: center; color: #7a7068; font-size: 12px; padding-top: 50px; margin-top: 50px; border-top: 1px dashed #ede8dc; font-family: sans-serif; }
      </style>
    </head>
    <body onload="window.print()">
      <div class="invoice-box">
        <div class="header">
          <div>
            <h1>The Aura Company</h1>
            <p>123 Natural Avenue, Mumbai, Maharashtra</p>
            <p>GSTIN: 08AABCU9603R1ZX</p>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 24px; font-weight: bold; color: #2c2c2c;">INVOICE</p>
            <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN')}</p>
            <p><strong>Order #:</strong> ${shortId}</p>
            <p><strong>Payment ID:</strong> ${paymentId}</p>
          </div>
        </div>

        <div class="details">
          <div style="width: 45%;">
            <h3>Billed To</h3>
            <p><strong>${order.user_name}</strong></p>
            <p>${order.user_email}</p>
            <p>${order.user_phone}</p>
          </div>
          <div style="width: 45%;">
            <h3>Shipped To</h3>
            <p>${order.address?.line1}</p>
            <p>${order.address?.city}, ${order.address?.state}</p>
            <p>${order.address?.pincode}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="center">Qty</th>
              <th class="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal</span>
            <span>Rs. ${(order.subtotal || 0).toLocaleString("en-IN")}</span>
          </div>
          ${
            (order.discount || 0) > 0
              ? `
          <div class="totals-row">
            <span>Discount (${order.discount_code || ""})</span>
            <span style="color: #5a7a5a;">-Rs. ${order.discount.toLocaleString("en-IN")}</span>
          </div>
          `
              : ""
          }
          <div class="totals-row">
            <span>Shipping</span>
            <span>${order.shipping === 0 ? "Complimentary" : "Rs. " + order.shipping}</span>
          </div>
          <div class="totals-row final">
            <span>Total Paid</span>
            <span>Rs. ${(order.total || 0).toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing natural wellness. This is a computer generated invoice and requires no signature.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="Invoice_${shortId}.html"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 });
  }
  RE-ENABLE END ──────────────────────────────────────────────────────────── */
}
