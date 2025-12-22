// app/components/Header.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import NavLink from "./NavLink";
import ActiveDot from "../ui/ActiveDot";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [dotStyle, setDotStyle] = useState<{ left: number } | null>(null);
  const [activeDotStyle, setActiveDotStyle] = useState<{ left: number } | null>(null);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/resources", label: "Resources" },
    { href: "/blogs", label: "Blogs" },
    { href: "/donate", label: "My Channel" },
  ];

  return (
    <header
      className="
        relative flex justify-between items-center
        px-8 py-4
        bg-gradient-to-r
        from-[#0b1023] via-[#111633] to-[#0b1023]
        border-b border-white/10
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

      {/* Desktop nav */}
      <nav
        className="relative hidden md:flex items-center gap-6"
        onMouseLeave={() => setDotStyle(activeDotStyle)}
      >
        {navLinks.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            setDotStyle={setDotStyle}
            setActiveDotStyle={setActiveDotStyle}
          >
            {link.label}
          </NavLink>
        ))}

        <ActiveDot style={dotStyle} />
      </nav>

      {/* Mobile hamburger */}
      <button
        className="block md:hidden text-2xl"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Mobile menu unchanged */}
      {isOpen && (
        <nav className="
          absolute top-full left-0 w-full
          bg-[#1a0f23]
          border-t border-white/10
          z-50
          md:hidden
        ">
          <div className="flex flex-col items-center gap-2 py-4">
            <NavLink href="/" className="w-3/4 text-center">Home</NavLink>
            <NavLink href="/resources" className="w-3/4 text-center">Resources</NavLink>
            <NavLink href="/blogs" className="w-3/4 text-center">Blogs</NavLink>
            <NavLink href="/donate" className="w-3/4 text-center">Donate</NavLink>
          </div>
        </nav>
      )}
    </header>
  );
}
