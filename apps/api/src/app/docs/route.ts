import { ApiReference } from "@scalar/nextjs-api-reference";

const config = {
  url: "/openapi.json",
  theme: "elysiajs",
  layout: "modern",
  defaultOpenAllTags: false,
  expandAllModelSections: false,
  hideClientButton: true,
  hideDarkModeToggle: true,
  showSidebar: true,
  showDeveloperTools: "localhost",
  showToolbar: "localhost",
  operationTitleSource: "summary",
  persistAuth: false,
  telemetry: true,
  isEditable: false,
  isLoading: false,
  hideModels: false,
  documentDownloadType: "both",
  hideTestRequestButton: false,
  hideSearch: false,
  showOperationId: false,
  withDefaultFonts: true,
  defaultOpenFirstTag: true,
  expandAllResponses: false,
  orderSchemaPropertiesBy: "alpha",
  orderRequiredPropertiesFirst: true,
  _integration: "nextjs",
  default: false,
} as const;

export const GET = ApiReference(config);
