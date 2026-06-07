import { notFound } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

// ═══════════════════════════════════════════
// POLICIES PAGE — Dynamic route for legal pages
// Generates pages for Shipping, Returns, Privacy, Terms
// ═══════════════════════════════════════════

export const runtime = "edge";

const policyData: Record<string, { title: string; content: React.ReactNode }> = {
  shipping: {
    title: "Shipping Policy",
    content: (
      <>
        <h3 className="text-lg font-bold mb-2">Domestic Shipping</h3>
        <p className="mb-4 text-text-secondary">All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
        <h3 className="text-lg font-bold mb-2">Estimated Delivery</h3>
        <p className="text-text-secondary">Standard Delivery: 3-5 Business Days. Express Delivery: 1-2 Business Days.</p>
      </>
    )
  },
  returns: {
    title: "Returns & Refund Policy",
    content: (
      <>
        <h3 className="text-lg font-bold mb-2">Returns</h3>
        <p className="mb-4 text-text-secondary">We have a 7-day return policy, which means you have 7 days after receiving your item to request a return. To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging.</p>
        <h3 className="text-lg font-bold mb-2">Refunds</h3>
        <p className="text-text-secondary">We will notify you once we've received and inspected your return, and let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method within 10 business days.</p>
      </>
    )
  },
  privacy: {
    title: "Privacy Policy",
    content: (
      <>
        <h3 className="text-lg font-bold mb-2">Information Collection</h3>
        <p className="mb-4 text-text-secondary">We collect information from you when you register on our site, place an order, subscribe to our newsletter or fill out a form. Any of the information we collect from you may be used to personalize your experience, improve our website, or improve customer service.</p>
        <h3 className="text-lg font-bold mb-2">Data Protection</h3>
        <p className="text-text-secondary">We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>
      </>
    )
  },
  terms: {
    title: "Terms of Service",
    content: (
      <>
        <h3 className="text-lg font-bold mb-2">Overview</h3>
        <p className="mb-4 text-text-secondary">This website is operated by LuxeWrap India. Throughout the site, the terms "we", "us" and "our" refer to LuxeWrap India. By visiting our site and/ or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions.</p>
        <h3 className="text-lg font-bold mb-2">Modifications to the Service and Prices</h3>
        <p className="text-text-secondary">Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>
      </>
    )
  }
};

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = policyData[resolvedParams.slug];

  if (!data) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">{data.title}</h1>
            <div className="w-16 h-1 bg-accent rounded-full"></div>
          </div>
          <div className="prose prose-sm md:prose-base prose-gray max-w-none text-text-secondary">
            {data.content}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
