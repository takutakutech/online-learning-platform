import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-05-28.basil' });

export async function POST(req: NextRequest) {
  const { userId, email } = await req.json();
  // Stripeの価格IDをここに記入（ダッシュボードで確認）
  const priceId = process.env.STRIPE_PRICE_ID!;
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      { price: priceId, quantity: 1 },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/premium`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/register`,
    metadata: { userId },
  });
  return NextResponse.json({ url: session.url });
}
