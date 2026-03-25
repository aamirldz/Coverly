"use client";

// ═══════════════════════════════════════════
// SKELETON LOADERS — Premium loading states
// Used when product data is loading
// ═══════════════════════════════════════════

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-100" />
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-100 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="flex gap-2 mt-2">
          <div className="h-5 bg-gray-100 rounded-full w-16" />
          <div className="h-5 bg-gray-50 rounded-full w-12" />
        </div>
        <div className="h-10 bg-gray-100 rounded-xl w-full mt-3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Image skeleton */}
        <div className="lg:col-span-3">
          <div className="aspect-square bg-gray-100 rounded-2xl" />
          <div className="flex gap-2 mt-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-16 h-16 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-4 bg-gray-100 rounded-full w-20" />
          <div className="h-8 bg-gray-100 rounded-full w-3/4" />
          <div className="h-4 bg-gray-100 rounded-full w-full" />
          <div className="h-4 bg-gray-100 rounded-full w-2/3" />

          <div className="flex gap-3 pt-2">
            <div className="h-8 bg-gray-100 rounded-full w-24" />
            <div className="h-8 bg-gray-50 rounded-full w-20" />
            <div className="h-6 bg-green-50 rounded-full w-16" />
          </div>

          <div className="h-px bg-gray-100 my-4" />

          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded-full w-16" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 bg-gray-100 rounded-full" />
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="h-3 bg-gray-100 rounded-full w-20" />
            <div className="h-10 bg-gray-100 rounded-xl w-full" />
          </div>

          <div className="flex gap-3 pt-4">
            <div className="h-12 bg-accent/20 rounded-xl flex-1" />
            <div className="h-12 bg-gray-100 rounded-xl flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      <div className="h-8 bg-gray-100 rounded-full w-40 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="h-6 bg-gray-100 rounded-full w-48 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 h-72">
          <div className="h-6 bg-gray-100 rounded-full w-32 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-100 rounded-full w-24" />
                <div className="h-4 bg-gray-100 rounded-full w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
