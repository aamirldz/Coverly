"use client";

// ═══════════════════════════════════════════
// TESTIMONIALS — Compact 2-column layout
// Slimmed-down customer reviews
// ═══════════════════════════════════════════

const TESTIMONIALS = [
  {
    name: "Rahul S.",
    city: "Mumbai",
    avatar: "R",
    product: "Carbon Fiber Ultra",
    comment: "The quality is insane for this price! Carbon fiber texture is real, not printed. Highly recommend!",
  },
  {
    name: "Priya P.",
    city: "Bangalore",
    avatar: "P",
    product: "MagSafe Crystal Clear",
    comment: "2 months — zero yellowing! MagSafe alignment is perfect. Better than ₹2000+ brands.",
  },
  {
    name: "Arjun S.",
    city: "Delhi",
    avatar: "A",
    product: "Aramid Shield Pro",
    comment: "Dropped my phone from 5 feet — not a scratch. The aramid case saved my iPhone 16 Pro!",
  },
  {
    name: "Sneha R.",
    city: "Hyderabad",
    avatar: "S",
    product: "Rose Blossom Cute",
    comment: "Soooo pretty! All my friends ask where I got this case. Print quality is amazing! 💕",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-10 sm:py-14 bg-white" id="reviews">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em] mb-2">Trusted by 10,000+</p>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            What Our Customers Say
          </h2>
        </div>

        {/* Reviews Grid — 2x2 compact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="flex gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-accent/20 transition-all"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                {t.avatar}
              </div>
              <div className="min-w-0 flex-1">
                {/* Stars + Name */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] text-amber-400">★★★★★</span>
                  <span className="text-[12px] font-semibold text-text-primary">{t.name}</span>
                  <span className="text-[10px] text-text-muted">· {t.city}</span>
                </div>
                {/* Quote */}
                <p className="text-[12px] text-text-secondary leading-relaxed">
                  &ldquo;{t.comment}&rdquo;
                </p>
                <p className="text-[10px] text-accent font-medium mt-1">{t.product}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
