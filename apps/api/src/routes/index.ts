import { Hono } from "hono";
import userRoutes from "./user.routes.js";
import productRoutes from "./product.routes.js";
import adminRoutes from "./admin.routes.js";
import authRoutes from "./auth.routes.js";
import announcementRoutes from "./announcement.routes.js";
import settingsRoutes from "./settings.route.js";
import automaticTopupRoutes from "./automatic-topup.routes.js";
import productImageRoutes from "./product-images.routes.js";
import productCategoryRoutes from "./product-categories.route.js";
import topupRoutes from "./topup.routes.js";
import orderRoutes from "./order.routes.js";

const routes = new Hono();

routes.route("/auth", authRoutes);
routes.route("/settings", settingsRoutes);

routes.route("/users", userRoutes);
routes.route("/admins", adminRoutes);
routes.route("/announcements", announcementRoutes);
routes.route("/orders", orderRoutes);
routes.route("/topups", topupRoutes);
routes.route("/automatic-topup", automaticTopupRoutes);
routes.route("/products", productRoutes);
routes.route("/product-images", productImageRoutes);
routes.route("/product-categories", productCategoryRoutes);
// routes.route("/product-stock-history", productStockHistoryRoutes);
// routes.route("/product-order-history", productOrderHistoryRoutes);

export default routes;

