import { ShopDTO } from "@barbord/contract";
import { fetchWithSchema } from "./lib/fetchWithSchema";

export const shopGateway = (baseUrl: string) => ({
  getShopData: () =>
    fetchWithSchema({
      method: "GET",
      url: baseUrl + "/shop",
      responseSchema: ShopDTO,
    }),
});
