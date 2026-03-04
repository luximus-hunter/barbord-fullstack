import { z } from "zod";

export const ProductImageDTO = z
  .object({
    id: z.string(),
    url: z.string(),
  })
  .strict();

export const CreateProductImageDTO = z
  .object({
    files: z.file().array(),
  })
  .strict();

// No update DTO, it can be deleted, but not updated

export type ProductImageDTO = z.infer<typeof ProductImageDTO>;
export type CreateProductImageDTO = z.infer<typeof CreateProductImageDTO>;
