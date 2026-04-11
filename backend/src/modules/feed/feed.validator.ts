import * as v from "valibot";

export const FeedQuerySchema = v.object({
  page: v.optional(
    v.pipe(
      v.string(),
      v.transform((input) => Number(input)),
      v.minValue(1, "Page must be at least 1")
    )
  ),
  limit: v.optional(
    v.pipe(
      v.string(),
      v.transform((input) => Number(input)),
      v.minValue(1, "Limit must be at least 1"),
      v.maxValue(20, "Limit must not exceed 20")
    )
  )
});
export type FeedQuerySchema = v.InferOutput<typeof FeedQuerySchema>;
