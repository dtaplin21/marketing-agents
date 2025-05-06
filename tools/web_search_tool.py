from typing import List, Dict, Any
import aiohttp
import logging

class WebSearchTool:
    """Tool for web search operations"""
    def __init__(self, config: Dict[str, Any]):
        self.api_key = config.get('search_api_key')
        self.endpoint = config.get('search_endpoint')
        self.logger = logging.getLogger(__name__)

    async def search(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """Perform web search"""
        try:
            async with aiohttp.ClientSession() as session:
                params = {
                    'q': query,
                    'num': max_results
                }
                async with session.get(self.endpoint, params=params) as response:
                    if response.status == 200:
                        return await response.json()
                    return []
        except Exception as e:
            self.logger.error(f"Error performing web search: {str(e)}")
            return [] 