import { LanguageModelV1, ProviderV1 } from "@ai-sdk/provider";
import { loadApiKey, withoutTrailingSlash } from "@ai-sdk/provider-utils";
import { ZentryChatModelId, ZentryChatSettings, ZentryConfig } from "./zentry-types";
import { OpenAIProviderSettings } from "@ai-sdk/openai";
import { ZentryGenericLanguageModel } from "./zentry-generic-language-model";
import { OpenAIChatSettings } from "@ai-sdk/openai/internal";
import { AnthropicMessagesSettings } from "@ai-sdk/anthropic/internal";
import { AnthropicProviderSettings } from "@ai-sdk/anthropic";

export interface ZentryProvider extends ProviderV1 {
  (modelId: ZentryChatModelId, settings?: ZentryChatSettings): LanguageModelV1;

  chat(modelId: ZentryChatModelId, settings?: ZentryChatSettings): LanguageModelV1;
  completion(modelId: ZentryChatModelId, settings?: ZentryChatSettings): LanguageModelV1;

  languageModel(
    modelId: ZentryChatModelId,
    settings?: ZentryChatSettings
  ): LanguageModelV1;
}

export interface ZentryProviderSettings
  extends OpenAIChatSettings,
    AnthropicMessagesSettings {
  baseURL?: string;
  /**
   * Custom fetch implementation. You can use it as a middleware to intercept
   * requests or to provide a custom fetch implementation for e.g. testing
   */
  fetch?: typeof fetch;
  /**
   * @internal
   */
  generateId?: () => string;
  /**
   * Custom headers to include in the requests.
   */
  headers?: Record<string, string>;
  name?: string;
  zentryApiKey?: string;
  apiKey?: string;
  provider?: string;
  modelType?: "completion" | "chat";
  zentryConfig?: ZentryConfig;

  /**
   * The configuration for the provider.
   */
  config?: OpenAIProviderSettings | AnthropicProviderSettings;
}

export function createZentry(
  options: ZentryProviderSettings = {
    provider: "openai",
  }
): ZentryProvider {
  const baseURL =
    withoutTrailingSlash(options.baseURL) ?? "http://api.openai.com";
  const getHeaders = () => ({
    ...options.headers,
  });

  const createGenericModel = (
    modelId: ZentryChatModelId,
    settings: ZentryChatSettings = {}
  ) =>
    new ZentryGenericLanguageModel(
      modelId,
      settings,
      {
        baseURL,
        fetch: options.fetch,
        headers: getHeaders(),
        provider: options.provider || "openai",
        name: options.name,
        zentryApiKey: options.zentryApiKey,
        apiKey: options.apiKey,
        zentryConfig: options.zentryConfig,
      },
      options.config
    );

  const createCompletionModel = (
    modelId: ZentryChatModelId,
    settings: ZentryChatSettings = {}
  ) =>
    new ZentryGenericLanguageModel(
      modelId,
      settings,
      {
        baseURL,
        fetch: options.fetch,
        headers: getHeaders(),
        provider: options.provider || "openai",
        name: options.name,
        zentryApiKey: options.zentryApiKey,
        apiKey: options.apiKey,
        zentryConfig: options.zentryConfig,
        modelType: "completion",
      },
      options.config
    );

  const createChatModel = (
    modelId: ZentryChatModelId,
    settings: ZentryChatSettings = {}
  ) =>
    new ZentryGenericLanguageModel(
      modelId,
      settings,
      {
        baseURL,
        fetch: options.fetch,
        headers: getHeaders(),
        provider: options.provider || "openai",
        name: options.name,
        zentryApiKey: options.zentryApiKey,
        apiKey: options.apiKey,
        zentryConfig: options.zentryConfig,
        modelType: "completion",
      },
      options.config
    );

  const provider = function (
    modelId: ZentryChatModelId,
    settings: ZentryChatSettings = {}
  ) {
    if (new.target) {
      throw new Error(
        "The Zentry model function cannot be called with the new keyword."
      );
    }

    return createGenericModel(modelId, settings);
  };

  provider.languageModel = createGenericModel;
  provider.completion = createCompletionModel;
  provider.chat = createChatModel;

  return provider as unknown as ZentryProvider;
}

export const zentry = createZentry();
