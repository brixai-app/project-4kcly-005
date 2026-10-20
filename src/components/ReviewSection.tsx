import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Textarea,
  Input,
  Separator,
} from "@/components/ui/shadcn";

import { addReview, useReviewsForRecipe } from "@/mock";

export interface ReviewSectionProps {
  /** The recipe ID whose reviews should be displayed */
  recipeId: string;
}

const ratingLabels = ["Not great", "Okay", "Nice", "Loved it", "Perfect!"];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Recently";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ReviewSection: React.FC<ReviewSectionProps> = ({ recipeId }) => {
  const reviews = useReviewsForRecipe(recipeId);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const sortedReviews = useMemo(
    () =>
      [...reviews].sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0
      ),
    [reviews]
  );

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const canSubmit = rating > 0 && comment.trim().length >= 6 && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Add a rating and a short comment to share your review.");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = addReview(recipeId, {
        authorName,
        rating,
        comment,
      });

      if (!created) {
        throw new Error("Unable to add review. This recipe might be unavailable.");
      }

      toast.success("Thank you for sharing your kitchen notes!", {
        description: "Your review is stored locally in your browser only (mocked backend).",
      });

      setAuthorName("");
      setRating(0);
      setHoverRating(0);
      setComment("");
      setIsFormOpen(false);
    } catch (err: any) {
      toast.error("Couldn't save your review", {
        description: err?.message || "This demo uses a mocked in-browser store. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full space-y-6">
      <Card className="border border-amber-100/60 bg-gradient-to-b from-stone-50/90 via-rose-50/80 to-stone-50/90 dark:from-stone-900 dark:via-stone-900/90 dark:to-stone-950 shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="font-['Playfair_Display'] text-xl sm:text-2xl text-stone-900 dark:text-stone-50 whitespace-normal break-words">
              Community notes
            </CardTitle>
            <CardDescription className="text-sm text-stone-600 dark:text-stone-300 whitespace-normal break-words">
              Real-world tweaks, tips, and tiny stories – saved only in your browser as part of this fully mocked demo.
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-1 rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-amber-100 dark:bg-stone-900/80 dark:ring-stone-700">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                <span className="text-sm font-semibold text-stone-900 dark:text-stone-50">
                  {averageRating ? averageRating.toFixed(1) : "–"}
                </span>
              </div>
              <span className="text-[11px] uppercase tracking-wide text-stone-500 dark:text-stone-400">
                {reviews.length === 1 ? "1 review" : `${reviews.length || 0} reviews`}
              </span>
            </div>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full border-amber-300/70 bg-amber-50/60 text-amber-900 hover:bg-amber-100 hover:text-amber-950 dark:border-amber-500/50 dark:bg-stone-900 dark:text-amber-100 dark:hover:bg-amber-500/20 flex items-center gap-2"
                onClick={() => setIsFormOpen((prev) => !prev)}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs font-medium">
                  {isFormOpen ? "Hide review form" : "Write a review"}
                </span>
              </Button>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-0">
          <AnimatePresence initial={false}>
            {isFormOpen && (
              <motion.div
                key="review-form"
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                className="overflow-hidden rounded-2xl border border-amber-100/80 bg-white/80 p-4 shadow-xs dark:border-stone-700 dark:bg-stone-900/80"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-stone-800 dark:text-stone-50">
                        Leave a quick kitchen review
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Ratings and comments stay on this device only – this is a fully frontend mock with local browser storage.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500 dark:text-stone-400">Your rating</span>
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: 5 }).map((_, index) => {
                          const starValue = index + 1;
                          const isActive = (hoverRating || rating) >= starValue;
                          return (
                            <motion.button
                              key={starValue}
                              type="button"
                              whileTap={{ scale: 0.9 }}
                              onMouseEnter={() => setHoverRating(starValue)}
                              onMouseLeave={() => setHoverRating(0)}
                              onFocus={() => setHoverRating(starValue)}
                              onBlur={() => setHoverRating(0)}
                              onClick={() => setRating(starValue)}
                              className="group rounded-full p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-amber-50 dark:focus-visible:ring-offset-stone-900"
                            >
                              <Star
                                className={[
                                  "h-5 w-5 transition-colors duration-150",
                                  isActive
                                    ? "fill-amber-400 text-amber-500 drop-shadow-sm"
                                    : "text-stone-300 hover:text-amber-300 dark:text-stone-700 dark:hover:text-amber-300",
                                ].join(" ")}
                              />
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 min-w-0 space-y-1">
                      <label className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                        Name (optional)
                      </label>
                      <Input
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="How should we credit your review?"
                        className="h-9 rounded-full border-stone-200 bg-white/70 text-sm placeholder:text-stone-400 focus-visible:ring-amber-400 dark:border-stone-700 dark:bg-stone-950/70 dark:text-stone-50 dark:placeholder:text-stone-500"
                      />
                    </div>
                    <div className="flex-shrink-0 text-right text-xs text-stone-400 dark:text-stone-500 pt-4 sm:pt-6">
                      {rating > 0 ? ratingLabels[rating - 1] : "Tap the stars"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                      Thoughts & tweaks
                    </label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you change, love, or wish was different? Add notes you'll want to remember next time."
                      rows={4}
                      className="min-h-[96px] resize-y rounded-2xl border-stone-200 bg-white/80 text-sm leading-relaxed placeholder:text-stone-400 focus-visible:ring-amber-400 dark:border-stone-700 dark:bg-stone-950/70 dark:text-stone-50 dark:placeholder:text-stone-500"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[11px] text-stone-400 dark:text-stone-500">
                        Minimum 6 characters. Reviews are stored only in your browser as part of this mock experience.
                      </p>
                      <motion.div whileTap={{ scale: canSubmit ? 0.96 : 1 }}>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={!canSubmit}
                          className="rounded-full bg-amber-500 px-5 text-xs font-semibold tracking-wide text-stone-900 shadow-sm hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-amber-200 dark:bg-amber-400 dark:text-stone-950 dark:hover:bg-amber-300"
                        >
                          {isSubmitting ? "Saving..." : "Post review"}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <Separator className="bg-gradient-to-r from-transparent via-amber-200/60 to-transparent dark:via-stone-700" />

          <div className="space-y-4">
            {sortedReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-amber-200/80 bg-amber-50/40 px-4 py-6 text-sm text-stone-600 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-300">
                No reviews yet. Be the first to leave a few notes from your kitchen – your thoughts help future-you remember the tweaks that worked.
              </div>
            ) : (
              <ul className="space-y-4">
                <AnimatePresence initial={false}>
                  {sortedReviews.map((review) => (
                    <motion.li
                      key={review.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ type: "spring", stiffness: 260, damping: 24 }}
                      className="rounded-2xl border border-stone-100 bg-white/80 p-4 shadow-xs backdrop-blur-sm dark:border-stone-800 dark:bg-stone-900/80"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold uppercase text-amber-900 dark:bg-amber-400/20 dark:text-amber-200">
                                {(review.authorName || "Anonymous").charAt(0).toUpperCase()}
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-sm font-semibold text-stone-900 dark:text-stone-50 whitespace-normal break-words">
                                  {review.authorName || "Anonymous"}
                                </p>
                                <div className="flex items-center gap-1.5">
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <Star
                                      key={index}
                                      className={[
                                        "h-3.5 w-3.5",
                                        index < review.rating
                                          ? "fill-amber-400 text-amber-500"
                                          : "text-stone-200 dark:text-stone-700",
                                      ].join(" ")}
                                    />
                                  ))}
                                  <span className="text-[11px] font-medium uppercase tracking-wide text-stone-400 dark:text-stone-500">
                                    {formatDate(review.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-200 whitespace-normal break-words">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ReviewSection;