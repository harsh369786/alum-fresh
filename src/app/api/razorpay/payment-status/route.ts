import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get('id');

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const payment = await razorpay.payments.fetch(paymentId);
    
    return NextResponse.json({
      status: payment.status,
      method: payment.method,
      amount: Number(payment.amount) / 100,
      email: payment.email,
      contact: payment.contact,
      created_at: payment.created_at,
    });
  } catch (error: any) {
    console.error("Razorpay fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch payment status" }, { status: 500 });
  }
}
