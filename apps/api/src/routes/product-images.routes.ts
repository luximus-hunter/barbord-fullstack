import { Hono } from "hono";
import { authenticated } from "../middleware/authenticated.js";
import { CreateProductImageDTO, ProductImageDTO } from "@barbord/contract";
import { del, list, put } from "@vercel/blob";
import sharp from "sharp";
import { db } from "@barbord/db";

const MAX_PREFERRED_WIDTH = 400;
const MAX_PREFERRED_HEIGHT = 400;
const FOLDER_PREFIX = "images/"; // Including the /

const productImageRoutes = new Hono();

async function getImages() {
  return (
    await list({
      prefix: FOLDER_PREFIX,
    })
  ).blobs
    .map((file) => ({
      id: file.pathname.split("-").pop()?.split(".")[0] || "", // Extract the ID from the filename
      url: file.url,
    }))
    .filter((img) => img.id !== FOLDER_PREFIX); // Don't include folders itself
}

productImageRoutes.get("/", async (c) => {
  const images = await getImages();

  return c.json<ProductImageDTO[]>(images);
});

productImageRoutes.post("/", authenticated, async (c) => {
  const body = await c.req.parseBody();

  const requestFiles = Array.isArray(body.files)
    ? body.files
    : body.files
      ? [body.files]
      : [];

  const result = CreateProductImageDTO.safeParse({
    files: requestFiles,
  });

  if (!result.success) {
    return c.json({ success: false, error: result.error.message }, 400);
  }

  const { files } = result.data;

  for (const file of files) {
    try {
      // Create a buffer from the file
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const image = sharp(buffer);

      // Resize the image to a maximum of ?x? pixels, maintaining aspect ratio
      // Size if set at the top of the file
      image.resize(MAX_PREFERRED_WIDTH, MAX_PREFERRED_HEIGHT, {
        fit: "inside",
        withoutEnlargement: true,
      });

      // Upload the image to Vercel Blob Storage
      await put(FOLDER_PREFIX + file.name, image, {
        access: "public",
        addRandomSuffix: true,
      });
    } catch (error) {
      throw new Error(
        `Failed to upload ${file.name}: ${(error as Error).message}`,
      );
    }
  }

  return c.json({ success: true }, 200);
});

productImageRoutes.delete("/:id", authenticated, async (c) => {
  const id = c.req.param("id");

  try {
    const images = await getImages();
    const imageToDelete = images.find((img) => img.id === id.toString());

    if (!imageToDelete) {
      return c.json({ error: `Product image with id ${id} not found` }, 404);
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
  } catch (error) {
    throw new Error(
      `Failed to delete product image with id ${id}: ${(error as Error).message}`,
    );
  }

  return c.json({ success: true }, 200);
});

export default productImageRoutes;

