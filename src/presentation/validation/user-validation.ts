import { z } from "zod";
import { IMulterFile } from "./types";

export const userLoginScheme = z.object({
  email: z.string().min(1).email({ message: "Email is not valid!" }),
  password: z.string().min(8),
});

export const userRegistrationScheme = z.object({
  email: z.string().min(1).email({ message: "Email is not valid!" }),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(8),
});

export const userUpdateScheme = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const userImageUpdateScheme = z.object({
  file: z
    .any()
    .refine((val) => typeof val === "object" || !val, "Avatar is required")
    .transform((val) => <IMulterFile>val),
});
