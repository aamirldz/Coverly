"use client";

import type { Review } from "@/types";

// ═══════════════════════════════════════════
// REVIEW SECTION — Star ratings + review list
// Shows average rating, rating distribution,
// and individual review cards
// ═══════════════════════════════════════════

interface ReviewSectionProps {
  reviews: Review[];
  productName: string;
}

export default function ReviewSection({ reviews, productName }: ReviewSectionProps) {
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // Calculate rating distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
        : 0,
  }));

  if (reviews.length === 0) {
    return (
      <section className="py-12">
        <h2 className="text-xl font-heading font-bold text-text-primary mb-4">
          Customer Reviews
        </h2>
        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-200">
          <span className="text-4xl mb-3 block">📝</span>
          <p className="text-text-secondary text-sm">No reviews yet for {productName}.</p>
          <p className="text-text-muted text-xs mt-1">Be the first to share your experience!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
        Customer Reviews
      </h2>

      {/* Rating Summary */}
      <div className="flex flex-col sm:flex-row gap-8 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
        {/* Left: Average */}
        <div className="flex flex-col items-center justify-center min-w-[120px]">
          <span className="text-4xl font-bold text-text-primary">
            {avgRating.toFixed(1)}
          </span>
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-sm ${star <= Math.round(avgRating) ? "star-filled" : "star-empty"}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-text-muted mt-1">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Right: Distribution */}
        <div className="flex-1 space-y-2">
          {distribution.map((d) => (
            <div key={d.star} className="flex items-center gap-3">
              <span className="text-xs text-text-secondary w-6 text-right">
                {d.star}★
              </span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${d.percentage}%` }}
                />
              </div>
              <span className="text-xs text-text-muted w-7">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {review.customerName}
                    </p>
                    {review.verified && (
                      <span className="text-[10px] text-green-600 font-medium flex items-center gap-0.5">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xs ${star <= review.rating ? "star-filled" : "star-empty"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed mt-2">
              {review.comment}
            </p>

            <p className="text-[10px] text-text-muted mt-3">
              {new Date(review.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
