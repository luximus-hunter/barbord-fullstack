import z from "zod";

export const ColorEnum = z.enum([
  "crimson",
  "red",
  "orange",
  "yellow",
  "blue",
  "green",
  "purple",
]);

export const IntervalEnum = z.enum(["w", "m"]);

export const WeekdayEnum = z.enum(["ma", "di", "wo", "do", "vr", "za", "zo"]);

export const BadgeCategoryEnum = z.enum([
  "biggest-spender",
  "bestselling-product",
  "biggest-topup",
  "admin",
  "developer",
]);
