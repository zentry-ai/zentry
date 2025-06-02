import { ZentryProviderSettings } from "./zentry-provider";
import { OpenAIChatSettings } from "@ai-sdk/openai/internal";
import { AnthropicMessagesSettings } from "@ai-sdk/anthropic/internal";
import {
  LanguageModelV1
} from "@ai-sdk/provider";

export type ZentryChatModelId =
  | (string & NonNullable<unknown>);

export interface ZentryConfigSettings {
  user_id?: string;
  app_id?: string;
  agent_id?: string;
  run_id?: string;
  org_name?: string;
  project_name?: string;
  org_id?: string;
  project_id?: string;
  metadata?: Record<string, any>;
  filters?: Record<string, any>;
  infer?: boolean;
  page?: number;
  page_size?: number;
  zentryApiKey?: string;
  top_k?: number;
  threshold?: number;
  rerank?: boolean;
  enable_graph?: boolean;
  output_format?: string;
}

export interface ZentryChatConfig extends ZentryConfigSettings, ZentryProviderSettings {}

export interface ZentryConfig extends ZentryConfigSettings {}
export interface ZentryChatSettings extends OpenAIChatSettings, AnthropicMessagesSettings, ZentryConfigSettings {}

export interface ZentryStreamResponse extends Awaited<ReturnType<LanguageModelV1['doStream']>> {
  memories: any;
}
