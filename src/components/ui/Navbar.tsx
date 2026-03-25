"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore, getCartItemCount } from "@/hooks/useCart";
import { useProductStore } from "@/hooks/useProducts";
import { useRouter } from "next/navigation";

// ═══════════════════════════════════════════
// NAVBAR — Fixed navigation with glass blur
// Logo | Home | Shop (dropdown) | Track Order | Search + Cart
// Shop dropdown is dynamically built from product data
// ═══════════════════════════════════════════

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const itemCount = getCartItemCount(items);
  const { products, initProducts } = useProductStore();

  useEffect(() => { initProducts(); }, [initProducts]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic brands and case types from product data
  const brands = [...new Set(products.filter((p) => p.status === "published").map((p) => p.phoneBrand))];
  const caseTypes = [...new Set(products.filter((p) => p.status === "published").map((p) => p.caseType))];

  const handleScrollToPhones = () => {
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
    const el = document.getElementById("phones");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`transition-all duration-300 ${
        scrolled
          ? "py-2 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm"
          : "py-4 bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* === LOGO === */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-heading font-bold text-text-primary group-hover:text-accent transition-colors">
            LUXEWRAP
          </span>
          <span className="text-xs font-body text-accent font-semibold tracking-widest">
            INDIA
          </span>
        </Link>

        {/* === DESKTOP NAV LINKS === */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm text-text-secondary hover:text-accent transition-colors font-medium"
          >
            Home
          </Link>

          {/* Shop Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShopDropdownOpen(true)}
            onMouseLeave={() => setShopDropdownOpen(false)}
          >
            <button className="text-sm text-text-secondary hover:text-accent transition-colors font-medium flex items-center gap-1">
              Shop
              <svg
                className={`w-3 h-3 transition-transform ${
                  shopDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {shopDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl p-5 animate-fade-in shadow-xl border border-gray-100">
                {/* By Brand */}
                <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2 font-semibold">
                  By Brand
                </p>
                {(brands.length > 0 ? brands : ["Apple", "Samsung"]).map((brand) => (
                  <button
                    key={brand}
                    onClick={() => {
                      // Find first model of this brand and navigate to model page
                      const firstModel = products.find((p) => p.phoneBrand === brand && p.status === "published");
                      if (firstModel) router.push(`/products/model/${encodeURIComponent(firstModel.phoneModel)}`);
                      setShopDropdownOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 py-2 text-sm text-text-secondary hover:text-accent transition-colors rounded-lg hover:bg-accent/5 px-2"
                  >
                    {brand === "Apple" ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" /></svg>
                    )}
                    {brand === "Apple" ? "iPhone Cases" : `${brand} Cases`}
                  </button>
                ))}

                <div className="border-t border-gray-100 my-3"></div>

                {/* By Type */}
                <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2 font-semibold">
                  By Type
                </p>
                {(caseTypes.length > 0 ? caseTypes : ["MagSafe", "Carbon Fiber", "Aramid Fiber", "Cute"]).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      handleScrollToPhones();
                    }}
                    className="w-full text-left py-2 text-sm text-text-secondary hover:text-accent transition-colors rounded-lg hover:bg-accent/5 px-2"
                  >
                    {type === "Cute" ? "Cute Covers 💖" : type}
                  </button>
                ))}

                <div className="border-t border-gray-100 my-3"></div>

                {/* Browse all */}
                <button
                  onClick={handleScrollToPhones}
                  className="w-full text-center py-2.5 text-sm font-semibold text-accent bg-accent/5 rounded-xl hover:bg-accent/10 transition-colors"
                >
                  Browse All Devices →
                </button>
              </div>
            )}
          </div>

          <Link
            href="/track-order"
            className="text-sm text-text-secondary hover:text-accent transition-colors font-medium"
          >
            Track Order
          </Link>
        </div>

        {/* === RIGHT ICONS === */}
        <div className="flex items-center gap-4">
          {/* Search — scrolls to phone selector search bar */}
          <button
            onClick={handleScrollToPhones}
            className="text-text-secondary hover:text-accent transition-colors"
            aria-label="Search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Cart */}
          <button
            onClick={() => toggleCart()}
            className="relative text-text-secondary hover:text-accent transition-colors"
            aria-label="Shopping cart"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-text-secondary hover:text-accent transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* === MOBILE MENU === */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white mt-2 mx-4 rounded-xl p-4 animate-slide-down shadow-lg border border-gray-100">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-3 text-text-primary hover:text-accent transition-colors font-medium border-b border-gray-100"
          >
            Home
          </Link>
          <button
            onClick={handleScrollToPhones}
            className="block w-full text-left py-3 text-text-primary hover:text-accent transition-colors font-medium border-b border-gray-100"
          >
            🔍 Find Your Case
          </button>
          {(brands.length > 0 ? brands : ["Apple", "Samsung"]).map((brand) => (
            <button
              key={brand}
              onClick={() => {
                const firstModel = products.find((p) => p.phoneBrand === brand && p.status === "published");
                if (firstModel) router.push(`/products/model/${encodeURIComponent(firstModel.phoneModel)}`);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-3 text-text-secondary hover:text-accent transition-colors"
            >
              {brand === "Apple" ? "iPhone Cases" : `${brand} Cases`}
            </button>
          ))}
          <Link
            href="/track-order"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-3 text-accent font-medium"
          >
            📦 Track Order
          </Link>
        </div>
      )}
    </nav>
  );
}
