"use client";

import { useState, useMemo, useCallback } from "react";
import { useCartStore, getCartTotalPrice, getCartTotalMRP, getCartSavings, getCartItemCount } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import AnnouncementBar from "@/components/ui/AnnouncementBar";
import Footer from "@/components/ui/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CartSidebar from "@/components/cart/CartSidebar";
import Link from "next/link";

// ═══════════════════════════════════════════
// CHECKOUT PAGE — Secure & Professional
// Step 1: Customer details (validated form)
// Step 2: Payment method (Online/COD)
// Step 3: Order summary with full breakdown
// ═══════════════════════════════════════════

interface FormData {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh",
];

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Compute totals from items array (safe from Zustand persist issues)
  const subtotal = useMemo(() => getCartTotalPrice(items), [items]);
  const totalMRP = useMemo(() => getCartTotalMRP(items), [items]);
  const savings = useMemo(() => getCartSavings(items), [items]);
  const totalQty = useMemo(() => getCartItemCount(items), [items]);
  const shippingCost = paymentMethod === "cod" ? 50 : 0;
  const prepaidDiscount = paymentMethod === "online" ? 50 : 0;
  const grandTotal = subtotal - prepaidDiscount + shippingCost;
  const totalSavings = savings + prepaidDiscount + (paymentMethod === "online" ? shippingCost : 0);

  // ── Validation ──
  const validateField = useCallback((name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (value.trim().length < 2) return "Full name is required";
        if (!/^[a-zA-Z\s.'-]+$/.test(value.trim())) return "Please enter a valid name";
        return undefined;
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
        return undefined;
      case "phone":
        if (!value) return "Phone number is required";
        if (!/^[6-9]\d{9}$/.test(value)) return "Enter a valid 10-digit Indian phone number";
        return undefined;
      case "address1":
        if (value.trim().length < 5) return "Full address is required";
        return undefined;
      case "city":
        if (value.trim().length < 2) return "City is required";
        return undefined;
      case "state":
        if (!value) return "Please select your state";
        return undefined;
      case "pincode":
        if (!/^\d{6}$/.test(value)) return "Enter a valid 6-digit pincode";
        return undefined;
      default:
        return undefined;
    }
  }, []);

  const isFormValid = useMemo(() => {
    const requiredFields: (keyof FormErrors)[] = ["name", "email", "phone", "address1", "city", "state", "pincode"];
    return requiredFields.every((f) => !validateField(f, formData[f]));
  }, [formData, validateField]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Input masking
    let maskedValue = value;
    if (name === "phone") maskedValue = value.replace(/\D/g, "").slice(0, 10);
    if (name === "pincode") maskedValue = value.replace(/\D/g, "").slice(0, 6);

    setFormData({ ...formData, [name]: maskedValue });

    // Validate on change if field was already touched
    if (touched[name]) {
      const error = validateField(name, maskedValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handlePlaceOrder = async () => {
    // Validate all fields
    const newErrors: FormErrors = {};
    const requiredFields: (keyof FormErrors)[] = ["name", "email", "phone", "address1", "city", "state", "pincode"];
    requiredFields.forEach((f) => {
      const err = validateField(f, formData[f]);
      if (err) newErrors[f] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.fromEntries(requiredFields.map((f) => [f, true])));
      // Scroll to first error
      const firstErrorField = requiredFields.find((f) => newErrors[f]);
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (items.length === 0) return;

    setIsProcessing(true);

    try {
      // Simulate order processing (replace with real Razorpay/API later)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate unique order number
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.floor(Math.random() * 999).toString().padStart(3, "0");
      const orderNumber = `LW-${timestamp.slice(-4)}${random}`;

      // Save complete order data to localStorage
      const orderData = {
        orderNumber,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          phoneModel: item.phoneModel,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
          mrp: item.mrp,
          image: item.image,
        })),
        subtotal,
        savings,
        shippingCost,
        prepaidDiscount,
        total: grandTotal,
        paymentMethod,
        customerName: formData.name.trim(),
        customerEmail: formData.email.trim().toLowerCase(),
        customerPhone: formData.phone,
        shippingAddress: {
          address1: formData.address1.trim(),
          address2: formData.address2.trim(),
          city: formData.city.trim(),
          state: formData.state,
          pincode: formData.pincode,
        },
        orderDate: new Date().toISOString(),
      };

      localStorage.setItem("lastOrder", JSON.stringify(orderData));
      clearCart();
      window.location.href = "/order-confirmation";
    } catch {
      setIsProcessing(false);
      alert("Something went wrong. Please try again.");
    }
  };

  // ── Input helper ──
  const inputClass = (name: string) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:ring-2 outline-none transition-all bg-gray-50 ${
      errors[name as keyof FormErrors] && touched[name]
        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
        : "border-gray-200 focus:border-accent focus:ring-accent/10"
    }`;

  // ── Empty cart state ──
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="fixed top-0 left-0 right-0 z-50"><AnnouncementBar /></div>
        <div className="fixed top-[32px] left-0 right-0 z-40">
          <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-heading font-bold text-text-primary">LUXEWRAP</span>
                <span className="text-[10px] text-accent font-semibold tracking-widest">INDIA</span>
              </Link>
            </div>
          </nav>
        </div>
        <div className="flex items-center justify-center min-h-screen pt-[88px]">
          <div className="text-center px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">Your cart is empty</h1>
            <p className="text-text-secondary text-sm mb-6">Add some products before checking out.</p>
            <Link href="/#products" className="bg-accent hover:bg-accent-dark text-white font-bold px-8 py-3.5 rounded-xl transition-all text-sm inline-block">
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <CartSidebar />
      <WhatsAppButton />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50"><AnnouncementBar /></div>
      <div className="fixed top-[32px] left-0 right-0 z-40">
        <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-heading font-bold text-text-primary">LUXEWRAP</span>
              <span className="text-[10px] text-accent font-semibold tracking-widest">INDIA</span>
            </Link>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm text-text-secondary font-medium">Secure Checkout</span>
            </div>
          </div>
        </nav>
      </div>

      <main className="pt-[100px] pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>›</span>
            <Link href="/#products" className="hover:text-accent transition-colors">Shop</Link>
            <span>›</span>
            <span className="text-text-primary font-medium">Checkout</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mb-8">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── LEFT: Forms (2 cols) ── */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Customer Info */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-text-primary mb-5 flex items-center gap-3">
                  <span className="w-7 h-7 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  Customer Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Full Name *</label>
                    <input
                      type="text" name="name" value={formData.name}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className={inputClass("name")}
                    />
                    {errors.name && touched.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Email *</label>
                    <input
                      type="email" name="email" value={formData.email}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="your@email.com"
                      autoComplete="email"
                      className={inputClass("email")}
                    />
                    {errors.email && touched.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Phone (+91) *</label>
                    <div className="flex">
                      <span className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl px-3 flex items-center text-sm text-text-muted font-medium">+91</span>
                      <input
                        type="tel" name="phone" value={formData.phone}
                        onChange={handleChange} onBlur={handleBlur}
                        placeholder="9876543210" maxLength={10}
                        autoComplete="tel-national"
                        inputMode="numeric"
                        className={`${inputClass("phone")} rounded-l-none`}
                      />
                    </div>
                    {errors.phone && touched.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Address Line 1 *</label>
                    <input
                      type="text" name="address1" value={formData.address1}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="House/Flat no., Street name"
                      autoComplete="address-line1"
                      className={inputClass("address1")}
                    />
                    {errors.address1 && touched.address1 && (
                      <p className="text-xs text-red-500 mt-1">{errors.address1}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Address Line 2</label>
                    <input
                      type="text" name="address2" value={formData.address2}
                      onChange={handleChange}
                      placeholder="Landmark, Area (optional)"
                      autoComplete="address-line2"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all bg-gray-50"
                    />
                  </div>

                  {/* City + State + Pincode */}
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">City *</label>
                    <input
                      type="text" name="city" value={formData.city}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="Your city"
                      autoComplete="address-level2"
                      className={inputClass("city")}
                    />
                    {errors.city && touched.city && (
                      <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">State *</label>
                    <select
                      name="state" value={formData.state}
                      onChange={handleChange} onBlur={handleBlur}
                      className={inputClass("state")}
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && touched.state && (
                      <p className="text-xs text-red-500 mt-1">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Pincode *</label>
                    <input
                      type="text" name="pincode" value={formData.pincode}
                      onChange={handleChange} onBlur={handleBlur}
                      placeholder="6-digit pincode" maxLength={6}
                      autoComplete="postal-code"
                      inputMode="numeric"
                      className={inputClass("pincode")}
                    />
                    {errors.pincode && touched.pincode && (
                      <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-text-primary mb-5 flex items-center gap-3">
                  <span className="w-7 h-7 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Online */}
                  <button
                    onClick={() => setPaymentMethod("online")}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === "online"
                        ? "border-accent bg-accent/5 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "online" ? "border-accent" : "border-gray-300"
                      }`}>
                        {paymentMethod === "online" && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">Pay Online</p>
                        <p className="text-xs text-text-muted">UPI, Cards, NetBanking</p>
                      </div>
                    </div>
                    {paymentMethod === "online" && (
                      <div className="mt-3 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        You save ₹{50 + shippingCost}! Free delivery + ₹50 prepaid discount
                      </div>
                    )}
                  </button>

                  {/* COD */}
                  <button
                    onClick={() => setPaymentMethod("cod")}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === "cod"
                        ? "border-accent bg-accent/5 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "cod" ? "border-accent" : "border-gray-300"
                      }`}>
                        {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">Cash on Delivery</p>
                        <p className="text-xs text-text-muted">₹50 shipping charge applicable</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 sticky top-[100px] shadow-sm">
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center justify-between">
                  Order Summary
                  <span className="text-xs text-text-muted font-normal">{totalQty} {totalQty === 1 ? "item" : "items"}</span>
                </h2>

                {/* Cart Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-1">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text-primary truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-text-muted">{item.phoneModel} · {item.color}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-semibold text-text-primary">{formatPrice(item.price * item.quantity)}</span>
                          {item.mrp > item.price && (
                            <span className="text-[10px] text-text-muted line-through">{formatPrice(item.mrp * item.quantity)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-100 my-4" />

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal ({totalQty} {totalQty === 1 ? "item" : "items"})</span>
                    <span className="tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>MRP Savings</span>
                      <span className="tabular-nums">-{formatPrice(savings)}</span>
                    </div>
                  )}
                  {prepaidDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Prepaid Discount</span>
                      <span className="tabular-nums">-{formatPrice(prepaidDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? "text-green-600 font-medium" : "tabular-nums"}>
                      {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between text-base font-bold text-text-primary pt-1">
                    <span>Total</span>
                    <span className="text-accent tabular-nums">{formatPrice(grandTotal)}</span>
                  </div>
                  {totalSavings > 0 && (
                    <p className="text-xs text-green-600 font-medium text-right">
                      Total savings: {formatPrice(totalSavings)}
                    </p>
                  )}
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={!isFormValid || isProcessing}
                  className="w-full mt-6 bg-accent hover:bg-accent-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all text-sm tracking-wide flex items-center justify-center gap-2 hover:shadow-glow"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing order...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      PLACE ORDER • {formatPrice(grandTotal)}
                    </>
                  )}
                </button>

                {/* Trust Icons */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-[9px] text-text-muted leading-tight">Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <span className="text-[9px] text-text-muted leading-tight">Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-[9px] text-text-muted leading-tight">100% Genuine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
