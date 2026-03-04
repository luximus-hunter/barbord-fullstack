import { authenticated } from "@/lib/auth/authenticated";
import { NotFoundResponse, SuccessResponse } from "@/lib/responses";
import { db } from "@repo/db";
import { del, list } from "@vercel/blob";
import { NextRequest } from "next/server";

const FOLDER_PREFIX = "images/"; // Including the /

export const DELETE = authenticated(
  async (
    req: NextRequest,
    ctx: RouteContext<"/api/v1/product-images/[id]">,
  ) => {
    const params = await ctx.params;
    const id = params.id;

    try {
      const images = (
        await list({
          prefix: FOLDER_PREFIX,
        })
      ).blobs
        .map((file) => ({
          id: file.pathname.split("-").pop()?.split(".")[0] || "", // Extract the ID from the filename
          url: file.url,
        }))
        .filter((img) => img.id !== FOLDER_PREFIX); // Don't include folders itself
      const imageToDelete = images.find((img) => img.id === id);

      if (!imageToDelete) {
        return NotFoundResponse(`Product image with id ${id} not found`);
      }

      await del(imageToDelete.url);

      await db.item.updateMany({
        where: {
          itemImageId: id,
        },
        data: {
          itemImageId: null,
        },
      });

      return SuccessResponse();
    } catch (error) {
      throw new Error(
        `Failed to delete product image with id ${id}: ${(error as Error).message}`,
      );
    }
  },
);
