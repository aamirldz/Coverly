"use client";

// ═══════════════════════════════════════════
// FEATURES SECTION — Why LuxeWrap? 
// 3 premium feature cards with SVG icons
// ═══════════════════════════════════════════

const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Military-Grade Protection",
    description: "MIL-STD-810G tested. Survives drops from 10 feet on concrete. Your phone's bodyguard.",
    stat: "10ft",
    statLabel: "Drop proof",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "MagSafe Compatible",
    description: "N52 neodymium magnets for perfect alignment. Works with all MagSafe chargers & accessories.",
    stat: "N52",
    statLabel: "Magnets",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: "Real Premium Materials",
    description: "Genuine carbon fiber, aramid weave & Italian leather. No cheap knockoffs, ever.",
    stat: "12g",
    statLabel: "Ultra light",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Why LuxeWrap?
          </p>
          <h2 className="text-2xl sm:text-4xl font-heading font-bold text-text-primary">
            Engineered for <span className="text-gradient-orange">Excellence</span>
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 border border-gray-200 hover:border-accent/30 transition-all hover:shadow-lg group relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors" />

              {/* Icon */}
              <div className="relative w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-5 group-hover:bg-accent group-hover:text-white transition-all">
                {f.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-text-primary mb-2 relative">
                {f.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed relative">
                {f.description}
              </p>

              {/* Stat */}
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-100 relative">
                <span className="text-2xl font-bold text-accent">{f.stat}</span>
                <span className="text-xs text-text-muted uppercase tracking-wider">{f.statLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
