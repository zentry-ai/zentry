import { withoutTrailingSlash } from '@ai-sdk/provider-utils'

import { ZentryGenericLanguageModel } from './zentry-generic-language-model'
import { ZentryChatModelId, ZentryChatSettings } from './zentry-types'
import { ZentryProviderSettings } from './zentry-provider'

export class Zentry {
  readonly baseURL: string
  readonly headers?: any

  constructor(options: ZentryProviderSettings = {
    provider: 'openai',
  }) {
    this.baseURL =
      withoutTrailingSlash(options.baseURL) ?? 'http://127.0.0.1:11434/api'

    this.headers = options.headers
  }

  private get baseConfig() {
    return {
      baseURL: this.baseURL,
      headers: this.headers,
    }
  }

  chat(modelId: ZentryChatModelId, settings: ZentryChatSettings = {}) {
    return new ZentryGenericLanguageModel(modelId, settings, {
      provider: 'openai',
      modelType: 'chat',
      ...this.baseConfig,
    })
  }

  completion(modelId: ZentryChatModelId, settings: ZentryChatSettings = {}) {
    return new ZentryGenericLanguageModel(modelId, settings, {
      provider: 'openai',
      modelType: 'completion',
      ...this.baseConfig,
    })
  }
}