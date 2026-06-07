import Button from "@/components/ui/Button";
import Link from "next/link";

// ═══════════════════════════════════════════
// 404 — BRANDED NOT FOUND PAGE
// Premium feel, consistent with LuxeWrap design
// ═══════════════════════════════════════════

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20">
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
            <Button href="/">
              ← BACK TO HOME
            </Button>
            <Button href="/#products" variant="outline">
              SHOP PRODUCTS
            </Button>
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
  );
}
