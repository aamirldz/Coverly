"use client";

import { useProductStore } from "@/hooks/useProducts";
import { PHONE_MODELS } from "@/lib/utils";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// ═══════════════════════════════════════════
// PHONE MODEL SELECTOR — Clean, premium design
// Product thumbnail cards, search bar, brand tabs
// ═══════════════════════════════════════════

function inferSeries(brand: string, model: string): string {
  if (brand === "Apple") {
    const match = model.match(/iPhone (\d+)/);
    return match ? `iPhone ${match[1]}` : "iPhone";
  }
  if (brand === "Samsung") {
    if (model.includes("Z Fold")) return "Z Fold";
    if (model.includes("Z Flip")) return "Z Flip";
    const match = model.match(/Galaxy (S\d+)/);
    return match ? `Galaxy ${match[1]}` : "Galaxy";
  }
  return brand;
}

export default function PhoneModelSelector() {
  const router = useRouter();
  const { products, initProducts } = useProductStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => { initProducts(); }, [initProducts]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { products: [], models: [] };
    const q = searchQuery.toLowerCase();
    const matchedProducts = products
      .filter((p) => p.status === "published" && (
        p.name.toLowerCase().includes(q) || p.phoneModel.toLowerCase().includes(q) ||
        p.phoneBrand.toLowerCase().includes(q) || p.caseType.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
      )).slice(0, 5);
    const modelSet = new Set(matchedProducts.map((p) => p.phoneModel));
    products.filter((p) => p.status === "published" && p.phoneModel.toLowerCase().includes(q))
      .forEach((p) => modelSet.add(p.phoneModel));
    return { products: matchedProducts, models: [...modelSet].slice(0, 4) };
  }, [searchQuery, products]);

  const hasResults = searchResults.products.length > 0 || searchResults.models.length > 0;

  // Brands
  const brands = useMemo(() => {
    const bp = products.filter((p) => p.showInDeviceSelector !== false && p.status === "published");
    const bs = [...new Set(bp.map((p) => p.phoneBrand))];
    return bs.length > 0 ? bs : ["Apple", "Samsung"];
  }, [products]);

  const [activeBrand, setActiveBrand] = useState<string>(brands[0] || "Apple");
  useEffect(() => {
    if (brands.length > 0 && !brands.includes(activeBrand)) setActiveBrand(brands[0]);
  }, [brands, activeBrand]);

  // Models grouped by series — FILTERED by active brand
  const brandModels = useMemo(() => {
    const dp = products.filter(
      (p) => p.showInDeviceSelector !== false && p.status === "published" && p.phoneBrand === activeBrand
    );
    const seriesMap: Record<string, string[]> = {};
    dp.forEach((p) => {
      const series = inferSeries(activeBrand, p.phoneModel);
      if (!seriesMap[series]) seriesMap[series] = [];
      if (!seriesMap[series].includes(p.phoneModel)) seriesMap[series].push(p.phoneModel);
    });
    if (Object.keys(seriesMap).length === 0 && (activeBrand === "Apple" || activeBrand === "Samsung")) {
      return PHONE_MODELS[activeBrand as "Apple" | "Samsung"];
    }
    return seriesMap;
  }, [products, activeBrand]);

  // Model data: count + thumbnail (ONLY from same brand)
  const modelData = useMemo(() => {
    const data: Record<string, { count: number; image: string }> = {};
    products.filter((p) => p.status === "published" && p.phoneBrand === activeBrand).forEach((p) => {
      if (!data[p.phoneModel]) {
        data[p.phoneModel] = { count: 0, image: p.images[0] || "" };
      }
      data[p.phoneModel].count++;
    });
    return data;
  }, [products, activeBrand]);

  const handleModelClick = (model: string) => {
    router.push(`/products/model/${encodeURIComponent(model)}`);
  };

  return (
    <section id="phones" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fafafa] via-white to-[#fafafa]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-accent text-[11px] font-bold uppercase tracking-[0.25em] mb-3">
            Select Your Device
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary">
            Choose Your Phone
          </h2>
          <p className="text-sm text-text-secondary mt-3 max-w-md mx-auto">
            Find the perfect case — tailored protection for every model
          </p>
        </div>

        {/* Search Bar */}
        <div ref={searchRef} className="max-w-lg mx-auto mb-10 relative">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
              onFocus={() => setShowResults(true)}
              placeholder="Search by phone model, case type, or product..."
              className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-gray-200 bg-white text-[13px] text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/8 transition-all"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setShowResults(false); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {showResults && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-30 max-h-[400px] overflow-y-auto">
              {!hasResults ? (
                <div className="p-6 text-center">
                  <p className="text-text-secondary text-sm">No results for &ldquo;{searchQuery}&rdquo;</p>
                  <p className="text-text-muted text-xs mt-1">Try a different search term</p>
                </div>
              ) : (
                <>
                  {searchResults.models.length > 0 && (
                    <div className="p-3">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-3 mb-1">Phone Models</p>
                      {searchResults.models.map((model) => {
                        const md = modelData[model] || { count: 0, image: "" };
                        return (
                          <button key={model} onClick={() => { handleModelClick(model); setShowResults(false); setSearchQuery(""); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left group">
                            <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                              {md.image ? <Image src={md.image} alt={model} width={36} height={36} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-gray-400"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 1h-8A2.5 2.5 0 005 3.5v17A2.5 2.5 0 007.5 23h8a2.5 2.5 0 002.5-2.5v-17A2.5 2.5 0 0015.5 1z" /></svg></div>}
                            </div>
                            <div className="flex-1"><p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">{model}</p>
                              <p className="text-[10px] text-text-muted">{md.count} cases</p></div>
                            <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {searchResults.products.length > 0 && (
                    <div className="p-3 border-t border-gray-50">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-3 mb-1">Products</p>
                      {searchResults.products.map((product) => (
                        <Link key={product.id} href={`/products/${product.slug}`}
                          onClick={() => { setShowResults(false); setSearchQuery(""); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                          <div className="w-10 h-10 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                            {product.images[0] && <Image src={product.images[0]} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">{product.name}</p>
                            <p className="text-[10px] text-text-muted">{product.phoneModel} · ₹{product.price.toLocaleString("en-IN")}</p>
                          </div>
                          {product.badge && <span className="text-[9px] font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full">{product.badge}</span>}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Brand Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                activeBrand === brand
                  ? "bg-text-primary text-white shadow-lg"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
              }`}
            >
              {brand === "Apple" ? (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
                </svg>
              )}
              {brand === "Apple" ? "iPhone" : brand}
            </button>
          ))}
        </div>

        {/* Model Grid */}
        <div className="space-y-10">
          {Object.entries(brandModels).map(([series, models]) => (
            <div key={series}>
              {/* Series label */}
              <div className="flex items-center gap-4 mb-5">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-[11px] text-text-muted uppercase tracking-[0.15em] font-semibold whitespace-nowrap">{series}</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Cards */}
              <div className="flex overflow-x-auto sm:flex-wrap sm:overflow-visible justify-start sm:justify-center gap-2.5 sm:gap-4 pb-2 sm:pb-0 scrollbar-hide">
                {(models as string[]).map((model) => {
                  const data = modelData[model] || { count: 0, image: "" };
                  return (
                    <button
                      key={model}
                      onClick={() => handleModelClick(model)}
                      className="group relative w-[85px] sm:w-[170px] flex-shrink-0 bg-white rounded-xl sm:rounded-2xl border border-gray-150 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 overflow-hidden"
                    >
                      {/* Product image thumbnail */}
                      <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-white overflow-hidden">
                        {data.image ? (
                          <Image
                            src={data.image}
                            alt={model}
                            fill
                            className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                            sizes="170px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-200" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M15.5 1h-8A2.5 2.5 0 005 3.5v17A2.5 2.5 0 007.5 23h8a2.5 2.5 0 002.5-2.5v-17A2.5 2.5 0 0015.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z" />
                            </svg>
                          </div>
                        )}
                        {/* Count badge */}
                        {data.count > 0 && (
                          <span className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 bg-accent text-white text-[8px] sm:text-[10px] font-bold min-w-[18px] h-[18px] sm:min-w-[22px] sm:h-[22px] rounded-full flex items-center justify-center shadow-sm">
                            {data.count}
                          </span>
                        )}
                      </div>
                      {/* Label */}
                      <div className="px-2 py-2 sm:px-3 sm:py-3 border-t border-gray-100">
                        <p className="text-[11px] sm:text-[13px] font-semibold text-text-primary group-hover:text-accent transition-colors leading-tight">
                          {model.replace("iPhone ", "").replace("Galaxy ", "")}
                        </p>
                        <p className="text-[10px] text-accent mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          View Cases →
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
