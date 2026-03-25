"use client";

// ═══════════════════════════════════════════
// ADMIN PRODUCTS — Unified Products + Inventory
// CRUD, stock management, alerts, search, filters
// ═══════════════════════════════════════════

import { useState, useMemo, useEffect, useCallback } from "react";
import { useAdminStore } from "@/hooks/useAdmin";
import { useProductStore } from "@/hooks/useProducts";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";

// ── VIEW MODES ──
type ViewMode = "catalog" | "stock";

// ── PRODUCT FORM MODAL ──
function ProductFormModal({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    mrp: product?.mrp || 0,
    costPrice: product?.costPrice || 0,
    phoneBrand: product?.phoneBrand || "Apple",
    phoneModel: product?.phoneModel || "iPhone 16 Pro",
    caseType: product?.caseType || "Carbon Fiber",
    material: product?.material || "carbon_fiber",
    color: product?.color || "Black",
    colorHex: product?.colorHex || "#000000",
    stockQty: product?.stockQty || 50,
    weight: product?.weight || 25,
    status: product?.status || "published",
    badge: product?.badge || "",
    featured: product?.featured || false,
    showInTrending: product?.showInTrending ?? true,
    showInDeviceSelector: product?.showInDeviceSelector ?? true,
    sku: product?.sku || "",
  });
  const [imageList, setImageList] = useState<string[]>(product?.images || []);
  const [uploading, setUploading] = useState(false);

  // Handle file upload — converts to base64 data URL
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const newImages: string[] = [];
    let processed = 0;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        newImages.push(reader.result as string);
        processed++;
        if (processed === files.length) {
          setImageList((prev) => [...prev, ...newImages]);
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
    // Reset the input so re-uploading the same file works
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImageList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
    const autoSku = form.sku || product?.sku || `LW-${String(Date.now()).slice(-6)}`;
    const newProduct: Product = {
      id: product?.id || `prod_${Date.now()}`,
      name: form.name,
      slug,
      description: form.description,
      price: Number(form.price),
      mrp: Number(form.mrp),
      phoneBrand: form.phoneBrand,
      phoneModel: form.phoneModel,
      caseType: form.caseType,
      material: form.material,
      color: form.color,
      colorHex: form.colorHex,
      stockQty: Number(form.stockQty),
      sku: autoSku,
      images: imageList.length > 0 ? imageList : (product?.images || []),
      videoUrl: product?.videoUrl || null,
      badge: (form.badge || null) as Product["badge"],
      status: form.status as Product["status"],
      featured: form.featured,
      showInTrending: form.showInTrending,
      showInDeviceSelector: form.showInDeviceSelector,
      costPrice: Number(form.costPrice) || Math.round(Number(form.price) * 0.3),
      weight: Number(form.weight),
      createdAt: product?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviews: product?.reviews || [],
    };
    onSave(newProduct);
  };

  const discount = form.mrp > form.price ? calculateDiscount(Number(form.price), Number(form.mrp)) : 0;
  const margin = form.price > 0 && form.costPrice > 0
    ? Math.round(((Number(form.price) - Number(form.costPrice)) / Number(form.price)) * 100)
    : 0;

  const inputClass = "w-full bg-gray-50 border border-gray-200 text-text-primary rounded-xl px-4 py-2.5 text-[13px] font-body focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all";
  const selectClass = inputClass + " bg-white appearance-none cursor-pointer";
  const labelClass = "block text-[10px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-1.5 font-body";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-body">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-heading font-bold text-text-primary">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-[11px] text-text-muted mt-0.5">{isEdit ? "Update product details" : "Fill in the product details below"}</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors p-1.5 hover:bg-gray-50 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Basic Info */}
          <div className="space-y-4">
            <p className="text-[11px] font-semibold text-accent uppercase tracking-[0.15em]">Basic Information</p>
            <div>
              <label className={labelClass}>Product Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Carbon Fiber Ultra Case" />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass + " resize-none h-20"} placeholder="Premium carbon fiber case with military-grade protection..." />
            </div>
          </div>

          {/* Pricing + Cost */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <p className="text-[11px] font-semibold text-accent uppercase tracking-[0.15em]">Pricing & Cost</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Selling Price (₹) *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>MRP (₹)</label>
                <input type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Cost Price (₹)</label>
                <input type="number" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Auto Calculated</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-accent/5 border border-accent/20 rounded-xl px-3 py-2.5 text-center">
                    <p className="text-[11px] text-accent font-bold">{discount}% OFF</p>
                    <p className="text-[8px] text-text-muted">Discount</p>
                  </div>
                  <div className="bg-success/5 border border-success/20 rounded-xl px-3 py-2.5 text-center">
                    <p className="text-[11px] text-success font-bold">{margin}% Margin</p>
                    <p className="text-[8px] text-text-muted">Profit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <p className="text-[11px] font-semibold text-accent uppercase tracking-[0.15em]">Product Details</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone Brand</label>
                <select value={form.phoneBrand} onChange={(e) => setForm({ ...form, phoneBrand: e.target.value })} className={selectClass}>
                  <option>Apple</option><option>Samsung</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Phone Model</label>
                <input type="text" value={form.phoneModel} onChange={(e) => setForm({ ...form, phoneModel: e.target.value })} className={inputClass} placeholder="iPhone 16 Pro" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Case Type</label>
                <select value={form.caseType} onChange={(e) => setForm({ ...form, caseType: e.target.value })} className={selectClass}>
                  <option>Carbon Fiber</option><option>Aramid Fiber</option><option>MagSafe</option><option>Cute</option><option>Hard Case</option><option>Soft Case</option><option>Bumper Case</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Material</label>
                <select value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className={selectClass}>
                  <option value="carbon_fiber">Carbon Fiber</option><option value="aramid">Aramid Fiber</option><option value="polycarbonate">Polycarbonate</option><option value="silicone">Silicone</option><option value="leather">Leather</option><option value="tpu">TPU</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Color Name</label>
                <input type="text" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Color</label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
                  <input type="color" value={form.colorHex} onChange={(e) => setForm({ ...form, colorHex: e.target.value })} className="w-7 h-7 rounded-lg border-0 cursor-pointer" />
                  <span className="text-[11px] text-text-muted font-mono">{form.colorHex}</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Stock Qty *</label>
                <input type="number" value={form.stockQty} onChange={(e) => setForm({ ...form, stockQty: Number(e.target.value) })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Weight (g)</label>
                <input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Images — File Upload */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <p className="text-[11px] font-semibold text-accent uppercase tracking-[0.15em]">Product Images</p>

            {/* Image Preview Grid */}
            {imageList.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {imageList.map((img, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                    <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-accent text-white text-[8px] font-bold px-1.5 py-0.5 rounded">MAIN</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 hover:border-accent rounded-xl cursor-pointer transition-colors bg-gray-50/50 hover:bg-accent/[0.02]">
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              {uploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  <span className="text-[12px] text-text-muted">Processing...</span>
                </div>
              ) : (
                <>
                  <svg className="w-7 h-7 text-text-muted mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="text-[12px] font-semibold text-text-secondary">Click to upload images</span>
                  <span className="text-[10px] text-text-muted mt-0.5">PNG, JPG, WEBP — max 5MB each</span>
                </>
              )}
            </label>
            <p className="text-[10px] text-text-muted">First image = main display image. You can upload multiple images.</p>
          </div>

          {/* Badge & Featured */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <p className="text-[11px] font-semibold text-accent uppercase tracking-[0.15em]">Badge & Visibility</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Product Badge</label>
                <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className={selectClass}>
                  <option value="">None</option>
                  <option value="NEW">🆕 New</option>
                  <option value="BESTSELLER">🔥 Bestseller</option>
                  <option value="LOW_STOCK">📉 Low Stock</option>
                  <option value="FOR_HER">💖 For Her</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>SKU Code</label>
                <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className={inputClass} placeholder="Auto-generated if empty" />
              </div>
            </div>
            <div className="space-y-3">
              {/* Featured toggle */}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div className={`relative w-10 h-5 rounded-full transition-colors ${form.featured ? 'bg-accent' : 'bg-gray-200'}`}
                  onClick={() => setForm({ ...form, featured: !form.featured })}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${form.featured ? 'left-[22px]' : 'left-0.5'}`} />
                </div>
                <div>
                  <span className="text-[12px] font-semibold text-text-secondary block">⭐ Featured on Homepage</span>
                </div>
              </label>
              {/* Show in Trending Now carousel */}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div className={`relative w-10 h-5 rounded-full transition-colors ${form.showInTrending ? 'bg-accent' : 'bg-gray-200'}`}
                  onClick={() => setForm({ ...form, showInTrending: !form.showInTrending })}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${form.showInTrending ? 'left-[22px]' : 'left-0.5'}`} />
                </div>
                <div>
                  <span className="text-[12px] font-semibold text-text-secondary block">🔥 Show in Trending Now</span>
                  <span className="text-[10px] text-text-muted">Appears in the trending carousel on homepage</span>
                </div>
              </label>
              {/* Show in Choose Your Phone device selector */}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div className={`relative w-10 h-5 rounded-full transition-colors ${form.showInDeviceSelector ? 'bg-accent' : 'bg-gray-200'}`}
                  onClick={() => setForm({ ...form, showInDeviceSelector: !form.showInDeviceSelector })}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${form.showInDeviceSelector ? 'left-[22px]' : 'left-0.5'}`} />
                </div>
                <div>
                  <span className="text-[12px] font-semibold text-text-secondary block">📱 Show in Choose Your Phone</span>
                  <span className="text-[10px] text-text-muted">Phone model shown in device selector section</span>
                </div>
              </label>
            </div>
            {/* Status */}
            <div className="flex gap-2 mt-3">
              {[
                { value: "published", label: "✅ Published", color: "bg-success/8 border-success/20 text-success" },
                { value: "draft", label: "📝 Draft", color: "bg-gray-50 border-gray-200 text-text-muted" },
                { value: "out_of_stock", label: "🚫 Out of Stock", color: "bg-error/8 border-error/20 text-error" },
              ].map((s) => (
                <label key={s.value} className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all text-[12px] font-semibold ${form.status === s.value ? s.color : "border-gray-200 text-text-muted bg-white hover:border-gray-300"}`}>
                  <input type="radio" name="status" value={s.value} checked={form.status === s.value} onChange={(e) => setForm({ ...form, status: e.target.value as "published" | "draft" | "out_of_stock" })} className="hidden" />
                  {s.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl flex items-center justify-between">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-[13px] font-medium text-text-secondary hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-accent text-white text-[13px] font-bold hover:bg-accent-dark hover:shadow-glow transition-all">{isEdit ? "Save Changes" : "Add Product"}</button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ──
export default function AdminProductsPage() {
  const adminStore = useAdminStore();
  const productStore = useProductStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("catalog");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Initialize shared product store + sync admin store
  useEffect(() => {
    productStore.initProducts();
  }, []);

  // Keep admin store in sync with shared product store
  useEffect(() => {
    if (productStore.products.length > 0) {
      adminStore.initData(productStore.products);
    }
  }, [productStore.products]);

  // Read products from shared store (single source of truth)
  const products = productStore.products;
  const orders = adminStore.orders;

  // Sold counts from orders
  const soldCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => { o.items.forEach((item) => { counts[item.productId] = (counts[item.productId] || 0) + item.quantity; }); });
    return counts;
  }, [orders]);

  // Inventory stats
  const inventoryStats = useMemo(() => {
    const totalUnits = products.reduce((s, p) => s + p.stockQty, 0);
    const totalRetailValue = products.reduce((s, p) => s + p.price * p.stockQty, 0);
    const totalCostValue = products.reduce((s, p) => s + p.costPrice * p.stockQty, 0);
    const inStock = products.filter((p) => p.stockQty > 5).length;
    const lowStock = products.filter((p) => p.stockQty > 0 && p.stockQty <= 5).length;
    const outOfStock = products.filter((p) => p.stockQty <= 0).length;
    const totalSold = Object.values(soldCounts).reduce((s, c) => s + c, 0);
    return { totalUnits, totalRetailValue, totalCostValue, inStock, lowStock, outOfStock, totalSold };
  }, [products, soldCounts]);

  // Filter products
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) || p.phoneModel.toLowerCase().includes(search.toLowerCase());
      if (viewMode === "catalog") {
        return matchesSearch && (statusFilter === "all" || p.status === statusFilter);
      } else {
        if (stockFilter === "in_stock") return matchesSearch && p.stockQty > 5;
        if (stockFilter === "low_stock") return matchesSearch && p.stockQty > 0 && p.stockQty <= 5;
        if (stockFilter === "out_of_stock") return matchesSearch && p.stockQty <= 0;
        return matchesSearch;
      }
    });
  }, [products, search, statusFilter, stockFilter, viewMode]);

  const counts = {
    all: products.length,
    published: products.filter((p) => p.status === "published").length,
    draft: products.filter((p) => p.status === "draft").length,
    out_of_stock: products.filter((p) => p.status === "out_of_stock").length,
  };

  // ── DUAL-STORE SYNC HANDLERS ──
  const handleSave = (product: Product) => {
    if (editProduct) {
      // Update in both stores
      productStore.updateProduct(editProduct.id, product);
      adminStore.updateProduct(editProduct.id, product);
    } else {
      // Add to both stores
      productStore.addProduct(product);
      adminStore.addProduct(product);
    }
    setShowModal(false);
    setEditProduct(null);
  };

  const handleStockChange = (productId: string, delta: number, currentStock: number) => {
    const newStock = Math.max(0, currentStock + delta);
    // Update in both stores
    productStore.updateProductStock(productId, newStock);
    adminStore.updateProductStock(productId, newStock);
  };

  const handleDelete = (productId: string) => {
    // Delete from both stores
    productStore.deleteProduct(productId);
    adminStore.deleteProduct(productId);
    setDeleteConfirm(null);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "published": return "bg-success/10 text-success";
      case "draft": return "bg-gray-100 text-text-muted";
      case "out_of_stock": return "bg-error/10 text-error";
      default: return "bg-gray-100 text-text-muted";
    }
  };

  const lowStockProducts = products.filter((p) => p.stockQty > 0 && p.stockQty <= 5);
  const outOfStockProducts = products.filter((p) => p.stockQty <= 0);

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-text-primary">Products</h2>
          <p className="text-xs text-text-muted mt-0.5">Manage your catalog, pricing, and stock levels.</p>
        </div>
        <button onClick={() => { setEditProduct(null); setShowModal(true); }}
          className="bg-accent hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:shadow-glow flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* ── INVENTORY SUMMARY CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Units", value: String(inventoryStats.totalUnits), icon: "📦", color: "text-text-primary" },
          { label: "Stock Value", value: formatPrice(inventoryStats.totalRetailValue), icon: "💰", color: "text-accent" },
          { label: "In Stock", value: String(inventoryStats.inStock), icon: "✅", color: "text-success" },
          { label: "Low Stock", value: String(inventoryStats.lowStock), icon: "⚠️", color: "text-warning" },
          { label: "Out of Stock", value: String(inventoryStats.outOfStock), icon: "🚫", color: "text-error" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">{card.icon}</span>
              <p className="text-[9px] text-text-muted uppercase tracking-wider font-semibold">{card.label}</p>
            </div>
            <p className={`text-xl font-heading font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* ── ALERTS ── */}
      {lowStockProducts.length > 0 && (
        <div className="bg-warning/5 border border-warning/15 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-warning/10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm">⚠️</div>
            <div className="flex-1">
              <p className="text-[12px] font-semibold text-text-primary mb-1">Low Stock Alert</p>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                {lowStockProducts.map((p) => (
                  <p key={p.id} className="text-[11px] text-text-secondary"><span className="font-semibold text-warning">{p.name}</span> — {p.stockQty} left</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {outOfStockProducts.length > 0 && (
        <div className="bg-error/5 border border-error/15 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-error/10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm">🚫</div>
            <div className="flex-1">
              <p className="text-[12px] font-semibold text-text-primary mb-1">Out of Stock</p>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                {outOfStockProducts.map((p) => (
                  <p key={p.id} className="text-[11px] text-text-secondary"><span className="font-semibold text-error">{p.name}</span> — needs restock!</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW MODE TOGGLE + SEARCH + FILTERS ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-card space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-0.5">
            <button onClick={() => setViewMode("catalog")}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 ${viewMode === "catalog" ? "bg-white text-text-primary shadow-sm" : "text-text-muted hover:text-text-primary"}`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
              Catalog
            </button>
            <button onClick={() => setViewMode("stock")}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 ${viewMode === "stock" ? "bg-white text-text-primary shadow-sm" : "text-text-muted hover:text-text-primary"}`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" /></svg>
              Stock
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-[13px] focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all placeholder:text-text-muted"
              placeholder="Search by name, SKU, or model..." />
          </div>

          {/* Filters — dynamic based on view */}
          <div className="flex gap-1.5">
            {viewMode === "catalog" ? (
              (["all", "published", "draft", "out_of_stock"] as const).map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all capitalize flex items-center gap-1.5 ${
                    statusFilter === s ? "bg-accent text-white shadow-sm" : "bg-gray-50 text-text-muted hover:bg-gray-100 border border-gray-200"
                  }`}>
                  {s === "all" ? "All" : s.replace("_", " ")}
                  <span className={`text-[9px] min-w-[18px] text-center px-1 py-px rounded-full ${statusFilter === s ? "bg-white/20" : "bg-gray-200/80"}`}>{counts[s]}</span>
                </button>
              ))
            ) : (
              ["all", "in_stock", "low_stock", "out_of_stock"].map((s) => (
                <button key={s} onClick={() => setStockFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all capitalize flex items-center gap-1.5 ${
                    stockFilter === s ? "bg-accent text-white shadow-sm" : "bg-gray-50 text-text-muted hover:bg-gray-100 border border-gray-200"
                  }`}>
                  {s === "all" ? "All" : s.replace(/_/g, " ")}
                  <span className={`text-[9px] min-w-[18px] text-center px-1 py-px rounded-full ${stockFilter === s ? "bg-white/20" : "bg-gray-200/80"}`}>
                    {s === "all" ? products.length : s === "in_stock" ? inventoryStats.inStock : s === "low_stock" ? inventoryStats.lowStock : inventoryStats.outOfStock}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── PRODUCTS TABLE ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Product</th>
                <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">SKU</th>
                <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Price</th>
                {viewMode === "catalog" && (
                  <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Category</th>
                )}
                <th className="text-center text-[10px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Stock</th>
                {viewMode === "stock" && (
                  <>
                    <th className="text-center text-[10px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Sold</th>
                    <th className="text-center text-[10px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Stock Value</th>
                  </>
                )}
                <th className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-[10px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">
                  {viewMode === "stock" ? "Quick Update" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const sold = soldCounts[p.id] || 0;
                const stockStatus = p.stockQty <= 0 ? { text: "Out of Stock", class: "bg-error/10 text-error" }
                  : p.stockQty <= 5 ? { text: "Low Stock", class: "bg-warning/10 text-warning" }
                  : { text: p.status === "draft" ? "Draft" : "In Stock", class: p.status === "draft" ? "bg-gray-100 text-text-muted" : "bg-success/10 text-success" };

                return (
                  <tr key={p.id} className={`border-t border-gray-50 hover:bg-accent/[0.02] transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          {p.images[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-text-muted text-lg">📦</div>}
                        </div>
                        <div>
                          <p className="text-[12px] font-semibold text-text-primary">{p.name}</p>
                          <p className="text-[10px] text-text-muted">{p.phoneModel} · {p.color}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><span className="text-[11px] text-text-muted font-mono bg-gray-50 px-2 py-0.5 rounded">{p.sku}</span></td>
                    <td className="px-5 py-3">
                      <p className="text-[12px] font-semibold text-text-primary">{formatPrice(p.price)}</p>
                      {p.mrp > p.price && <p className="text-[10px] text-text-muted line-through">{formatPrice(p.mrp)}</p>}
                    </td>
                    {viewMode === "catalog" && (
                      <td className="px-5 py-3"><span className="text-[10px] text-text-secondary bg-gray-50 px-2 py-0.5 rounded-full">{p.caseType}</span></td>
                    )}
                    <td className="px-5 py-3 text-center">
                      <span className={`text-[14px] font-bold ${p.stockQty <= 0 ? "text-error" : p.stockQty <= 5 ? "text-warning" : "text-text-primary"}`}>{p.stockQty}</span>
                    </td>
                    {viewMode === "stock" && (
                      <>
                        <td className="px-5 py-3 text-center"><span className="text-[12px] font-medium text-text-secondary">{sold}</span></td>
                        <td className="px-5 py-3 text-center"><span className="text-[11px] font-medium text-text-muted">{formatPrice(p.price * p.stockQty)}</span></td>
                      </>
                    )}
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${viewMode === "stock" ? stockStatus.class : statusBadge(p.status)} capitalize`}>
                        {viewMode === "stock" ? stockStatus.text : p.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {viewMode === "stock" ? (
                        /* Stock quick-update controls */
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleStockChange(p.id, -5, p.stockQty)} disabled={p.stockQty <= 0}
                            className="w-7 h-7 bg-gray-50 border border-gray-200 hover:bg-error/5 hover:border-error/20 text-text-muted hover:text-error rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed text-[10px] font-bold">−5</button>
                          <button onClick={() => handleStockChange(p.id, -1, p.stockQty)} disabled={p.stockQty <= 0}
                            className="w-7 h-7 bg-gray-50 border border-gray-200 hover:bg-error/5 hover:border-error/20 text-text-muted hover:text-error rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold">−</button>
                          <input type="number" value={p.stockQty} onChange={(e) => { const v = Math.max(0, Number(e.target.value)); productStore.updateProductStock(p.id, v); adminStore.updateProductStock(p.id, v); }}
                            className="w-14 text-center bg-gray-50 border border-gray-200 rounded-lg py-1 text-[13px] font-semibold focus:border-accent focus:ring-1 focus:ring-accent/10 outline-none text-text-primary" />
                          <button onClick={() => handleStockChange(p.id, 1, p.stockQty)}
                            className="w-7 h-7 bg-gray-50 border border-gray-200 hover:bg-success/5 hover:border-success/20 text-text-muted hover:text-success rounded-lg flex items-center justify-center transition-all text-sm font-bold">+</button>
                          <button onClick={() => handleStockChange(p.id, 10, p.stockQty)}
                            className="px-2 py-1 bg-accent/8 border border-accent/15 text-accent text-[10px] font-bold rounded-lg hover:bg-accent/15 transition-all">+10</button>
                        </div>
                      ) : (
                        /* Catalog edit/delete controls */
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditProduct(p); setShowModal(true); }} className="p-1.5 text-text-muted hover:text-accent transition-colors rounded-lg hover:bg-accent/5" title="Edit">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
                          <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 text-text-muted hover:text-error transition-colors rounded-lg hover:bg-error/5" title="Delete">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-text-muted">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              <p className="text-sm font-medium">No products found</p>
              <p className="text-[11px] mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>

      {/* ── MODALS ── */}
      {showModal && <ProductFormModal product={editProduct} onClose={() => { setShowModal(false); setEditProduct(null); }} onSave={handleSave} />}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-body">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center border border-gray-100">
            <div className="w-14 h-14 bg-error/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            <h3 className="text-lg font-heading font-bold text-text-primary mb-2">Delete Product?</h3>
            <p className="text-sm text-text-muted mb-6">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] font-medium text-text-secondary hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 rounded-xl bg-error text-white text-[13px] font-bold hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
