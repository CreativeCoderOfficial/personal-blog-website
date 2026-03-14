// src/app/api/donations/create-payment-intent/route.ts
//
// This is the server-side API route for creating a Stripe Payment Intent.
//
// FLOW:
//   1. Frontend calls POST /api/donations/create-payment-intent with { amount: 10 }
//   2. This route validates the amount, calls Stripe to register the payment,
//      and returns a clientSecret back to the browser.
//   3. The browser uses the clientSecret with Stripe Elements to securely
//      complete the payment — our server never touches raw card data.
//

import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialise the Stripe client with your secret key.
// The `!` tells TypeScript "I know this env var exists" — if it's missing at
// runtime, Stripe's constructor will throw a clear error.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});


// Stripe requires a minimum charge of €0.50 (50 cents)
const MIN_AMOUNT_EUR = 1;
const MAX_AMOUNT_EUR = 1000;

// ─────────────────────────────────────────────────────────────
// POST /api/donations/create-payment-intent
// ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    // ── Step 1: Parse the request body ──────────────────────
    // We expect something like: { "amount": 10 }
    const body = await request.json();
    const { amount } = body;

    // ── Step 2: Validate the amount ─────────────────────────
    // typeof check: amount must be a number, not a string or undefined
    if (typeof amount !== "number" || !isFinite(amount)) {
      return NextResponse.json(
        { error: "Invalid amount: must be a number." },
        { status: 400 }
      );
    }

    // Range check: enforce our min/max bounds
    if (amount < MIN_AMOUNT_EUR || amount > MAX_AMOUNT_EUR) {
      return NextResponse.json(
        {
          error: `Amount must be between €${MIN_AMOUNT_EUR} and €${MAX_AMOUNT_EUR}.`,
        },
        { status: 400 }
      );
    }

    // ── Step 3: Convert euros to cents ──────────────────────
    // Stripe always works in the SMALLEST currency unit.
    // For euros: €10.00 → 1000 cents.
    const amountInCents = Math.round(amount * 100);

    // ── Step 4: Create the Payment Intent on Stripe ─────────
    // A Payment Intent represents a single payment attempt.
    // Stripe uses it to track the payment through its lifecycle  (created → processing → succeeded / failed).
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "eur",       
      // "automatic_payment_methods" tells Stripe to figure out which payment
      // methods are available based on my Stripe Dashboard settings.
      automatic_payment_methods: {
        enabled: true,
      },
      
      // Attach metadata to tell the payment came from the donation_form
      metadata: {
        source: "donation_form",
      },
    });

    // ── Step 5: Return the clientSecret ─────────────────────
    // The clientSecret is a temporary, single-use token that the browser passes to Stripe Elements to authorise the payment.
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    // log for debugging on server
    console.error("[create-payment-intent] Stripe error:", error);

    // Return a generic message to the client 
    return NextResponse.json(
      { error: "Failed to create payment. Please try again." },
      { status: 500 }
    );
  }
}