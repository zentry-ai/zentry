import importlib
from typing import Optional

from zentry.configs.embeddings.base import BaseEmbedderConfig
from zentry.configs.llms.base import BaseLlmConfig
from zentry.embeddings.mock import MockEmbeddings


def load_class(class_type):
    module_path, class_name = class_type.rsplit(".", 1)
    module = importlib.import_module(module_path)
    return getattr(module, class_name)


class LlmFactory:
    provider_to_class = {
        "ollama": "zentry.llms.ollama.OllamaLLM",
        "openai": "zentry.llms.openai.OpenAILLM",
        "groq": "zentry.llms.groq.GroqLLM",
        "together": "zentry.llms.together.TogetherLLM",
        "aws_bedrock": "zentry.llms.aws_bedrock.AWSBedrockLLM",
        "litellm": "zentry.llms.litellm.LiteLLM",
        "azure_openai": "zentry.llms.azure_openai.AzureOpenAILLM",
        "openai_structured": "zentry.llms.openai_structured.OpenAIStructuredLLM",
        "anthropic": "zentry.llms.anthropic.AnthropicLLM",
        "azure_openai_structured": "zentry.llms.azure_openai_structured.AzureOpenAIStructuredLLM",
        "gemini": "zentry.llms.gemini.GeminiLLM",
        "deepseek": "zentry.llms.deepseek.DeepSeekLLM",
        "xai": "zentry.llms.xai.XAILLM",
        "sarvam": "zentry.llms.sarvam.SarvamLLM",
        "lmstudio": "zentry.llms.lmstudio.LMStudioLLM",
        "langchain": "zentry.llms.langchain.LangchainLLM",
    }

    @classmethod
    def create(cls, provider_name, config):
        class_type = cls.provider_to_class.get(provider_name)
        if class_type:
            llm_instance = load_class(class_type)
            base_config = BaseLlmConfig(**config)
            return llm_instance(base_config)
        else:
            raise ValueError(f"Unsupported Llm provider: {provider_name}")


class EmbedderFactory:
    provider_to_class = {
        "openai": "zentry.embeddings.openai.OpenAIEmbedding",
        "ollama": "zentry.embeddings.ollama.OllamaEmbedding",
        "huggingface": "zentry.embeddings.huggingface.HuggingFaceEmbedding",
        "azure_openai": "zentry.embeddings.azure_openai.AzureOpenAIEmbedding",
        "gemini": "zentry.embeddings.gemini.GoogleGenAIEmbedding",
        "vertexai": "zentry.embeddings.vertexai.VertexAIEmbedding",
        "together": "zentry.embeddings.together.TogetherEmbedding",
        "lmstudio": "zentry.embeddings.lmstudio.LMStudioEmbedding",
        "langchain": "zentry.embeddings.langchain.LangchainEmbedding",
        "aws_bedrock": "zentry.embeddings.aws_bedrock.AWSBedrockEmbedding",
    }

    @classmethod
    def create(cls, provider_name, config, vector_config: Optional[dict]):
        if provider_name == "upstash_vector" and vector_config and vector_config.enable_embeddings:
            return MockEmbeddings()
        class_type = cls.provider_to_class.get(provider_name)
        if class_type:
            embedder_instance = load_class(class_type)
            base_config = BaseEmbedderConfig(**config)
            return embedder_instance(base_config)
        else:
            raise ValueError(f"Unsupported Embedder provider: {provider_name}")


class VectorStoreFactory:
    provider_to_class = {
        "qdrant": "zentry.vector_stores.qdrant.Qdrant",
        "chroma": "zentry.vector_stores.chroma.ChromaDB",
        "pgvector": "zentry.vector_stores.pgvector.PGVector",
        "milvus": "zentry.vector_stores.milvus.MilvusDB",
        "upstash_vector": "zentry.vector_stores.upstash_vector.UpstashVector",
        "azure_ai_search": "zentry.vector_stores.azure_ai_search.AzureAISearch",
        "pinecone": "zentry.vector_stores.pinecone.PineconeDB",
        "redis": "zentry.vector_stores.redis.RedisDB",
        "elasticsearch": "zentry.vector_stores.elasticsearch.ElasticsearchDB",
        "vertex_ai_vector_search": "zentry.vector_stores.vertex_ai_vector_search.GoogleMatchingEngine",
        "opensearch": "zentry.vector_stores.opensearch.OpenSearchDB",
        "supabase": "zentry.vector_stores.supabase.Supabase",
        "weaviate": "zentry.vector_stores.weaviate.Weaviate",
        "faiss": "zentry.vector_stores.faiss.FAISS",
        "langchain": "zentry.vector_stores.langchain.Langchain",
    }

    @classmethod
    def create(cls, provider_name, config):
        class_type = cls.provider_to_class.get(provider_name)
        if class_type:
            if not isinstance(config, dict):
                config = config.model_dump()
            vector_store_instance = load_class(class_type)
            return vector_store_instance(**config)
        else:
            raise ValueError(f"Unsupported VectorStore provider: {provider_name}")

    @classmethod
    def reset(cls, instance):
        instance.reset()
        return instance
