import { z } from "zod";

export const lsCachePrefix = "gateway_cache_";

type FetchWithSchemaParams<
  BodySchema extends z.ZodTypeAny = z.ZodTypeAny,
  ResponseSchema extends z.ZodTypeAny = z.ZodTypeAny,
> = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  body?: z.infer<BodySchema>;
  bodySchema?: BodySchema;
  responseSchema?: ResponseSchema;
  lsCache?: {
    key?: string;
    staleTime?: number;
    invalidateKeys?: string[];
  };
  useToken?: boolean;
};

export async function fetchWithSchema<
  BodySchema extends z.ZodTypeAny = z.ZodTypeAny,
  ResponseSchema extends z.ZodTypeAny = z.ZodTypeAny,
>(
  params: FetchWithSchemaParams<BodySchema, ResponseSchema> & {
    responseSchema: ResponseSchema;
  },
): Promise<z.infer<ResponseSchema>>;

export async function fetchWithSchema<
  BodySchema extends z.ZodTypeAny = z.ZodTypeAny,
>(
  params: FetchWithSchemaParams<BodySchema, never> & { responseSchema?: never },
): Promise<void>;

export async function fetchWithSchema<
  BodySchema extends z.ZodTypeAny = z.ZodTypeAny,
  ResponseSchema extends z.ZodTypeAny = z.ZodTypeAny,
>({
  method,
  url,
  body,
  bodySchema,
  responseSchema,
  lsCache,
  useToken,
}: FetchWithSchemaParams<
  BodySchema,
  ResponseSchema
>): Promise<z.infer<ResponseSchema> | void> {
  // Check localStorage cache if lsCache is provided
  // If cached data exists and is not stale, return it immediately
  if (lsCache && lsCache.key && lsCache.staleTime) {
    const cacheKey = lsCachePrefix + lsCache.key;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const { timestamp, data } = JSON.parse(cachedData);
      const isStale = Date.now() - timestamp > lsCache.staleTime;

      if (!isStale) {
        return data as z.infer<ResponseSchema>;
      } else {
        localStorage.removeItem(cacheKey);
      }
    }
  }

  // Validate body if schema is provided
  if (bodySchema && body) {
    const bodyResult = bodySchema.safeParse(body);

    if (!bodyResult.success) {
      throw new Error(`Invalid body format for ${url}`);
    }
  }

  // Get the token from localStorage if useToken is true
  const token = useToken ? localStorage.getItem(lsCachePrefix + "token") : null;

  // If useToken is true but no token is found, throw an error
  if (useToken && !token) {
    throw new Error("No authentication token found");
  }

  // Make the fetch request with appropriate headers and body
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    method,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Check for HTTP errors
  if (!response.ok) {
    throw new Error(`Failed to ${method} data to ${url}`);
  }

  // Invalidate localStorage cache if lsCacheInvalidate is provided
  if (lsCache?.invalidateKeys) {
    lsCache.invalidateKeys.forEach((key) => {
      localStorage.removeItem(lsCachePrefix + key);
    });
  }

  // If no response schema is provided, just return
  if (!responseSchema) return;

  // Parse and validate response
  const json = await response.json();
  const responseResult = responseSchema.safeParse(json);

  // If response validation fails, throw an error
  if (!responseResult.success) {
    throw new Error(`Invalid response format from ${url}`);
  }

  // Cache the response in localStorage if lsCache is provided
  if (lsCache) {
    const cacheKey = lsCachePrefix + lsCache.key;

    localStorage.setItem(
      cacheKey,
      JSON.stringify({ timestamp: Date.now(), data: responseResult.data }),
    );
  }

  // Return the validated response data
  return responseResult.data as z.infer<ResponseSchema>;
}
