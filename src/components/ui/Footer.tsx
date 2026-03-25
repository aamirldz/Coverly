import Link from "next/link";

// ═══════════════════════════════════════════
// FOOTER — Compact single-row layout (Light Theme)
// All info in a tight horizontal strip
// ═══════════════════════════════════════════

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Main — compact 4-col */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-3">
              <span className="text-lg font-heading font-bold text-text-primary">LUXEWRAP</span>
              <span className="text-[10px] text-accent font-bold tracking-widest ml-1.5">INDIA</span>
            </Link>
            <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
              Premium phone cases. Military-grade protection meets stunning design.
            </p>
            {/* Social */}
            <div className="flex gap-2">
              {[
                { href: "https://www.instagram.com/luxewrap.in", label: "IG", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { href: "https://www.facebook.com/share/1C2PvvZdDR/", label: "FB", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { href: "https://www.youtube.com/@LuxeWrapIndia", label: "YT", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors group shadow-sm" aria-label={s.label}>
                  <svg className="w-3 h-3 text-text-secondary group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[11px] font-bold text-text-primary uppercase tracking-wider mb-3">Quick Links</h3>
            <ul className="space-y-1.5">
              {[
                { href: "/", label: "Home" },
                { href: "/#phones", label: "All Products" },
                { href: "/#phones", label: "iPhone Cases" },
                { href: "/#phones", label: "Samsung Cases" },
                { href: "/track-order", label: "Track Order" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[12px] text-text-secondary hover:text-accent transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-[11px] font-bold text-text-primary uppercase tracking-wider mb-3">Policies</h3>
            <ul className="space-y-1.5">
              {[
                { href: "/policies/shipping", label: "Shipping" },
                { href: "/policies/returns", label: "Returns & Refund" },
                { href: "/policies/privacy", label: "Privacy" },
                { href: "/policies/terms", label: "Terms" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[12px] text-text-secondary hover:text-accent transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-bold text-text-primary uppercase tracking-wider mb-3">Contact</h3>
            <ul className="space-y-1.5">
              <li>
                <a href="https://wa.me/917888756837" target="_blank" rel="noopener noreferrer" className="text-[12px] text-text-secondary hover:text-accent transition-colors">
                  📞 +91 78887 56837
                </a>
              </li>
              <li>
                <a href="mailto:support@luxewrapindia.com" className="text-[12px] text-text-secondary hover:text-accent transition-colors">
                  ✉️ support@luxewrapindia.com
                </a>
              </li>
              <li className="text-[12px] text-text-secondary">📍 India</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-1">
          <p className="text-[10px] text-text-muted">© {new Date().getFullYear()} LuxeWrap India. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-text-muted">🔒 Secure Payments</span>
            <span className="text-[10px] text-text-muted">🇮🇳 Made for India</span>
            <Link href="/admin/login" className="text-[10px] text-text-muted/40 hover:text-accent transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
