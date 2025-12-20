// src/app/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="
      mt-24
      bg-gradient-to-r
      from-[#0b1023] via-[#111633] to-[#0b1023]
      border-t border-white/10
      text-sm
    ">
      <div className="
        max-w-7xl mx-auto
        px-8 py-16
        grid gap-12
        md:grid-cols-3
      ">
        {/* Brand / Description */}
        <div>
          <h3 className="
            text-xl font-bold
            bg-clip-text text-transparent
            bg-gradient-to-r
            from-orange-500 to-pink-500
          ">
            My Portfolio
          </h3>
          <p className="mt-4 text-white/70 max-w-sm">
            Creating content and sharing knowledge through blogs and resources.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="mb-4 font-semibold text-orange-400">
            Navigation
          </h4>
          <ul className="space-y-3 text-white/70">
            <li><Link href="/" className="hover:text-white transition">Home</Link></li>
            <li><Link href="/resources" className="hover:text-white transition">Resources</Link></li>
            <li><Link href="/blogs" className="hover:text-white transition">Blogs</Link></li>
            <li><Link href="/donate" className="hover:text-white transition">Donate</Link></li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 className="mb-4 font-semibold text-orange-400">
            Connect
          </h4>
          <ul className="space-y-3 text-white/70">
            <li>
              <a
                href="mailto:your@email.com"
                className="hover:text-white transition"
              >
                Email
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                className="hover:text-white transition"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                className="hover:text-white transition"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="
        border-t border-white/10
        py-6 text-center
        text-white/60
      ">
        © {new Date().getFullYear()} My Portfolio. All rights reserved.
      </div>
    </footer>
  );
}
