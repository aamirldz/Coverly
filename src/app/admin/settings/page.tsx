"use client";

import { useProductStore } from "@/hooks/useProducts";
import { useEffect, useState, useMemo } from "react";
import type { Product, Review, HeroShowcaseItem } from "@/types";
import Image from "next/image";

// ═══════════════════════════════════════════
// ADMIN SETTINGS — Reviews & Hero Showcase
// Tab 1: Manage customer reviews (CRUD + stars)
// Tab 2: Manage hero section circular showcase
// ═══════════════════════════════════════════

// ── STAR PICKER ──
function StarPicker({ value, onChange, size = "text-xl" }: { value: number; onChange: (v: number) => void; size?: string }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className={`${size} transition-colors cursor-pointer ${
            star <= (hover || value) ? "text-amber-400" : "text-gray-200"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ── STAR DISPLAY ──
function Stars({ rating, size = "text-xs" }: { rating: number; size?: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`${size} ${s <= rating ? "text-amber-400" : "text-gray-200"}`}>★</span>
      ))}
    </div>
  );
}

export default function AdminSettingsPage() {
  const { products, initProducts, addReview, updateReview, deleteReview, toggleReviewApproval, heroShowcase, updateHeroShowcase } = useProductStore();
  const [activeTab, setActiveTab] = useState<"reviews" | "showcase">("reviews");

  useEffect(() => { initProducts(); }, [initProducts]);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-text-primary">Settings</h2>
        <p className="text-sm text-text-muted mt-1">Manage reviews and hero showcase</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { key: "reviews" as const, label: "Reviews", icon: "⭐" },
          { key: "showcase" as const, label: "Hero Showcase", icon: "🎯" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
              activeTab === tab.key
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "reviews" ? (
        <ReviewManager products={products} addReview={addReview} updateReview={updateReview} deleteReview={deleteReview} toggleReviewApproval={toggleReviewApproval} />
      ) : (
        <HeroShowcaseManager products={products} heroShowcase={heroShowcase} updateHeroShowcase={updateHeroShowcase} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// REVIEW MANAGER TAB
// ═══════════════════════════════════════════

interface ReviewManagerProps {
  products: Product[];
  addReview: (productId: string, review: Review) => void;
  updateReview: (productId: string, reviewId: string, updates: Partial<Review>) => void;
  deleteReview: (productId: string, reviewId: string) => void;
  toggleReviewApproval: (productId: string, reviewId: string) => void;
}

function ReviewManager({ products, addReview, updateReview, deleteReview, toggleReviewApproval }: ReviewManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<(Review & { productId: string }) | null>(null);
  const [filterProduct, setFilterProduct] = useState("");
  const [filterRating, setFilterRating] = useState(0);
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending">("all");
  const [deleteConfirm, setDeleteConfirm] = useState<{ productId: string; reviewId: string } | null>(null);

  // Form state
  const [formProductId, setFormProductId] = useState("");
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState("");
  const [formVerified, setFormVerified] = useState(true);
  const [formApproved, setFormApproved] = useState(true);

  // Collect all reviews
  const allReviews = useMemo(() => {
    const reviews: (Review & { productId: string; productName: string })[] = [];
    products.forEach((p) => {
      (p.reviews || []).forEach((r) => {
        reviews.push({ ...r, productId: p.id, productName: p.name });
      });
    });
    return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [products]);

  // Filter
  const filteredReviews = useMemo(() => {
    return allReviews.filter((r) => {
      if (filterProduct && r.productId !== filterProduct) return false;
      if (filterRating && r.rating !== filterRating) return false;
      if (filterStatus === "approved" && !r.approved) return false;
      if (filterStatus === "pending" && r.approved) return false;
      return true;
    });
  }, [allReviews, filterProduct, filterRating, filterStatus]);

  const publishedProducts = products.filter((p) => p.status === "published");

  const resetForm = () => {
    setFormProductId(""); setFormName(""); setFormRating(5);
    setFormComment(""); setFormVerified(true); setFormApproved(true);
    setEditingReview(null); setShowForm(false);
  };

  const handleSubmit = () => {
    if (!formProductId || !formName.trim() || !formComment.trim()) return;

    if (editingReview) {
      updateReview(editingReview.productId, editingReview.id, {
        customerName: formName,
        rating: formRating,
        comment: formComment,
        verified: formVerified,
        approved: formApproved,
      });
    } else {
      const review: Review = {
        id: `rev-${Date.now()}`,
        productId: formProductId,
        customerName: formName,
        orderId: `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        rating: formRating,
        comment: formComment,
        images: [],
        verified: formVerified,
        approved: formApproved,
        createdAt: new Date().toISOString(),
      };
      addReview(formProductId, review);
    }
    resetForm();
  };

  const handleEdit = (review: Review & { productId: string }) => {
    setEditingReview(review);
    setFormProductId(review.productId);
    setFormName(review.customerName);
    setFormRating(review.rating);
    setFormComment(review.comment);
    setFormVerified(review.verified);
    setFormApproved(review.approved);
    setShowForm(true);
  };

  return (
    <div className="space-y-5">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Reviews", value: allReviews.length, color: "bg-blue-50 text-blue-600" },
          { label: "Approved", value: allReviews.filter((r) => r.approved).length, color: "bg-green-50 text-green-600" },
          { label: "Pending", value: allReviews.filter((r) => !r.approved).length, color: "bg-amber-50 text-amber-600" },
          { label: "Avg Rating", value: allReviews.length > 0 ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1) : "—", color: "bg-accent/8 text-accent" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-2xl font-heading font-bold text-text-primary">{stat.value}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          {showForm ? "Cancel" : "Add Review"}
        </button>

        {/* Filters */}
        <select value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)}
          className="text-[13px] px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-text-secondary focus:border-accent/40 focus:outline-none">
          <option value="">All Products</option>
          {publishedProducts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <select value={filterRating} onChange={(e) => setFilterRating(Number(e.target.value))}
          className="text-[13px] px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-text-secondary focus:border-accent/40 focus:outline-none">
          <option value={0}>All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ★</option>)}
        </select>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as "all" | "approved" | "pending")}
          className="text-[13px] px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-text-secondary focus:border-accent/40 focus:outline-none">
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            {editingReview ? "Edit Review" : "Add New Review"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Product *</label>
              <select value={formProductId} onChange={(e) => setFormProductId(e.target.value)}
                className="w-full text-[13px] px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/8"
                disabled={!!editingReview}>
                <option value="">Select product...</option>
                {publishedProducts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Customer Name *</label>
              <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Customer name..."
                className="w-full text-[13px] px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/8" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Rating *</label>
            <StarPicker value={formRating} onChange={setFormRating} size="text-2xl" />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Comment *</label>
            <textarea value={formComment} onChange={(e) => setFormComment(e.target.value)} rows={3} placeholder="Write the review comment..."
              className="w-full text-[13px] px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/8 resize-none" />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formVerified} onChange={(e) => setFormVerified(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent/30" />
              <span className="text-[13px] text-text-secondary font-medium">Verified Purchase</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formApproved} onChange={(e) => setFormApproved(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent/30" />
              <span className="text-[13px] text-text-secondary font-medium">Approved</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSubmit}
              disabled={!formProductId || !formName.trim() || !formComment.trim()}
              className="bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all">
              {editingReview ? "Save Changes" : "Add Review"}
            </button>
            <button onClick={resetForm}
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-text-muted hover:bg-gray-50 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-3">📝</span>
            <p className="text-text-secondary text-sm font-medium">No reviews found</p>
            <p className="text-text-muted text-xs mt-1">Add your first review to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100">
                  {["Product", "Customer", "Rating", "Comment", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-[13px] font-medium text-text-primary truncate max-w-[160px]">{review.productName}</p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent text-[10px] font-bold flex-shrink-0">
                          {review.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-text-primary">{review.customerName}</p>
                          {review.verified && <p className="text-[9px] text-green-600 font-medium">✓ Verified</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><Stars rating={review.rating} /></td>
                    <td className="px-5 py-3">
                      <p className="text-[12px] text-text-secondary truncate max-w-[200px]">{review.comment}</p>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleReviewApproval(review.productId, review.id)}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
                          review.approved
                            ? "bg-green-50 text-green-600 hover:bg-green-100"
                            : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                        }`}
                      >
                        {review.approved ? "Approved" : "Pending"}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-[11px] text-text-muted">
                        {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(review)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted hover:text-accent transition-colors" title="Edit">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                          </svg>
                        </button>
                        {deleteConfirm?.reviewId === review.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => { deleteReview(review.productId, review.id); setDeleteConfirm(null); }}
                              className="text-[10px] text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-lg font-semibold">Yes</button>
                            <button onClick={() => setDeleteConfirm(null)}
                              className="text-[10px] text-text-muted hover:text-text-primary px-2 py-1 rounded-lg font-semibold">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm({ productId: review.productId, reviewId: review.id })}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors" title="Delete">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// HERO SHOWCASE MANAGER TAB
// Manages the big circular product rotator on homepage
// ═══════════════════════════════════════════

interface HeroShowcaseManagerProps {
  products: Product[];
  heroShowcase: HeroShowcaseItem[];
  updateHeroShowcase: (config: HeroShowcaseItem[]) => void;
}

function HeroShowcaseManager({ products, heroShowcase, updateHeroShowcase }: HeroShowcaseManagerProps) {
  const publishedProducts = useMemo(() => products.filter((p) => p.status === "published"), [products]);

  // Build current hero items — merge saved config with product data
  const heroItems = useMemo(() => {
    if (heroShowcase.length === 0) {
      // Default: first 3 published products
      return publishedProducts.slice(0, 3).map((p, i) => ({
        productId: p.id,
        visible: true,
        order: i,
        product: p,
      }));
    }

    return heroShowcase
      .sort((a, b) => a.order - b.order)
      .map((item) => {
        const product = publishedProducts.find((p) => p.id === item.productId);
        return product ? { ...item, product } : null;
      })
      .filter(Boolean) as (HeroShowcaseItem & { product: Product })[];
  }, [heroShowcase, publishedProducts]);

  const [addingProduct, setAddingProduct] = useState(false);

  // Products not already in the hero showcase
  const availableProducts = useMemo(() => {
    const usedIds = new Set(heroItems.map((h) => h.productId));
    return publishedProducts.filter((p) => !usedIds.has(p.id));
  }, [publishedProducts, heroItems]);

  const saveConfig = (items: (HeroShowcaseItem & { product?: Product })[]) => {
    updateHeroShowcase(items.map((item, i) => ({
      productId: item.productId,
      visible: item.visible,
      order: i,
    })));
  };

  const addProduct = (productId: string) => {
    const newItems = [...heroItems, { productId, visible: true, order: heroItems.length, product: publishedProducts.find((p) => p.id === productId)! }];
    saveConfig(newItems);
    setAddingProduct(false);
  };

  const removeProduct = (productId: string) => {
    const newItems = heroItems.filter((h) => h.productId !== productId);
    saveConfig(newItems);
  };

  const toggleVisibility = (productId: string) => {
    const newItems = heroItems.map((h) =>
      h.productId === productId ? { ...h, visible: !h.visible } : h
    );
    saveConfig(newItems);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= heroItems.length) return;
    const updated = [...heroItems];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    saveConfig(updated);
  };

  const visibleCount = heroItems.filter((h) => h.visible).length;

  return (
    <div className="space-y-5">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-accent/5 to-orange-50 border border-accent/10 rounded-2xl p-5 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
          <span className="text-xl">🎯</span>
        </div>
        <div>
          <p className="text-[14px] font-semibold text-text-primary">Hero Showcase Manager</p>
          <p className="text-[12px] text-text-secondary mt-0.5">
            Control which products appear in the big circular showcase on the homepage hero section. 
            Products rotate automatically. Drag to reorder, toggle visibility, or add/remove products.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex-1">
          <p className="text-xl font-bold text-text-primary">{heroItems.length}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">Total Items</p>
        </div>
        <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex-1">
          <p className="text-xl font-bold text-green-600">{visibleCount}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">Active / Visible</p>
        </div>
        <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex-1">
          <p className="text-xl font-bold text-text-primary">{availableProducts.length}</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">Available to Add</p>
        </div>
      </div>

      {/* Add Product Button */}
      <div className="flex gap-3">
        <button
          onClick={() => setAddingProduct(!addingProduct)}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {addingProduct ? "Cancel" : "Add Product to Hero"}
        </button>
      </div>

      {/* Add Product Picker */}
      {addingProduct && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 space-y-3">
          <h4 className="text-[13px] font-semibold text-text-primary uppercase tracking-wider">Select a Product</h4>
          {availableProducts.length === 0 ? (
            <p className="text-[12px] text-text-muted py-4 text-center">All published products are already in the hero showcase.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto">
              {availableProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addProduct(product.id)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-accent/30 hover:bg-accent/3 transition-all text-left group"
                >
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-50 flex-shrink-0 ring-1 ring-gray-100 group-hover:ring-accent/20">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-text-primary truncate group-hover:text-accent transition-colors">{product.name}</p>
                    <p className="text-[10px] text-text-muted">{product.phoneModel} · ₹{product.price.toLocaleString("en-IN")}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-accent transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hero Items List */}
      <div className="space-y-3">
        {heroItems.map((item, index) => (
          <div
            key={item.productId}
            className={`bg-white rounded-2xl border overflow-hidden transition-all ${
              item.visible ? "border-gray-100 shadow-card" : "border-gray-100 opacity-60"
            }`}
          >
            <div className="flex items-center gap-4 p-4">
              {/* Order number */}
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[14px] font-bold text-text-muted flex-shrink-0">
                {index + 1}
              </div>

              {/* Circular product preview */}
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-b from-gray-50 to-white ring-2 ring-gray-100 flex-shrink-0">
                <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="64px" />
              </div>

              {/* Product info */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text-primary truncate">{item.product.name}</p>
                <p className="text-[11px] text-text-muted mt-0.5">{item.product.phoneBrand} · {item.product.phoneModel} · ₹{item.product.price.toLocaleString("en-IN")}</p>
              </div>

              {/* Visibility badge */}
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                item.visible ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
              }`}>
                {item.visible ? "Visible" : "Hidden"}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => toggleVisibility(item.productId)}
                  className={`text-[11px] font-semibold px-3 py-2 rounded-lg transition-colors ${
                    item.visible ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >
                  {item.visible ? "Hide" : "Show"}
                </button>

                <button onClick={() => moveItem(index, "up")} disabled={index === 0}
                  className="px-2.5 py-2 rounded-lg bg-gray-50 text-text-muted hover:bg-gray-100 disabled:opacity-30 text-[13px] transition-colors">
                  ↑
                </button>
                <button onClick={() => moveItem(index, "down")} disabled={index === heroItems.length - 1}
                  className="px-2.5 py-2 rounded-lg bg-gray-50 text-text-muted hover:bg-gray-100 disabled:opacity-30 text-[13px] transition-colors">
                  ↓
                </button>

                <button
                  onClick={() => removeProduct(item.productId)}
                  className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors"
                  title="Remove from hero"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {heroItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <span className="text-4xl block mb-3">🎯</span>
            <p className="text-text-secondary text-sm font-medium">No hero products configured</p>
            <p className="text-text-muted text-xs mt-1">Click &quot;Add Product to Hero&quot; to get started. The first 3 published products are shown by default.</p>
          </div>
        )}
      </div>
    </div>
  );
}
