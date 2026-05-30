import * as v from "valibot";
import { Types } from "mongoose";

export const nameSchema = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty("Please provide a name"),
  v.minLength(2, "Name must be at least 2 characters"),
  v.maxLength(50, "Name must not exceed 50 characters")
);

export const emailSchema = v.pipe(
  v.string("Please provide an email address"),
  v.trim(),
  v.nonEmpty("Please provide an email address"),
  v.email("Please provide a valid email address")
);

export const passwordSchema = v.pipe(
  v.string("Please provide a password"),
  v.nonEmpty("Please provide a password"),
  v.regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
    "Password must be at least 8 characters long and includes at least one uppercase character, one lowercase character, one number and one symbol"
  )
);

export const objectId = (fieldName = "id") =>
  v.pipe(
    v.string(),
    v.check((id) => Types.ObjectId.isValid(id), `Please provide a valid ${fieldName} id`)
  );

export const OffsetPaginationSchema = v.object({
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
export type OffsetPaginationSchema = v.InferOutput<typeof OffsetPaginationSchema>;
