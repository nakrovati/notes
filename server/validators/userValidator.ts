import * as v from "valibot";

export const LoginSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Email is required"),
    v.maxLength(320, "Must be at most 320 characters"),
    v.email("Invalid emial"),
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty("Password is required"),
    v.minLength(8, "Must be at least 8 characters"),
    v.maxLength(50, "Must be at most 50 characters"),
  ),
});

export const SignUpSchema = v.pipe(
  v.object({
    email: v.pipe(
      v.string(),
      v.nonEmpty("Email is required"),
      v.maxLength(320, "Must be at most 320 characters"),
      v.email("Invalid emial"),
      v.trim(),
    ),
    password: v.pipe(
      v.string(),
      v.nonEmpty("Password is required"),
      v.minLength(8, "Must be at least 8 characters"),
      v.maxLength(50, "Must be at most 50 characters"),
    ),
    password_confirmation: v.string(),
  }),
  v.forward(
    v.check(
      (input) => input.password === input.password_confirmation,
      "Confirm password do not match",
    ),
    ["password_confirmation"],
  ),
);
