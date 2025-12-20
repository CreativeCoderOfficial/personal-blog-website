// src/app/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="
      mt-24
      /* Use the new token variables for the gradient */
      bg-gradient-to-r from-main via-secondary to-main
      /* Use the subtle border token */
      border-t border-border-subtle
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
            /* Gradient using your brand accent tokens */
            bg-gradient-to-r from-accent-orange to-accent-pink
          ">
            My Portfolio
          </h3>
          <p className="mt-4 text-text-secondary max-w-sm">
            Creating content and sharing knowledge through blogs and resources.
          </p>
        </div>

        {/* Navigation */}
        <div>
          {/* Section headers use the accent orange token directly */}
          <h4 className="mb-4 font-semibold text-accent-orange">
            Navigation
          </h4>
          <ul className="space-y-3 text-text-secondary">
            {/* Hover state turns text to the primary (brightest) white */}
            <li><Link href="/" className="hover:text-text-primary transition-colors">Home</Link></li>
            <li><Link href="/resources" className="hover:text-text-primary transition-colors">Resources</Link></li>
            <li><Link href="/blogs" className="hover:text-text-primary transition-colors">Blogs</Link></li>
            <li><Link href="/donate" className="hover:text-text-primary transition-colors">Donate</Link></li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 className="mb-4 font-semibold text-accent-orange">
            Connect
          </h4>
          <ul className="space-y-3 text-text-secondary">
            <li>
              <a href="mailto:your@email.com" className="hover:text-text-primary transition-colors">
                Email
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" className="hover:text-text-primary transition-colors">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://github.com" target="_blank" className="hover:text-text-primary transition-colors">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="
        border-t border-border-subtle
        py-6 text-center
        text-text-secondary opacity-60
      ">
        © {new Date().getFullYear()} My Portfolio. All rights reserved.
      </div>
    </footer>
  );
}