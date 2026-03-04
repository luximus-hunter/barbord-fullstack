import { z } from "zod";

export const ProductDTO = z
  .object({
    id: z.number(),
    name: z.string(),
    displayIndex: z.number(),

    price: z.number(),
    salePrice: z.number().nullable().default(null),

    packageSize: z.number().default(-1),

    archived: z.boolean().default(false),

    itemCategoryId: z.number().nullable().default(null),
    itemImageId: z.string().nullable().default(null),
  })
  .strict();

export const CreateProductDTO = ProductDTO.pick({
  name: true,
  displayIndex: true,

  price: true,
  salePrice: true,

  packageSize: true,

  itemCategoryId: true,
  itemImageId: true,
}).strict();

export const UpdateProductDTO = ProductDTO.pick({
  name: true,
  displayIndex: true,

  price: true,
  salePrice: true,

  packageSize: true,

  itemCategoryId: true,
  itemImageId: true,
})
  .partial()
  .strict();

export type ProductDTO = z.infer<typeof ProductDTO>;
export type CreateProductDTO = z.infer<typeof CreateProductDTO>;
export type UpdateProductDTO = z.infer<typeof UpdateProductDTO>;
