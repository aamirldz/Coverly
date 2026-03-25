"use client";

import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import type { Product, FilterState } from "@/types";

// ═══════════════════════════════════════════
// PRODUCT GRID — Responsive card grid + filter/sort bar
// 4 columns desktop, 2 columns mobile
// Sticky filter bar with DYNAMIC brand/type pills + sort dropdown
// Pills auto-generated from actual product data
// ═══════════════════════════════════════════

interface ProductGridProps {
  products: Product[];
  initialBrand?: string | null;
  initialType?: string | null;
}

// Build filter pills dynamically from products
function buildFilterPills(products: Product[]) {
  const pills: { label: string; value: string | null; type?: "brand" | "caseType" }[] = [
    { label: "All", value: null },
  ];

  // Known label mappings for cleaner display
  const brandLabels: Record<string, string> = { Apple: "iPhone", Samsung: "Samsung" };
  const caseTypeLabels: Record<string, string> = {
    MagSafe: "MagSafe",
    "Carbon Fiber": "Carbon Fiber",
    "Aramid Fiber": "Aramid",
    Cute: "Cute 💖",
  };

  // Collect unique brands
  const brands = [...new Set(products.map((p) => p.phoneBrand))];
  brands.forEach((brand) => {
    pills.push({
      label: brandLabels[brand] || brand,
      value: brand,
      type: "brand",
    });
  });

  // Collect unique case types
  const caseTypes = [...new Set(products.map((p) => p.caseType))];
  caseTypes.forEach((ct) => {
    pills.push({
      label: caseTypeLabels[ct] || ct,
      value: ct,
      type: "caseType",
    });
  });

  return pills;
}

const SORT_OPTIONS = [
  { label: "Popular", value: "popular" as const },
  { label: "Newest", value: "newest" as const },
  { label: "Price: Low to High", value: "price-asc" as const },
  { label: "Price: High to Low", value: "price-desc" as const },
];

export default function ProductGrid({
  products,
  initialBrand = null,
  initialType = null,
}: ProductGridProps) {
  const [filters, setFilters] = useState<FilterState>({
    brand: initialBrand,
    model: null,
    caseType: initialType,
    material: null,
    sortBy: "popular",
  });

  // Dynamic filter pills from actual product data
  const filterPills = useMemo(() => buildFilterPills(products), [products]);

  // ── FILTER & SORT LOGIC ──
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by brand
    if (filters.brand) {
      result = result.filter((p) => p.phoneBrand === filters.brand);
    }

    // Filter by case type
    if (filters.caseType) {
      result = result.filter((p) => p.caseType === filters.caseType);
    }

    // Filter by material
    if (filters.material) {
      result = result.filter((p) => p.material === filters.material);
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
      default:
        // Featured first, then by badge (BESTSELLER first)
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.badge === "BESTSELLER" && b.badge !== "BESTSELLER") return -1;
          if (a.badge !== "BESTSELLER" && b.badge === "BESTSELLER") return 1;
          return 0;
        });
        break;
    }

    return result;
  }, [products, filters]);

  const handlePillClick = (pill: ReturnType<typeof buildFilterPills>[number]) => {
    if (pill.value === null) {
      setFilters((prev) => ({ ...prev, brand: null, caseType: null }));
    } else if (pill.type === "brand") {
      setFilters((prev) => ({
        ...prev,
        brand: prev.brand === pill.value ? null : pill.value,
        caseType: null,
      }));
    } else if (pill.type === "caseType") {
      setFilters((prev) => ({
        ...prev,
        caseType: prev.caseType === pill.value ? null : (pill.value as string),
        brand: null,
      }));
    }
  };

  const isActive = (pill: ReturnType<typeof buildFilterPills>[number]) => {
    if (pill.value === null && !filters.brand && !filters.caseType) return true;
    if (pill.type === "brand") return filters.brand === pill.value;
    if (pill.type === "caseType") return filters.caseType === pill.value;
    return false;
  };

  return (
    <section className="w-full">
      {/* ── FILTER BAR ── */}
      <div className="sticky top-[88px] z-30 glass py-3 px-3 sm:px-4 mb-6 rounded-xl">
        {/* Filter Pills — horizontal scroll on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          {filterPills.map((pill) => (
            <button
              key={pill.label}
              onClick={() => handlePillClick(pill)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                isActive(pill)
                  ? "bg-accent text-white"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200 hover:text-text-primary"
              }`}
            >
              {pill.label}
            </button>
          ))}

          {/* Sort Dropdown — inline on mobile too */}
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: e.target.value as FilterState["sortBy"],
              }))
            }
            className="ml-auto bg-gray-100 text-text-secondary text-xs rounded-lg px-3 py-1.5 border border-gray-200 focus:border-accent focus:outline-none flex-shrink-0"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── PRODUCT COUNT ── */}
      <p className="text-xs text-text-muted mb-4 px-1">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* ── PRODUCT GRID ── */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-text-secondary">No products found</p>
          <button
            onClick={() =>
              setFilters({
                brand: null,
                model: null,
                caseType: null,
                material: null,
                sortBy: "popular",
              })
            }
            className="text-accent text-sm mt-2 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
