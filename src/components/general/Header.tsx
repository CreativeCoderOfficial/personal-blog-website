// app/components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import NavLink from "./NavLink"; // Adjust path if NavLink is in a different subfolder
import ActiveDot from "../ui/ActiveDot"; // Adjust path if ActiveDot is elsewhere

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  
  // State for the "Active Dot" animation (Desktop only)
  const [dotStyle, setDotStyle] = useState<{ left: number } | null>(null);
  const [activeDotStyle, setActiveDotStyle] = useState<{ left: number } | null>(null);

  // Single source of truth for navigation items
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/resources", label: "Resources" },
    { href: "/blogs", label: "Blogs" },
    { href: "/support", label: "My Channel" },
  ];

  return (
    <header
      className="
        relative flex justify-between items-center
        px-8 py-4
        bg-gradient-to-r
        from-[#0b1023] via-[#111633] to-[#0b1023]
        border-b border-white/10
        z-50
      "
    >
      {/* Logo */}
      <Link
        href="/"
        className="
          text-xl font-extrabold
          bg-clip-text text-transparent
          bg-gradient-to-r
          from-orange-600 to-pink-500
        "
      >
        Portofolio
      </Link>

      {/* --- DESKTOP NAVIGATION --- */}
      <nav
        className="relative hidden md:flex items-center gap-6"
        onMouseLeave={() => setDotStyle(activeDotStyle)}
      >
        {navLinks.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            // These props enable the desktop-only dot animation
            setDotStyle={setDotStyle}
            setActiveDotStyle={setActiveDotStyle}
          >
            {link.label}
          </NavLink>
        ))}

        {/* The Sliding Dot */}
        <ActiveDot style={dotStyle} />
      </nav>

      {/* --- MOBILE HAMBURGER BUTTON --- */}
      <button
        className="block md:hidden text-2xl text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* --- MOBILE NAVIGATION --- */}
      {isOpen && (
        <nav className="
          absolute top-full left-0 w-full
                  bg-gradient-to-r        from-[#0b1023] via-[#111633] to-[#0b1023]
          border-t border-white/10
          shadow-2xl
          md:hidden
          transition-all duration-300 ease-in-out
        ">
          <div className="flex flex-col items-center gap-4 py-8">
            {navLinks.map((link) => (
              <NavLink 
                key={link.href} 
                href={link.href} 
                className="w-3/4 text-center py-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}