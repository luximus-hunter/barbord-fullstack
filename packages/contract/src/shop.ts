import { UserDTO } from "./user";
import { ProductDTO } from "./product";
import { ProductCategoryDTO } from "./product-category";
import { ProductImageDTO } from "./product-image";
import { SettingsDTO } from "./settings";
import { z } from "zod";
import { AnnouncementDTO } from "./announcement";
import { BadgeCategoryEnum } from "./enums";

export const ShopDTO = z
  .object({
    users: z.array(
      UserDTO.pick({
        id: true,
        name: true,
        saldo: true,
        lastorder: true,
      }),
    ),
    products: z.array(
      ProductDTO.pick({
        id: true,
        name: true,
        price: true,
        salePrice: true,
        itemCategoryId: true,
        itemImageId: true,
      }),
    ),
    categories: z.array(
      ProductCategoryDTO.pick({
        id: true,
        name: true,
        displayIndex: true,
      }),
    ),
    settings: SettingsDTO.pick({
      websiteTitle: true,
      secondsPerAnnouncement: true,
      warnAt: true,
      fineAt: true,
      fineAmount: true,
    }),
    badges: z.array(
      UserDTO.pick({
        id: true,
      }).extend({
        rank: z.number(),
        category: BadgeCategoryEnum,
      }),
    ),
    announcements: z.array(
      AnnouncementDTO.pick({
        title: true,
        content: true,
        color: true,
      }),
    ),
  })
  .strict();

export type ShopDTO = z.infer<typeof ShopDTO>;
