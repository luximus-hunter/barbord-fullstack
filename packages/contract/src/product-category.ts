import { z } from "zod";

export const ProductCategoryDTO = z
  .object({
    id: z.number(),
    name: z.string(),
    displayIndex: z.number(),
  })
  .strict();

export const CreateProductCategoryDTO = ProductCategoryDTO.pick({
  name: true,
  displayIndex: true,
}).strict();

export const UpdateProductCategoryDTO = ProductCategoryDTO.pick({
  name: true,
  displayIndex: true,
})
  .partial()
  .strict();

export type ProductCategoryDTO = z.infer<typeof ProductCategoryDTO>;
export type CreateProductCategoryDTO = z.infer<typeof CreateProductCategoryDTO>;
export type UpdateProductCategoryDTO = z.infer<typeof UpdateProductCategoryDTO>;
