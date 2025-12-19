"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  setDotStyle?: (style: { left: number }) => void;
  setActiveDotStyle?: (style: { left: number }) => void;
}

export default function NavLink({
  href,
  children,
  className = "",
  setDotStyle,
  setActiveDotStyle,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isActive && ref.current && setActiveDotStyle && setDotStyle) {
      const left =
        ref.current.offsetLeft + ref.current.offsetWidth / 2 - 2;

      setActiveDotStyle({ left });
      setDotStyle({ left });
    }
  }, [isActive, setActiveDotStyle, setDotStyle]);

  const handleHover = () => {
    if (ref.current && setDotStyle) {
      const left =
        ref.current.offsetLeft + ref.current.offsetWidth / 2 - 2;
      setDotStyle({ left });
    }
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseEnter={handleHover}
      className={`
        px-4 py-2 rounded-md text-sm font-semibold
        transition-all duration-300 ease-out transform
        ${
          isActive
            ? "text-orange-400 -translate-y-1 bg-white/10"
            : "text-white/80 hover:text-orange-400 hover:-translate-y-1 hover:bg-orange-400/10"
        }
        ${className}
      `}
    >
      {children}
    </Link>
  );
}
