import { authenticated } from "@/lib/auth/authenticated";
import { TypedResponse } from "@/lib/helpers";
import { SuccessResponse, ZodErrorResponse } from "@/lib/responses";
import { CreateProductImageDTO, ProductImageDTO } from "@repo/contract";
import { list, put } from "@vercel/blob";
import sharp from "sharp";

const MAX_PREFERRED_WIDTH = 400;
const MAX_PREFERRED_HEIGHT = 400;

const FOLDER_PREFIX = "images/"; // Including the /

// NOTE: This GET endpoint is intentionally left unauthenticated.
// This is so the client can fetch the images and cache them.
export const GET = async () => {
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

  return TypedResponse.json<ProductImageDTO[]>(images);
};

export const POST = authenticated(async (request: Request) => {
  const body = await request.json();
  const result = CreateProductImageDTO.safeParse(body);

  if (!result.success) return ZodErrorResponse(result);

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

  return SuccessResponse();
});
