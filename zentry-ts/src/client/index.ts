import { MemoryClient } from "./zentry";
import type * as MemoryTypes from "./zentry.types";

// Re-export all types from zentry.types
export type {
  MemoryOptions,
  ProjectOptions,
  Memory,
  MemoryHistory,
  MemoryUpdateBody,
  ProjectResponse,
  PromptUpdatePayload,
  SearchOptions,
  Webhook,
  WebhookPayload,
  Messages,
  Message,
  AllUsers,
  User,
  FeedbackPayload,
  Feedback,
} from "./zentry.types";

// Export the main client
export { MemoryClient };
export default MemoryClient;
