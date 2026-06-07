"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useCartStore, getCartTotalPrice, getCartItemCount, getCartSavings } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import FloatingInput from "@/components/ui/FloatingInput";
import Button from "@/components/ui/Button";
import Image from "next/image";

// ═══════════════════════════════════════════
// CHECKOUT PAGE — Advanced Premium Redesign
// - Floating label inputs with validation checks
// - Step-by-step visual tracker
// - Simulated Secure Payment Modal
// ═══════════════════════════════════════════

interface CheckoutFormData {
  name: string; email: string; phone: string; address1: string; address2: string; city: string; state: string; pincode: string;
}

interface FormErrors { [key: string]: string | undefined }

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"initializing" | "processing" | "success">("initializing");
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "", email: "", phone: "", address1: "", address2: "", city: "", state: "", pincode: "",
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const subtotal = useMemo(() => getCartTotalPrice(items), [items]);
  const savings = useMemo(() => getCartSavings(items), [items]);
  const totalQty = useMemo(() => getCartItemCount(items), [items]);
  const shippingCost = paymentMethod === "cod" ? 50 : 0;
  const prepaidDiscount = paymentMethod === "online" ? 50 : 0;
  const grandTotal = subtotal - prepaidDiscount + shippingCost;
  const totalSavings = savings + prepaidDiscount + (paymentMethod === "online" ? 50 : 0); // shipping is basically saved

  // ── Validation ──
  const validateField = useCallback((name: string, value: string): string | undefined => {
    switch (name) {
      case "name": return value.trim().length < 2 ? "Full name is required" : undefined;
      case "email": return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Enter a valid email" : undefined;
      case "phone": return !/^[6-9]\d{9}$/.test(value) ? "Enter 10-digit Indian number" : undefined;
      case "address1": return value.trim().length < 5 ? "Full address is required" : undefined;
      case "city": return value.trim().length < 2 ? "City is required" : undefined;
      case "state": return !value ? "Select state" : undefined;
      case "pincode": return !/^\d{6}$/.test(value) ? "Enter 6-digit pincode" : undefined;
      default: return undefined;
    }
  }, []);

  const isFormValid = useMemo(() => {
    const requiredFields = ["name", "email", "phone", "address1", "city", "state", "pincode"];
    return requiredFields.every((f) => !validateField(f, formData[f as keyof CheckoutFormData]));
  }, [formData, validateField]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === "phone") maskedValue = value.replace(/\D/g, "").slice(0, 10);
    if (name === "pincode") maskedValue = value.replace(/\D/g, "").slice(0, 6);

    setFormData({ ...formData, [name]: maskedValue });
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, maskedValue) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Simulated Payment Flow
  const triggerPaymentSim = async () => {
    setShowPaymentModal(true);
    setPaymentStatus("initializing");
    await new Promise(r => setTimeout(r, 1500));
    setPaymentStatus("processing");
    await new Promise(r => setTimeout(r, 2500));
    setPaymentStatus("success");
    await new Promise(r => setTimeout(r, 800));
    finalizeOrder();
  };

  const handlePlaceOrder = () => {
    const newErrors: FormErrors = {};
    const req = ["name", "email", "phone", "address1", "city", "state", "pincode"];
    req.forEach((f) => {
      const err = validateField(f, formData[f as keyof CheckoutFormData]);
      if (err) newErrors[f] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.fromEntries(req.map((f) => [f, true])));
      return;
    }

    if (paymentMethod === "online") {
      triggerPaymentSim();
    } else {
      setIsProcessing(true);
      setTimeout(finalizeOrder, 1500);
    }
  };

  const finalizeOrder = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const orderNumber = `LW-${timestamp.slice(-4)}${Math.floor(Math.random()*999).toString().padStart(3,"0")}`;

    localStorage.setItem("lastOrder", JSON.stringify({
      orderNumber, items, subtotal, savings, shippingCost, prepaidDiscount,
      total: grandTotal, paymentMethod, customerName: formData.name, orderDate: new Date().toISOString(),
    }));
    clearCart();
    window.location.href = "/order-confirmation";
  };



  if (!mounted) return null;
  if (items.length === 0) return (
    <div className="py-32 text-center bg-gray-50/50 min-h-screen">
      <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-5">
        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">Your Cart is Empty</h2>
      <p className="text-text-secondary mb-8">Add some premium cases to your cart before checking out.</p>
      <Button href="/">Continue Shopping</Button>
    </div>
  );

  return (
    <div className="bg-gray-50/50">
      <div className="pb-20 pt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Visual Progress Tracker */}
          <div className="flex items-center justify-center mb-10 max-w-lg mx-auto">
            <div className="flex items-center text-accent font-bold text-sm gap-2">
              <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs">✓</span> Cart
            </div>
            <div className="h-px bg-accent w-12 mx-3"></div>
            <div className="flex items-center text-accent font-bold text-sm gap-2">
              <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs">2</span> Shipping
            </div>
            <div className="h-px bg-gray-300 w-12 mx-3"></div>
            <div className="flex items-center text-gray-400 font-bold text-sm gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs">3</span> Payment
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* ── LEFT: Checkout Flow ── */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
              
              {/* Form Section */}
              <div>
                <h2 className="text-xl font-heading font-bold text-text-primary mb-5">Shipping Information</h2>
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
                    <div className="sm:col-span-2"><FloatingInput name="email" label="Email Address *" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} touched={touched.email} /></div>
                    <FloatingInput name="name" label="Full Name *" value={formData.name} onChange={handleChange} onBlur={handleBlur} error={errors.name} touched={touched.name} />
                    <FloatingInput name="phone" label="Phone Number (+91) *" type="tel" maxLength={10} inputMode="numeric" value={formData.phone} onChange={handleChange} onBlur={handleBlur} error={errors.phone} touched={touched.phone} />
                    <div className="sm:col-span-2"><FloatingInput name="address1" label="Street Address / Flat No. *" value={formData.address1} onChange={handleChange} onBlur={handleBlur} error={errors.address1} touched={touched.address1} /></div>
                    <div className="sm:col-span-2"><FloatingInput name="address2" label="Landmark (Optional)" value={formData.address2} onChange={handleChange} onBlur={handleBlur} error={errors.address2} touched={touched.address2} /></div>
                    <FloatingInput name="city" label="City *" value={formData.city} onChange={handleChange} onBlur={handleBlur} error={errors.city} touched={touched.city} />
                    <FloatingInput name="state" label="State *" isSelect={true} value={formData.state} onChange={handleChange} onBlur={handleBlur} error={errors.state} touched={touched.state} />
                    <FloatingInput name="pincode" label="Pincode *" type="tel" maxLength={6} inputMode="numeric" value={formData.pincode} onChange={handleChange} onBlur={handleBlur} error={errors.pincode} touched={touched.pincode} />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div>
                <h2 className="text-xl font-heading font-bold text-text-primary mb-5">Payment Method</h2>
                <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 space-y-4">
                  
                  {/* Pay Online */}
                  <label className={`block relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "online" ? "border-accent bg-accent/5" : "border-gray-200 hover:border-gray-300"
                  }`}>
                    <input type="radio" name="payment" value="online" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} className="hidden" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === "online" ? "border-accent" : "border-gray-300"}`}>
                          {paymentMethod === "online" && <div className="w-2.5 h-2.5 rounded-full bg-accent animate-fade-in" />}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary">Pay Online (UPI, Cards, NetBanking)</p>
                          <div className="flex items-center gap-2 mt-1.5 opacity-60">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-3" />
                            <span className="w-1 h-1 bg-gray-400 rounded-full" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                            <span className="w-1 h-1 bg-gray-400 rounded-full" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" className="h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {paymentMethod === "online" && (
                      <div className="mt-4 bg-green-50 border border-green-100 text-green-700 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 animate-fade-in">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        Congrats! You unlock FREE Shipping + ₹50 prepaid discount.
                      </div>
                    )}
                  </label>

                  {/* COD */}
                  <label className={`block relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "cod" ? "border-accent bg-accent/5" : "border-gray-200 hover:border-gray-300"
                  }`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="hidden" />
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === "cod" ? "border-accent" : "border-gray-300"}`}>
                        {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-accent animate-fade-in" />}
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">Cash on Delivery</p>
                        <p className="text-xs text-text-muted mt-0.5">₹50 additional shipping fee applies</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-white border border-gray-100 shadow-2xl rounded-3xl p-6 sticky top-[120px]">
                <h3 className="text-lg font-heading font-bold text-text-primary mb-6">Order Summary</h3>
                
                {/* Visual Items */}
                <div className="space-y-4 mb-6 pr-2">
                  {items.map(item => (
                    <div key={item.productId} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0">
                        {item.image && <Image src={item.image} alt={item.name} fill className="object-cover rounded-xl" sizes="64px" />}
                        <span className="absolute -top-2 -right-2 bg-text-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="text-sm font-bold text-text-primary leading-tight truncate">{item.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{item.phoneModel} · {item.color}</p>
                        <p className="text-sm font-black text-text-primary mt-1">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-gray-100 w-full mb-6" />

                {/* Totals Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span className="font-medium text-text-primary">{formatPrice(subtotal)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-bold">-{formatPrice(savings)}</span>
                    </div>
                  )}
                  {prepaidDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Prepaid Offer</span>
                      <span className="font-bold">-{formatPrice(prepaidDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? "text-green-600 font-bold" : "font-medium text-text-primary"}>
                      {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t-2 border-dashed border-gray-200">
                  <div className="flex justify-between items-end">
                    <span className="text-base font-bold text-text-primary">Total to Pay</span>
                    <span className="text-3xl font-black text-accent tracking-tight">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={!isFormValid || isProcessing}
                  className="relative w-full mt-8 bg-accent hover:bg-accent-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-base font-black py-4 rounded-xl transition-all hover:shadow-glow active:scale-95 group overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide">
                    {isProcessing ? "PROCESSING..." : "PAY & PLACE ORDER"}
                    {!isProcessing && <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                  </span>
                  {!isProcessing && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── SIMULATED PAYMENT MODAL ── */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
              <span className="text-white font-black tracking-widest italic text-xl">RAZORPAY</span>
              <span className="text-blue-100 text-xs font-medium bg-blue-700/50 px-2 py-1 rounded">Test Mode</span>
            </div>
            
            {/* Body */}
            <div className="px-6 py-8 flex flex-col items-center text-center min-h-[250px] justify-center">
              {paymentStatus === "initializing" && (
                <div className="animate-fade-in">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-text-primary font-bold text-lg">Initializing Payment...</p>
                  <p className="text-sm text-text-muted mt-1">Please do not refresh</p>
                </div>
              )}
              {paymentStatus === "processing" && (
                <div className="animate-fade-in">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-text-primary font-bold text-lg">Processing {formatPrice(grandTotal)}</p>
                  <p className="text-sm text-text-muted mt-1">Connecting to bank securely...</p>
                </div>
              )}
              {paymentStatus === "success" && (
                <div className="animate-slide-up">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="text-green-600 font-black text-xl">Payment Successful!</p>
                  <p className="text-sm text-text-muted mt-1">Redirecting to receipt...</p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Secured by 256-bit encryption</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
