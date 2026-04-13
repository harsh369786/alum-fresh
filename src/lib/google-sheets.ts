import { google } from "googleapis";

/**
 * Appends a new order row to the specified Google Sheet.
 * Requires the following environment variables:
 * - GOOGLE_SHEET_ID: The ID of your Google Sheet.
 * - GOOGLE_SERVICE_ACCOUNT_EMAIL: The email of your service account.
 * - GOOGLE_PRIVATE_KEY: The private key of your service account.
 */
export async function appendOrderToSheet(order: any) {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!spreadsheetId || !clientEmail || !privateKey) {
      console.warn("⚠️ Google Sheets credentials missing. Skipping Sheet update.");
      return;
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Format IST Date
    const istDate = new Date(new Date(order.created_at || new Date()).getTime() + 5.5 * 60 * 60 * 1000)
      .toISOString()
      .replace("T", " ")
      .split(".")[0];

    // Format Items summary
    const itemsSummary = Array.isArray(order.items)
      ? order.items
          .map((i: any) => `${i.name} (${i.variant || "Standard"}, ${i.size || "50ml"}) x${i.qty}`)
          .join(" | ")
      : "";

    // Format Address
    const addressStr = order.address
      ? `${order.address.line1}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`
      : "N/A";

    const rowValue = [
      order.order_number || order.id, // Order ID
      istDate,                      // Date
      order.user_name,               // Name
      order.user_email,              // Email
      order.user_phone || "N/A",     // Phone
      addressStr,                    // Address
      itemsSummary,                  // Items
      order.subtotal,                // Subtotal
      order.discount || 0,           // Discount
      order.discount_code || "N/A",  // Promo Code
      order.shipping,                // Shipping
      order.total,                   // Total
      order.status || "pending",     // Status
      order.notes || "",             // Notes
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:N", // Assumes first sheet is "Sheet1" and columns A to N
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowValue],
      },
    });

    console.log(`✅ Order ${order.order_number || order.id} synced to Google Sheets.`);
  } catch (error) {
    console.error("❌ Error appending to Google Sheets:", error);
  }
}
