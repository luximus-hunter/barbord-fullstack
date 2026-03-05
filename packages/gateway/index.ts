import { authGateway } from "./src/auth";
import { shopGateway } from "./src/shop";
import { usersGateway } from "./src/users";
import { settingsGateway } from "./src/settings";
import { adminsGateway } from "./src/admin";
import { announcementsGateway } from "./src/announcement";
import { automaticTopupsGateway } from "./src/automatic-topup";
import { productsGateway } from "./src/product";
import { productImagesGateway } from "./src/product-image";
import { productCategoriesGateway } from "./src/product-categories";
import { ordersGateway } from "./src/order";
import { topupsGateway } from "./src/topup";
import { productOrderHistoryGateway } from "./src/product-order-history";
import { productStockHistoryGateway } from "./src/product-stock-history";

// @ts-ignore
const baseApiUrl = import.meta.env.VITE_API_BASE_URL;

if (!baseApiUrl) {
  throw new Error("API_BASE_URL environment variable is not set");
}

export const Gateway = {
  auth: authGateway(baseApiUrl),
  settings: settingsGateway(baseApiUrl),
  shop: shopGateway(baseApiUrl),
  admins: adminsGateway(baseApiUrl),
  announcements: announcementsGateway(baseApiUrl),
  automaticTopups: automaticTopupsGateway(baseApiUrl),
  orders: ordersGateway(baseApiUrl),
  products: productsGateway(baseApiUrl),
  productCategories: productCategoriesGateway(baseApiUrl),
  productImages: productImagesGateway(baseApiUrl),
  productOrderHistory: productOrderHistoryGateway(baseApiUrl),
  productStockHistory: productStockHistoryGateway(baseApiUrl),
  topups: topupsGateway(baseApiUrl),
  users: usersGateway(baseApiUrl),
} as const;
