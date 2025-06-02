from typing import Any, Optional

from embedchain.config.base_config import BaseConfig
from embedchain.helpers.json_serializable import register_deserializable


@register_deserializable
class ZentryConfig(BaseConfig):
    def __init__(self, api_key: str, top_k: Optional[int] = 10):
        self.api_key = api_key
        self.top_k = top_k

    @staticmethod
    def from_config(config: Optional[dict[str, Any]]):
        if config is None:
            return ZentryConfig()
        else:
            return ZentryConfig(
                api_key=config.get("api_key", ""),
                init_config=config.get("top_k", 10),
            )
