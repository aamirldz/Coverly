import Link from "next/link";

// ═══════════════════════════════════════════
// 404 — BRANDED NOT FOUND PAGE
// Premium feel, consistent with LuxeWrap design
// ═══════════════════════════════════════════

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Mini Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-heading font-bold text-text-primary">LUXEWRAP</span>
            <span className="text-[10px] text-accent font-semibold tracking-widest">INDIA</span>
          </Link>
        </div>
      </nav>

      {/* 404 Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* Animated 404 */}
          <div className="relative mb-8">
            <span className="text-[160px] font-heading font-bold text-gray-100 leading-none block select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-heading font-bold text-text-primary mb-3">
            Page Not Found
          </h1>
          <p className="text-text-secondary text-base mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-accent hover:bg-accent-dark text-white font-bold px-8 py-3.5 rounded-xl transition-all text-sm hover:shadow-glow"
            >
              ← BACK TO HOME
            </Link>
            <Link
              href="/#products"
              className="border-2 border-gray-200 hover:border-accent text-text-secondary hover:text-accent font-bold px-8 py-3.5 rounded-xl transition-all text-sm"
            >
              SHOP PRODUCTS
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-xs text-text-muted mb-4 uppercase tracking-widest font-medium">Popular Pages</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/#products" className="text-sm text-accent hover:underline font-medium">All Products</Link>
              <span className="text-gray-300">|</span>
              <Link href="/track-order" className="text-sm text-accent hover:underline font-medium">Track Order</Link>
              <span className="text-gray-300">|</span>
              <Link href="/#testimonials" className="text-sm text-accent hover:underline font-medium">Reviews</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
