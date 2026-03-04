// This file will be called directly from the cli to generate the OpenAPI spec. It will do the following:
// 1. Loop over all 'route.ts' files and parse exported GET, POST, PUT, DELETE methods
// 2. Infer response types from TypedResponse.json<Type>() calls
// 3. Infer request body schemas from Zod safeParse() calls
// 4. Generate the OpenAPI spec and write it to /public/openapi.json

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { dirname, relative, resolve } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { z } from "zod";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const routesDirectory = resolve(scriptDirectory, "src", "app", "api", "v1");
const outputFilePath = resolve(scriptDirectory, "public", "openapi.json");

interface ParsedRoute {
  method: string;
  path: string;
  responseType: string | null;
  requestBodySchema: string | null;
  isAuthenticated: boolean;
}

function findRouteFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const routeFiles: string[] = [];

  for (const entry of entries) {
    const fullPath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      routeFiles.push(...findRouteFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name === "route.ts") {
      routeFiles.push(fullPath);
    }
  }

  return routeFiles;
}

function toOpenApiPath(routePath: string): string {
  const normalized = routePath.replaceAll("[", "{").replaceAll("]", "}");
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function toOperationId(method: string, path: string): string {
  const normalizedPath = path
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");

  return `${method.toLowerCase()}-${normalizedPath}`;
}

function toTag(path: string): string {
  const cleaned = path.replace(/^\/+/, "");
  const firstSegment = cleaned.split("/")[0];
  return firstSegment || "default";
}

function parseRouteFile(routeFile: string): ParsedRoute[] {
  const content = readFileSync(routeFile, "utf-8");
  const routes: ParsedRoute[] = [];

  // Get relative path from routesDirectory
  const relativePath = relative(routesDirectory, dirname(routeFile));
  const path = "/" + relativePath.replaceAll("\\", "/");

  // Match exported GET, POST, PUT, DELETE functions
  const methodRegex =
    /export\s+const\s+(GET|POST|PUT|DELETE)\s+=\s+(authenticated\s*\()?\s*async\s*\(/g;

  let match: RegExpExecArray | null;
  while ((match = methodRegex.exec(content)) !== null) {
    const method = match[1];
    const isAuthenticated = !!match[2];

    // Find TypedResponse.json<Type>() calls in this method
    // Look ahead for the response type
    const methodStart = match.index;
    const methodEnd = findMethodEnd(content, methodStart);
    const methodBody = content.substring(methodStart, methodEnd);

    const responseTypeMatch = methodBody.match(/TypedResponse\.json<([^>]+)>/);
    const responseType = responseTypeMatch ? responseTypeMatch[1] : null;

    // Find request body schema (e.g., CreateUserDTO.safeParse)
    const requestBodyMatch = methodBody.match(/(\w+)\.safeParse\(/);
    const requestBodySchema = requestBodyMatch ? requestBodyMatch[1] : null;

    routes.push({
      method,
      path,
      responseType,
      requestBodySchema,
      isAuthenticated,
    });
  }

  return routes;
}

function findMethodEnd(content: string, startIndex: number): number {
  let depth = 0;
  let inMethod = false;

  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];

    if (char === "{") {
      depth++;
      inMethod = true;
    } else if (char === "}") {
      depth--;
      if (inMethod && depth === 0) {
        return i + 1;
      }
    }
  }

  return content.length;
}

async function parseAllRoutes(): Promise<ParsedRoute[]> {
  const routeFiles = findRouteFiles(routesDirectory);
  const allRoutes: ParsedRoute[] = [];

  for (const routeFile of routeFiles) {
    try {
      const routes = parseRouteFile(routeFile);
      allRoutes.push(...routes);
    } catch (error) {
      console.warn(`Error parsing ${routeFile}:`, error);
    }
  }

  return allRoutes;
}

async function loadSchemaFromContract(
  schemaName: string,
): Promise<z.ZodType | null> {
  try {
    // Try to import from various contract modules
    const contractModules = [
      "user",
      "product",
      "settings",
      "admin",
      "announcement",
      "auth",
      "automatic-topup",
      "order",
      "product-category",
      "product-image",
      "product-order-history",
      "product-stock-history",
      "shop",
      "topup",
    ];

    for (const moduleName of contractModules) {
      try {
        const contractPath = resolve(
          scriptDirectory,
          "..",
          "..",
          "packages",
          "contract",
          "src",
          `${moduleName}.ts`,
        );
        const moduleUrl = pathToFileURL(contractPath).href;
        const module = await import(moduleUrl);

        if (module[schemaName]) {
          return module[schemaName] as z.ZodType;
        }
      } catch {
        // Continue to next module
      }
    }

    return null;
  } catch (error) {
    console.warn(`Could not load schema ${schemaName}:`, error);
    return null;
  }
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateSummary(method: string, path: string): string {
  const segments = path.split("/").filter(Boolean);
  const resource = segments[segments.length - 1] || "resource";

  return `${method} ${capitalizeFirstLetter(resource)}`;
}

async function main() {
  const routes = await parseAllRoutes();

  const openApiSpec: Record<string, unknown> = {
    openapi: "3.1.0",
    info: {
      title: "Barbord API",
      version: "1.0.0",
    },
    paths: {},
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  };

  const paths = openApiSpec.paths as Record<string, Record<string, unknown>>;

  for (const route of routes) {
    const endpointPath = `/api/v1${toOpenApiPath(route.path)}`;

    if (!paths[endpointPath]) {
      paths[endpointPath] = {};
    }

    const operation: Record<string, unknown> = {
      operationId: toOperationId(route.method, route.path),
      summary: generateSummary(route.method, route.path),
      tags: [toTag(route.path)],
      responses: {
        "200": {
          description: "Successful response",
          content: {
            "application/json": {
              schema: {},
            },
          },
        },
      },
    };

    // Add response schema if we have a response type
    if (route.responseType) {
      // Check if it's an array type (e.g., UserDTO[])
      const arrayMatch = route.responseType.match(/^(.+)\[\]$/);
      const isArray = !!arrayMatch;
      const baseType = isArray ? arrayMatch[1] : route.responseType;

      const schema = await loadSchemaFromContract(baseType);
      if (schema) {
        const responses = operation.responses as Record<string, any>;
        const jsonSchema = z.toJSONSchema(schema);

        if (isArray) {
          responses["200"].content["application/json"].schema = {
            type: "array",
            items: jsonSchema,
          };
        } else {
          responses["200"].content["application/json"].schema = jsonSchema;
        }
      } else {
        // If we can't find the schema, add a type reference
        const responses = operation.responses as Record<string, any>;
        responses["200"].content["application/json"].schema = {
          type: isArray ? "array" : "object",
          description: `Response type: ${route.responseType}`,
        };
      }
    }

    // Add request body if we have a request body schema
    if (route.requestBodySchema) {
      const schema = await loadSchemaFromContract(route.requestBodySchema);
      if (schema) {
        operation.requestBody = {
          description: "Request body",
          required: true,
          content: {
            "application/json": {
              schema: z.toJSONSchema(schema),
            },
          },
        };
      }

      // Add 400 response for validation errors
      const responses = operation.responses as Record<string, any>;
      responses["400"] = {
        description: "Validation error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
                details: { type: "object" },
              },
            },
          },
        },
      };
    }

    // Add security if authenticated
    if (route.isAuthenticated) {
      operation.security = [{ bearerAuth: [] }];

      // Add 401 response
      const responses = operation.responses as Record<string, any>;
      responses["401"] = {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
                details: { type: "string" },
              },
            },
          },
        },
      };
    }

    paths[endpointPath][route.method.toLowerCase()] = operation;
  }

  mkdirSync(dirname(outputFilePath), { recursive: true });
  writeFileSync(outputFilePath, JSON.stringify(openApiSpec, null, 2));

  console.log(
    `Generated OpenAPI spec with ${routes.length} route(s): ${outputFilePath}`,
  );
}

main().catch((error) => {
  console.error("Error generating OpenAPI spec:", error);
  process.exit(1);
});
