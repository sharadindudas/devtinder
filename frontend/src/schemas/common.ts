import * as v from "valibot";

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
    "Password must be at least 8 characters, with 1 uppercase, 1 lowercase, 1 number, and 1 symbol"
  )
);
