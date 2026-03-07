import { ShopDTO } from "@barbord/contract";
import { db } from "@barbord/db";
import { Hono } from "hono";
import { toSettingsDTO } from "../mappers/settings.mapper.js";

const shopRoutes = new Hono();

// This GET endpoint is intentionally left unauthenticated so
// clients can fetch shop data on app load before auth.
shopRoutes.get("/", async (c) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    users,
    admins,
    products,
    categories,
    settingsEntries,
    announcements,
    orders,
    topups,
  ] = await Promise.all([
    db.user.findMany({
      select: {
        id: true,
        name: true,
        saldo: true,
        lastorder: true,
      },
      where: {
        archived: false,
      },
      orderBy: {
        lastorder: "desc",
      },
    }),
    db.admin.findMany({
      select: {
        displayname: true,
      },
      where: {
        archived: false,
      },
    }),
    db.item.findMany({
      select: {
        id: true,
        displayIndex: true,
        name: true,
        price: true,
        salePrice: true,
        itemCategoryId: true,
        itemImageId: true,
      },
      where: {
        archived: false,
      },
      orderBy: {
        displayIndex: "asc",
      },
    }),
    db.itemCategory.findMany({
      select: {
        id: true,
        name: true,
        displayIndex: true,
      },
      orderBy: {
        displayIndex: "asc",
      },
    }),
    db.settingsV2.findMany(),
    db.announcement.findMany({
      select: {
        title: true,
        content: true,
        color: true,
      },
    }),
    db.order.findMany({
      where: {
        date: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    db.topup.findMany({
      where: {
        date: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        amount: "desc",
      },
    }),
  ]);

  const settings = toSettingsDTO(settingsEntries);

  const reducedUsers: ShopDTO["users"] = users.map((user) => ({
    id: user.id,
    name: user.name,
    saldo: user.saldo.toNumber(),
    lastorder: user.lastorder?.toISOString() ?? null,
  }));

  const reducedProducts: ShopDTO["products"] = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price.toNumber(),
    salePrice: product.salePrice ? product.salePrice.toNumber() : null,
    itemCategoryId: product.itemCategoryId,
    itemImageId: product.itemImageId,
  }));

  const badges: ShopDTO["badges"] = [];

  const totalSpentPerUser: Record<number, number> = {};
  orders.forEach((order) => {
    if (!totalSpentPerUser[order.userId]) {
      totalSpentPerUser[order.userId] = 0;
    }

    totalSpentPerUser[order.userId] +=
      order.quantity * order.productPrice.toNumber();
  });

  const sortedSpenders = Object.entries(totalSpentPerUser)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  sortedSpenders.forEach(([userId], index) => {
    const user = users.find((u) => u.id === parseInt(userId, 10));
    if (user) {
      badges.push({
        id: user.id,
        rank: index + 1,
        category: "biggest-spender",
      });
    }
  });

  const threeHighestTopups = topups.slice(0, 3);
  threeHighestTopups.forEach((topup, index) => {
    const user = users.find((u) => u.id === topup.userId);
    if (user) {
      badges.push({
        id: user.id,
        rank: index + 1,
        category: "biggest-topup",
      });
    }
  });

  const totalSoldPerProduct: Record<number, number> = {};
  orders.forEach((order) => {
    if (!totalSoldPerProduct[order.productId]) {
      totalSoldPerProduct[order.productId] = 0;
    }

    totalSoldPerProduct[order.productId] += order.quantity;
  });

  const sortedProducts = Object.entries(totalSoldPerProduct)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  sortedProducts.forEach(([productId], index) => {
    const product = products.find((p) => p.id === parseInt(productId, 10));
    if (product) {
      badges.push({
        id: product.id,
        rank: index + 1,
        category: "bestselling-product",
      });
    }
  });

  const adminDisplayNames = admins.map((admin) => admin.displayname);
  users.forEach((user) => {
    if (adminDisplayNames.includes(user.name)) {
      badges.push({
        id: user.id,
        rank: 1,
        category: "admin",
      });
    }

    if (settings.developers.includes(user.id)) {
      badges.push({
        id: user.id,
        rank: 1,
        category: "developer",
      });
    }
  });

  return c.json<ShopDTO>({
    users: reducedUsers,
    products: reducedProducts,
    categories,
    settings,
    announcements,
    badges,
  });
});

export default shopRoutes;