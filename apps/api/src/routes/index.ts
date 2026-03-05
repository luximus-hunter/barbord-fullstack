import { Hono } from "hono";
import userRoutes from "./user.routes";
import productRoutes from "./product.routes";
import adminRoutes from "./admin.routes";
import authRoutes from "./auth.routes";
import announcementRoutes from "./announcement.routes";
import settingsRoutes from "./settings.route";
import automaticTopupRoutes from "./automatic-topup.routes";
import productImageRoutes from "./product-images.routes";
import productCategoryRoutes from "./product-categories.route";
import topupRoutes from "./topup.routes";
import orderRoutes from "./order.routes";

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
