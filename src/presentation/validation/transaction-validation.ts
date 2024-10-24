import { z } from "zod";

export const topUpScheme = z.object({
  amount: z.number().min(0),
});

export const paymentScheme = z.object({
  serviceCode: z
    .string()
    .refine((val) => val !== "TOPUP", "Please top up on topup API"),
});

export const findHistoryScheme = z.object({
  limit: z.optional(
    z
      .any()
      .refine((val) => parseInt(val) > -1, "Page must be number")
      .transform((val) => (parseInt(val) >= 0 ? parseInt(val) : undefined))
  ),
  offset: z
    .any()
    .refine((val) => parseInt(val) > -1, "Page must be number")
    .transform((val) => parseInt(val)),
});
