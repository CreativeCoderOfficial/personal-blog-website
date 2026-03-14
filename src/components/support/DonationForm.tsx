// src/components/support/DonationForm.tsx
//
// The main donation UI component. Handles the full payment flow:
//   1. User selects a preset or custom amount
//   2. On "Donate" click → calls our API to create a Stripe Payment Intent
//   3. Stripe returns a clientSecret → we initialise Stripe Elements
//   4. User fills in card details inside Stripe's <PaymentElement>
//   5. On confirm → stripe.confirmPayment() processes the charge
//   6. Show success or error state
//
//   This component owns the full payment flow. DonationModal is just a shell.
//   This means the form works identically whether rendered inside a modal
//   (via DonateBox) or inline on the /support page — no prop changes needed.

"use client";

import { useState, useEffect } from "react";
import { CreditCard, Heart, CheckCircle2, Sparkles, Loader2, AlertCircle, PartyPopper } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,           
  PaymentElement,    
  useStripe,          
  useElements,      
} from "@stripe/react-stripe-js";

// ── Stripe initialisation ────────────────────────────────────
// loadStripe() is called OUTSIDE the component to avoid re-initialising
// Stripe on every render. It returns a Promise that resolves to the Stripe
// object. We pass it directly to <Elements> below.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PRESET_AMOUNTS = [5, 10, 25, 50];

// ── Types ────────────────────────────────────────────────────
// Describes which "screen" the form is currently showing
type FormStep =
  | "select"   // Step 1: user picks an amount
  | "payment"  // Step 2: Stripe PaymentElement is shown
  | "success"  // Step 3: payment confirmed
  | "error";   // Step 3 (alt): payment failed


// ─────────────────────────────────────────────────────────────
// PaymentForm
//
// ─────────────────────────────────────────────────────────────
interface PaymentFormProps {
  amount: number;           
  onSuccess: () => void;    
  onError: (msg: string) => void; 
  onBack: () => void;     
}

function PaymentForm({ amount, onSuccess, onError, onBack }: PaymentFormProps) {
  const stripe = useStripe();

  const elements = useElements();

  // Loading state for the confirm button
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    // Stripe and elements are null until Stripe.js has fully loaded.
    // This prevents the user from submitting before the SDK is ready.
    if (!stripe || !elements) return;

    setIsConfirming(true);

    // confirmPayment() does two things:
    //   1. Validates the PaymentElement input (shows inline errors if invalid)
    //   2. Sends the payment to Stripe using the clientSecret from the Elements provider
    //
    // We set redirect: "if_required" so Stripe only redirects for payment methods
    // that require it (like iDEAL bank redirects). 
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // This URL is where Stripe redirects for payment methods that require leaving the site (e.g. iDEAL, Bancontact). 
        // For card payments this URL is not used, but it's still required by the Stripe API.
        return_url: `${window.location.origin}/support?donated=true`,
      },
      redirect: "if_required",
    });

    setIsConfirming(false);

    if (error) {
      onError(error.message ?? "An unexpected error occurred.");
    } else {
      onSuccess();
    }
  };

  return (
    <div>
      {/* Back button — lets user change the amount without reloading */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        ← Back
      </button>

      {/* Amount reminder — shows the user what they're about to pay */}
      <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-main border border-border-subtle">
        <span className="text-sm text-text-secondary">Donation amount</span>
        <span className="font-bold text-text-primary text-lg">€{amount}</span>
      </div>

      {/* Stripe's PaymentElement — renders a secure, hosted card input */}
      <div className="mb-6">
        <PaymentElement />
      </div>

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        disabled={!stripe || !elements || isConfirming}
        className="
          w-full py-4 rounded-xl font-bold text-lg
          bg-gradient-to-r from-accent-orange to-orange-600
          text-white shadow-lg shadow-orange-500/20
          hover:scale-[1.02] active:scale-[0.98]
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
        "
      >
        {/* Show a spinner while confirming so the user knows something is happening */}
        {isConfirming ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </span>
        ) : (
          `Confirm €${amount} donation`
        )}
      </button>

      {/* Security reassurance */}
      <div className="flex items-center justify-center gap-2 mt-4 opacity-60">
        <CheckCircle2 className="w-3 h-3 text-text-secondary" />
        <p className="text-center text-xs text-text-secondary">
          Secure payment powered by Stripe
        </p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT: DonationForm
// ─────────────────────────────────────────────────────────────
export default function DonationForm() {
  // ── State ──────────────────────────────────────────────────
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(10);
  const [customAmount, setCustomAmount] = useState("");

  // Which screen we're on: amount selection → payment → success/error
  const [step, setStep] = useState<FormStep>("select");

  // The clientSecret returned by our API — needed to initialise Stripe Elements. If null it means Elements haven't been set up yet
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // The final amount the user confirmed (stored separately so it doesn't change
  // if the user somehow modifies state after moving to the payment step)
  const [confirmedAmount, setConfirmedAmount] = useState<number>(0);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ── Derived value: the actual numeric amount to charge ─────
  // helper to get the numeric amount
  // If "custom" is selected, parse the input string. Otherwise use the preset number.
  // Falls back to 0 if the custom input is empty or invalid.
  const numericAmount: number =
    selectedAmount === "custom"
      ? parseFloat(customAmount) || 0
      : selectedAmount;

  const handleDonateClick = async () => {
    // Minimum of 1 EUR needed
    if (numericAmount < 1) return;

    setIsCreatingIntent(true);

    try {
      // Call our API route to create a Stripe Payment Intent.
      // The server returns a clientSecret tied to this specific amount.
      const response = await fetch("/api/donations/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numericAmount }),
      });

      const data = await response.json();

      if (!response.ok) {
        // The server returned a validation or Stripe error
        throw new Error(data.error || "Failed to initiate payment.");
      }

      // Store the clientSecret and the confirmed amount, then advance to the payment step
      setClientSecret(data.clientSecret);
      setConfirmedAmount(numericAmount);
      setStep("payment");

    } catch (err: unknown) {
      // Show the error in the UI rather than crashing
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setErrorMessage(message);
      setStep("error");
    } finally {
      setIsCreatingIntent(false);
    }
  };
 


  // ── Stripe Elements appearance config - to match site theme ─────────────────────
  const stripeAppearance = {
    theme: "night" as const, // Stripe's built-in dark theme
    variables: {
      colorPrimary: "#f97316",    
      colorBackground: "#1a1f2e",  
      colorText: "#e2e8f0",        
      colorTextSecondary: "#94a3b8", 
      colorDanger: "#ef4444",       
      borderRadius: "12px",         
      fontFamily: "inherit",        
    },
  };


  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="
      p-8 md:p-10 rounded-3xl
      bg-card border border-border-subtle
      shadow-2xl shadow-black/50
      relative overflow-hidden
    ">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-orange/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10">

        {/*  --- ON SUCCESS --> NEW SUCCESS SCREEN */}
        {step === "success" && (
          <div className="text-center py-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-accent-orange/10">
                <PartyPopper className="w-10 h-10 text-accent-orange" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">
              Thank you so much! 🧡
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-8">
              Your €{confirmedAmount} donation really means a lot to me. Thanks so much for your support, this covers server & maintenance costs and helps me create valuable content!
            </p>
            {/* Reset button */}
            <button
              onClick={() => {
                setStep("select");
                setClientSecret(null);
                setCustomAmount("");
                setSelectedAmount(10);
              }}
              className="text-sm text-text-secondary hover:text-text-primary underline transition-colors"
            >
              Make another donation
            </button>
          </div>
        )}

        {/* -- ON ERROR --> SHOW ERROR MESSAGE */}
        {step === "error" && (
          <div className="text-center py-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-red-500/10">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">
              Payment failed unfortunately! Please try again
            </h3>
            <p className="text-text-secondary text-sm mb-8">
              {errorMessage}
            </p>
            {/* Go back to amount selection so the user can try again */}
            <button
              onClick={() => {
                setStep("select");
                setClientSecret(null);
                setErrorMessage("");
              }}
              className="
                px-6 py-3 rounded-xl font-bold text-sm
                bg-main border border-border-subtle
                text-text-primary hover:border-text-secondary
                transition-colors
              "
            >
              Try again
            </button>
          </div>
        )}

        {/* ── AMOUNT SELECTION STATE ─────────────────────────── */}
        {step === "select" && (
          <>
            {/* --- IMPACT SECTION --- */}
            <div className="mb-10 border-b border-border-subtle pb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent-orange/10 text-accent-orange">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">Why Support?</h3>
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                Your contribution directly fuels the creation of free, high-quality educational content.
                It allows me to cover costs & dedicate time to creating valuable resources for everyone to use!
              </p>

              <ul className="space-y-3">
                {[
                  "Covering server and maintenance costs",
                  "Access & buy tools and products to review & give honest feedback for if they're worth it or not",
                  "Dedicating time & money to video-editing, research and content creation",
                  "Massive motivation boost for me, your support really keeps me going :)"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-accent-purple shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* --- HEADER --- */}
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-5 h-5 text-accent-orange fill-current" />
              <h3 className="text-lg font-bold text-text-primary">Make a Donation</h3>
            </div>

            {/* 1. AMOUNT SELECTION */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
                Select Amount (EUR)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {PRESET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => { setSelectedAmount(amount); setCustomAmount(""); }}
                    className={`
                      py-3 rounded-xl font-bold transition-all duration-200
                      ${selectedAmount === amount
                        ? "bg-accent-orange text-white shadow-lg shadow-accent-orange/20 scale-105"
                        : "bg-main border border-border-subtle text-text-secondary hover:border-accent-orange/50"
                      }
                    `}
                  >
                    €{amount}
                  </button>
                ))}

                {/* Custom Amount */}
                <div className="relative col-span-1 sm:col-span-1">
                  <input
                    type="number"
                    placeholder="Custom"
                    value={customAmount}
                    onFocus={() => setSelectedAmount("custom")}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount("custom");
                    }}
                    className={`
                      w-full h-full px-2 text-center rounded-xl bg-main border font-bold focus:outline-none transition-all
                      ${selectedAmount === "custom"
                        ? "border-accent-orange text-accent-orange"
                        : "border-border-subtle text-text-secondary focus:border-accent-orange"
                      }
                    `}
                  />
                </div>
              </div>
            </div>

          
  
            {/* 2. DONATE BUTTON */}
            <button
              onClick={handleDonateClick}
              // Disabled while waiting for the API, or if amount is below minimum
              disabled={isCreatingIntent || numericAmount < 1}
              className="
                w-full py-4 rounded-xl font-bold text-lg
                bg-gradient-to-r from-accent-orange to-orange-600
                text-white shadow-lg shadow-orange-500/20
                hover:scale-[1.02] active:scale-[0.98]
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
              "
            >
              {isCreatingIntent ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Preparing payment...
                </span>
              ) : (
                // Show 0 if custom field is empty, so the button always has a label
                `Donate €${selectedAmount === "custom" ? (customAmount || "0") : selectedAmount}`
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 opacity-60">
              <CheckCircle2 className="w-3 h-3 text-text-secondary" />
              <p className="text-center text-xs text-text-secondary">
                Secure payment processing by Stripe
              </p>
            </div>
          </>
        )}

        {/* ── PAYMENT STATE ──────────────────────────────────── */}
        {step === "payment" && clientSecret && (
          // <Elements> is the Stripe React provider. It must wrap any component that uses useStripe() or useElements() — in our case, PaymentForm.
          // We pass:
          //   stripe   → the loaded Stripe.js instance
          //   options  → includes the clientSecret (links this Elements instance
          //              to our specific Payment Intent) and the appearance config
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: stripeAppearance,
            }}
          >
            <PaymentForm
              amount={confirmedAmount}
              onSuccess={() => setStep("success")}
              onError={(msg) => { setErrorMessage(msg); setStep("error"); }}
              onBack={() => { setStep("select"); setClientSecret(null); }}
            />
          </Elements>
        )}

      </div>
    </div>
  );
}