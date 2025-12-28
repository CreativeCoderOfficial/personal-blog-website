"use client";

import { useState } from "react";
import { CreditCard, Heart, CheckCircle2, Sparkles } from "lucide-react";

const PRESET_AMOUNTS = [5, 10, 25, 50];

export default function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(10);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isMentioned, setIsMentioned] = useState(false);

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
        
        {/* --- NEW: IMPACT SECTION --- */}
        <div className="mb-10 border-b border-border-subtle pb-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent-orange/10 text-accent-orange">
                    <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">Why Support?</h3>
            </div>
            
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
                Your contribution directly fuels the creation of free, high-quality educational content. 
                It allows me to move away from sponsored fluff and focus on deep-dive engineering topics.
            </p>

            <ul className="space-y-3">
                {[
                    "Covering server costs for open-source demos",
                    "Upgrading recording gear for better video quality",
                    "Dedicating time to write in-depth documentation"
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
            Select Amount (USD)
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
                ${amount}
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

        {/* 2. PAYMENT METHOD */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`
                flex items-center justify-center gap-2 py-3 rounded-xl border transition-all
                ${paymentMethod === "card"
                  ? "bg-accent-purple/10 border-accent-purple text-accent-purple"
                  : "bg-main border-border-subtle text-text-secondary hover:bg-card"
                }
              `}
            >
              <CreditCard className="w-4 h-4" />
              <span className="font-semibold text-sm">Card</span>
            </button>

            <button
              onClick={() => setPaymentMethod("paypal")}
              className={`
                flex items-center justify-center gap-2 py-3 rounded-xl border transition-all
                ${paymentMethod === "paypal"
                  ? "bg-blue-500/10 border-blue-500 text-blue-400"
                  : "bg-main border-border-subtle text-text-secondary hover:bg-card"
                }
              `}
            >
              <span className="font-bold italic text-sm">Pay</span><span className="font-bold italic text-blue-400 text-sm">Pal</span>
            </button>
          </div>
        </div>

        {/* 3. CONFIRM BUTTON */}
        <button className="
          w-full py-4 rounded-xl font-bold text-lg
          bg-gradient-to-r from-accent-orange to-orange-600
          text-white shadow-lg shadow-orange-500/20
          hover:scale-[1.02] active:scale-[0.98]
          transition-all duration-300
        ">
          Donate ${selectedAmount === "custom" ? (customAmount || "0") : selectedAmount}
        </button>

        <div className="flex items-center justify-center gap-2 mt-4 opacity-60">
            <CheckCircle2 className="w-3 h-3 text-text-secondary" />
            <p className="text-center text-xs text-text-secondary">
            Secure payment processing
            </p>
        </div>

      </div>
    </div>
  );
}