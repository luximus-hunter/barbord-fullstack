import { Hono } from "hono";
import users from "./user.routes";
import products from "./product.routes";
import admins from "./admin.routes";
import auth from "./auth.routes";
import announcements from "./announcement.routes";
import settings from "./settings.route";
import automaticTopups from "./automatic-topup.routes";
import productImages from "./product-images.routes";
import productCategories from "./product-categories.route";
import topups from "./topup.routes";
import orders from "./order.routes";

const routes = new Hono();

routes.route("/auth", auth);
routes.route("/settings", settings);

routes.route("/users", users);
routes.route("/admins", admins);
routes.route("/announcements", announcements);
routes.route("/orders", orders);
routes.route("/topups", topups);
routes.route("/automatic-topup", automaticTopups);
routes.route("/products", products);
routes.route("/product-images", productImages);
routes.route("/product-categories", productCategories);
// routes.route("/product-stock-history", productStockHistory);
// routes.route("/product-order-history", productOrderHistory);

export default routes;
