import { authGateway } from "./src/auth";
import { shopGateway } from "./src/shop";
import { usersGateway } from "./src/users";
import { settingsGateway } from "./src/settings";
import { ApiStatusDTO } from "@repo/contract";
import { fetchWithSchema } from "./src/lib/fetchWithSchema";
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

export class Gateway {
  private apiUrl: string;

  public auth: ReturnType<typeof authGateway>;
  public settings: ReturnType<typeof settingsGateway>;

  public shop: ReturnType<typeof shopGateway>;

  public admins: ReturnType<typeof adminsGateway>;
  public announcements: ReturnType<typeof announcementsGateway>;
  public automaticTopups: ReturnType<typeof automaticTopupsGateway>;
  public orders: ReturnType<typeof ordersGateway>;
  public products: ReturnType<typeof productsGateway>;
  public productCategories: ReturnType<typeof productCategoriesGateway>;
  public productImages: ReturnType<typeof productImagesGateway>;
  public productOrderHistory: ReturnType<typeof productOrderHistoryGateway>;
  public productStockHistory: ReturnType<typeof productStockHistoryGateway>;
  public topups: ReturnType<typeof topupsGateway>;
  public users: ReturnType<typeof usersGateway>;

  public async initialize({
    baseApiUrl,
    version,
  }: {
    baseApiUrl: string;
    version: string;
  }): Promise<Gateway> {
    // Initialize any necessary gateway components here
    const apiStatus = await fetchWithSchema({
      method: "GET",
      url: baseApiUrl,
      responseSchema: ApiStatusDTO,
    });

    // Check API status and version compatibility
    if (apiStatus.version !== version) {
      throw new Error(
        `API version mismatch: got ${version}, expected ${apiStatus.version}`,
      );
    }

    // Set the base URL for the gateway
    this.apiUrl = apiStatus.url;

    // Initialize other gateway components
    return new Gateway({
      apiUrl: this.apiUrl,
    });
  }

  private constructor({ apiUrl }: { apiUrl: string }) {
    this.apiUrl = apiUrl;

    this.auth = authGateway(this.apiUrl);
    this.settings = settingsGateway(this.apiUrl);

    this.shop = shopGateway(this.apiUrl);

    this.admins = adminsGateway(this.apiUrl);
    this.announcements = announcementsGateway(this.apiUrl);
    this.automaticTopups = automaticTopupsGateway(this.apiUrl);
    this.orders = ordersGateway(this.apiUrl);
    this.products = productsGateway(this.apiUrl);
    this.productCategories = productCategoriesGateway(this.apiUrl);
    this.productImages = productImagesGateway(this.apiUrl);
    this.productOrderHistory = productOrderHistoryGateway(this.apiUrl);
    this.productStockHistory = productStockHistoryGateway(this.apiUrl);
    this.topups = topupsGateway(this.apiUrl);
    this.users = usersGateway(this.apiUrl);
  }
}
